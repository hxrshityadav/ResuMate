package org.example.ai_resume_builder.usage;

import org.example.ai_resume_builder.entity.UsageRecordEntity;
import org.example.ai_resume_builder.entity.UserEntity;
import org.example.ai_resume_builder.exception.RateLimitExceededException;
import org.example.ai_resume_builder.repository.UsageRecordRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class RedisRateLimiterService {

    private static final Logger log = LoggerFactory.getLogger(RedisRateLimiterService.class);

    private final StringRedisTemplate redisTemplate;
    private final UsageRecordRepository usageRecordRepository;
    private final Map<String, AtomicInteger> inMemoryFallback = new ConcurrentHashMap<>();

    public RedisRateLimiterService(StringRedisTemplate redisTemplate, UsageRecordRepository usageRecordRepository) {
        this.redisTemplate = redisTemplate;
        this.usageRecordRepository = usageRecordRepository;
    }

    @Transactional
    public void checkAndIncrementLimit(UserEntity user, String action) {
        String userId = user != null ? user.getId().toString() : "anonymous";
        String planType = user != null ? user.getPlanType() : "FREE";
        RateLimitPlan plan = RateLimitPlan.fromString(planType);

        int maxAllowed = switch (action.toLowerCase()) {
            case "generate" -> plan.getMaxGenerationsPerDay();
            case "improve" -> plan.getMaxImprovementsPerDay();
            case "ats" -> plan.getMaxAtsChecksPerDay();
            default -> 10;
        };

        LocalDate today = LocalDate.now(ZoneOffset.UTC);
        String redisKey = String.format("rate:%s:%s:%s", userId, action.toLowerCase(), today);

        long currentCount = 0;
        try {
            Long count = redisTemplate.opsForValue().increment(redisKey);
            if (count != null && count == 1) {
                LocalDateTime endOfDay = today.plusDays(1).atStartOfDay();
                long secondsUntilReset = Duration.between(LocalDateTime.now(ZoneOffset.UTC), endOfDay).getSeconds();
                redisTemplate.expire(redisKey, Duration.ofSeconds(Math.max(secondsUntilReset, 60)));
            }
            currentCount = count != null ? count : 1;
        } catch (Exception redisEx) {
            log.warn("Redis rate limiter unavailable. Operating with in-memory fallback. Error: {}", redisEx.getMessage());
            currentCount = inMemoryFallback.computeIfAbsent(redisKey, k -> new AtomicInteger(0)).incrementAndGet();
        }

        long resetTimestamp = today.plusDays(1).atStartOfDay().toEpochSecond(ZoneOffset.UTC);
        long retryAfterSeconds = Math.max(resetTimestamp - LocalDateTime.now(ZoneOffset.UTC).toEpochSecond(ZoneOffset.UTC), 1);

        if (currentCount > maxAllowed) {
            log.warn("User [{}] exceeded daily limit for action [{}]. Count: {}/{}", userId, action, currentCount, maxAllowed);
            throw new RateLimitExceededException(
                    String.format("Daily limit exceeded for %s. You have used %d/%d requests allowed on your %s plan.", action, currentCount - 1, maxAllowed, plan.name()),
                    retryAfterSeconds,
                    resetTimestamp
            );
        }

        if (user != null) {
            try {
                UsageRecordEntity record = usageRecordRepository.findByUserIdAndUsageDate(user.getId(), today)
                        .orElseGet(() -> {
                            UsageRecordEntity newRec = new UsageRecordEntity();
                            newRec.setUser(user);
                            newRec.setUsageDate(today);
                            return newRec;
                        });

                switch (action.toLowerCase()) {
                    case "generate" -> record.setGenerationCount(record.getGenerationCount() + 1);
                    case "improve" -> record.setImprovementCount(record.getImprovementCount() + 1);
                    case "ats" -> record.setAtsCheckCount(record.getAtsCheckCount() + 1);
                }
                usageRecordRepository.save(record);
            } catch (Exception dbEx) {
                log.warn("Failed to persist usage snapshot to database: {}", dbEx.getMessage());
            }
        }
    }
}

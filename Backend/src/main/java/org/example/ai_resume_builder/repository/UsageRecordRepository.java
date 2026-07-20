package org.example.ai_resume_builder.repository;

import org.example.ai_resume_builder.entity.UsageRecordEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UsageRecordRepository extends JpaRepository<UsageRecordEntity, UUID> {
    Optional<UsageRecordEntity> findByUserIdAndUsageDate(UUID userId, LocalDate usageDate);
}

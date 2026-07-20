package org.example.ai_resume_builder.usage;

public enum RateLimitPlan {

    FREE(20, 50, 50),
    PRO(100, 500, 500),
    ENTERPRISE(1000, 5000, 5000);

    private final int maxGenerationsPerDay;
    private final int maxImprovementsPerDay;
    private final int maxAtsChecksPerDay;

    RateLimitPlan(int maxGenerationsPerDay, int maxImprovementsPerDay, int maxAtsChecksPerDay) {
        this.maxGenerationsPerDay = maxGenerationsPerDay;
        this.maxImprovementsPerDay = maxImprovementsPerDay;
        this.maxAtsChecksPerDay = maxAtsChecksPerDay;
    }

    public int getMaxGenerationsPerDay() {
        return maxGenerationsPerDay;
    }

    public int getMaxImprovementsPerDay() {
        return maxImprovementsPerDay;
    }

    public int getMaxAtsChecksPerDay() {
        return maxAtsChecksPerDay;
    }

    public static RateLimitPlan fromString(String planName) {
        if (planName == null) return FREE;
        try {
            return RateLimitPlan.valueOf(planName.toUpperCase());
        } catch (IllegalArgumentException e) {
            return FREE;
        }
    }
}

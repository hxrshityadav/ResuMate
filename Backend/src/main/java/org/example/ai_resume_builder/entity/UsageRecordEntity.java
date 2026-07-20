package org.example.ai_resume_builder.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "usage_records", uniqueConstraints = {
    @UniqueConstraint(name = "idx_user_usage_date", columnNames = {"user_id", "usage_date"})
})
public class UsageRecordEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @Column(name = "usage_date", nullable = false)
    private LocalDate usageDate;

    @Column(name = "generation_count", nullable = false)
    private Integer generationCount = 0;

    @Column(name = "improvement_count", nullable = false)
    private Integer improvementCount = 0;

    @Column(name = "ats_check_count", nullable = false)
    private Integer atsCheckCount = 0;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private ZonedDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private ZonedDateTime updatedAt;

    public UsageRecordEntity() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UserEntity getUser() { return user; }
    public void setUser(UserEntity user) { this.user = user; }

    public LocalDate getUsageDate() { return usageDate; }
    public void setUsageDate(LocalDate usageDate) { this.usageDate = usageDate; }

    public Integer getGenerationCount() { return generationCount; }
    public void setGenerationCount(Integer generationCount) { this.generationCount = generationCount; }

    public Integer getImprovementCount() { return improvementCount; }
    public void setImprovementCount(Integer improvementCount) { this.improvementCount = improvementCount; }

    public Integer getAtsCheckCount() { return atsCheckCount; }
    public void setAtsCheckCount(Integer atsCheckCount) { this.atsCheckCount = atsCheckCount; }

    public ZonedDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(ZonedDateTime createdAt) { this.createdAt = createdAt; }

    public ZonedDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(ZonedDateTime updatedAt) { this.updatedAt = updatedAt; }
}

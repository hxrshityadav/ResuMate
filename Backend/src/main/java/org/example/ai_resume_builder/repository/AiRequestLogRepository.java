package org.example.ai_resume_builder.repository;

import org.example.ai_resume_builder.entity.AiRequestLogEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AiRequestLogRepository extends JpaRepository<AiRequestLogEntity, UUID> {
    List<AiRequestLogEntity> findTop50ByUserIdOrderByCreatedAtDesc(UUID userId);
}

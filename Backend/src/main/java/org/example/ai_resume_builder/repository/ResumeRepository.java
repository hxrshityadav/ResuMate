package org.example.ai_resume_builder.repository;

import org.example.ai_resume_builder.entity.ResumeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ResumeRepository extends JpaRepository<ResumeEntity, UUID> {
    List<ResumeEntity> findByUserIdOrderByUpdatedAtDesc(UUID userId);
    Optional<ResumeEntity> findByIdAndUserId(UUID id, UUID userId);
}

package org.example.ai_resume_builder.repository;

import org.example.ai_resume_builder.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, UUID> {
    Optional<UserEntity> findByClerkId(String clerkId);
    Optional<UserEntity> findByEmail(String email);
    boolean existsByClerkId(String clerkId);
}

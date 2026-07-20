package org.example.ai_resume_builder.security;

import org.example.ai_resume_builder.entity.UserEntity;
import org.example.ai_resume_builder.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserProvisioningService {

    private static final Logger log = LoggerFactory.getLogger(UserProvisioningService.class);

    private final UserRepository userRepository;

    public UserProvisioningService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public UserEntity getOrCreateUser(String clerkId, String email, String firstName, String lastName) {
        return userRepository.findByClerkId(clerkId)
                .orElseGet(() -> {
                    log.info("Auto-provisioning new SaaS user in Postgres for Clerk ID: [{}]", clerkId);
                    UserEntity newUser = new UserEntity();
                    newUser.setClerkId(clerkId);
                    newUser.setEmail(email != null ? email : clerkId + "@clerk.user");
                    newUser.setFirstName(firstName);
                    newUser.setLastName(lastName);
                    newUser.setPlanType("FREE");
                    return userRepository.save(newUser);
                });
    }
}

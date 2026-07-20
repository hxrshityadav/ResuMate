package org.example.ai_resume_builder.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

public class UserPrincipal implements UserDetails {

    private final UUID id;
    private final String clerkId;
    private final String email;
    private final String planType;

    public UserPrincipal(UUID id, String clerkId, String email, String planType) {
        this.id = id;
        this.clerkId = clerkId;
        this.email = email;
        this.planType = planType != null ? planType : "FREE";
    }

    public UUID getId() {
        return id;
    }

    public String getClerkId() {
        return clerkId;
    }

    public String getEmail() {
        return email;
    }

    public String getPlanType() {
        return planType;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + planType.toUpperCase()));
    }

    @Override
    public String getPassword() {
        return null;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}

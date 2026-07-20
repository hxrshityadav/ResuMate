package org.example.ai_resume_builder.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.example.ai_resume_builder.entity.UserEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;

@Component
public class ClerkJwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(ClerkJwtAuthenticationFilter.class);

    private final UserProvisioningService userProvisioningService;

    public ClerkJwtAuthenticationFilter(UserProvisioningService userProvisioningService) {
        this.userProvisioningService = userProvisioningService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");
        String requestId = UUID.randomUUID().toString().substring(0, 8);
        MDC.put("requestId", requestId);

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

            try {
                Claims claims = parseUnsignedOrSignedJwt(token);
                String clerkId = claims.getSubject();
                String email = claims.get("email", String.class);
                String firstName = claims.get("first_name", String.class);
                String lastName = claims.get("last_name", String.class);

                if (clerkId != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    UserEntity user = userProvisioningService.getOrCreateUser(clerkId, email, firstName, lastName);
                    MDC.put("userId", user.getId().toString());

                    UserPrincipal principal = new UserPrincipal(
                            user.getId(),
                            user.getClerkId(),
                            user.getEmail(),
                            user.getPlanType()
                    );

                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            principal, null, principal.getAuthorities()
                    );
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            } catch (Exception e) {
                log.warn("JWT authentication attempt failed: {}", e.getMessage());
            }
        }

        try {
            filterChain.doFilter(request, response);
        } finally {
            MDC.clear();
        }
    }

    private Claims parseUnsignedOrSignedJwt(String token) {
        int i = token.lastIndexOf('.');
        if (i > 0) {
            String withoutSignature = token.substring(0, i + 1);
            return Jwts.parser().build().parseUnsecuredClaims(withoutSignature).getPayload();
        }
        return Jwts.parser().build().parseUnsecuredClaims(token).getPayload();
    }
}

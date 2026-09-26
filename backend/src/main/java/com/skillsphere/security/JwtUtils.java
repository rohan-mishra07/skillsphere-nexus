package com.skillsphere.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtils {
    private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

    @Value("${skillsphere.app.jwtSecret}")
    private String jwtSecret;

    @Value("${skillsphere.app.jwtExpirationMs}")
    private int jwtExpirationMs;

    /**
     * Generates a signed JWT containing the user's email as the subject
     * and their single role as a custom {@code "role"} claim.
     *
     * <p>Embedding the role claim here allows downstream microservices
     * (learning-service, career-service) to reconstruct Spring Security
     * authorities from the token alone — no shared user-DB lookup needed.</p>
     */
    @SuppressWarnings("null")
    public String generateJwtToken(Authentication authentication) {
        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();

        // Extract the single granted authority (e.g. "ROLE_ADMIN") to embed in the token.
        String role = userPrincipal.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse("");

        return Jwts.builder()
                .setSubject(userPrincipal.getUsername())
                .claim("role", role)              // ← custom claim read by microservice filters
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .signWith(key(), SignatureAlgorithm.HS256)
                .compact();
    }

    @SuppressWarnings("null")
    private Key key() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
    }

    @SuppressWarnings("null")
    public String getUserNameFromJwtToken(String token) {
        return Jwts.parserBuilder().setSigningKey(key()).build()
                .parseClaimsJws(token).getBody().getSubject();
    }

    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parserBuilder().setSigningKey(key()).build().parse(authToken);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            logger.error("Invalid JWT token: {}", e.getMessage());
        }
        return false;
    }
}

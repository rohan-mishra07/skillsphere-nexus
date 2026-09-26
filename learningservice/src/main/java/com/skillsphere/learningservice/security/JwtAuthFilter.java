package com.skillsphere.learningservice.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;

import java.io.IOException;
import java.security.Key;
import java.util.Collections;
import java.util.List;

/**
 * Stateless JWT authentication filter for the Learning Service.
 *
 * <p>Because this microservice does not own the User store, it cannot
 * call a {@code UserDetailsService}. Instead it parses the JWT claims
 * directly to reconstruct the {@link org.springframework.security.core.Authentication}
 * object, using the {@code "role"} claim embedded by the auth service at login.</p>
 *
 * <p>Role claim format expected in the token: a plain string matching the
 * {@code Role} enum value, e.g. {@code "ROLE_ADMIN"}, {@code "ROLE_EMPLOYEE"}.</p>
 */
public class JwtAuthFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthFilter.class);

    @Autowired
    private JwtUtils jwtUtils;

    @Value("${skillsphere.app.jwtSecret}")
    private String jwtSecret;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {

        try {
            String jwt = parseJwt(request);
            if (jwt != null && jwtUtils.validateJwtToken(jwt)) {
                String username = jwtUtils.getUserNameFromJwtToken(jwt);

                // Extract the "role" claim embedded by the auth service at token issuance.
                List<GrantedAuthority> authorities = extractAuthorities(jwt);

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(username, null, authorities);
                authentication.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception e) {
            logger.error("Cannot set user authentication: {}", e.getMessage());
        }

        filterChain.doFilter(request, response);
    }

    /**
     * Reads the {@code "role"} claim from the JWT and wraps it as a
     * {@link SimpleGrantedAuthority}. Falls back to an empty list if
     * the claim is absent (unauthenticated requests will be rejected by
     * the method-level {@code @PreAuthorize} checks).
     */
    private List<GrantedAuthority> extractAuthorities(String token) {
        try {
            Key key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            // Auth service stores the role as a single "role" claim string.
            String role = claims.get("role", String.class);
            if (role != null && !role.isBlank()) {
                return Collections.singletonList(new SimpleGrantedAuthority(role));
            }
        } catch (Exception e) {
            logger.warn("Could not extract role claim from JWT: {}", e.getMessage());
        }
        return Collections.emptyList();
    }

    private String parseJwt(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");
        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
            return headerAuth.substring(7);
        }
        return null;
    }
}

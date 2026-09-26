package com.skillsphere.careerservice.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.security.Key;
import java.util.Collections;
import java.util.List;

/**
 * Stateless JWT authentication filter for the Career Service.
 *
 * <p>Because this microservice does not own the User store, it reads the
 * {@code "role"} claim embedded in the JWT by the auth service at login
 * time to reconstruct the caller's {@link org.springframework.security.core.Authentication}
 * object — no database round-trip required.</p>
 *
 * <p>Role claim format: a single {@code String} matching the {@code Role}
 * enum value (e.g. {@code "ROLE_ADMIN"}, {@code "ROLE_EMPLOYEE"}).</p>
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
     * Reads the {@code "role"} claim and wraps it as a
     * {@link SimpleGrantedAuthority}.  Returns an empty list if the claim
     * is absent — the caller will be treated as unauthenticated and
     * {@code @PreAuthorize} will reject the request with 403.
     */
    private List<GrantedAuthority> extractAuthorities(String token) {
        try {
            Key key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

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

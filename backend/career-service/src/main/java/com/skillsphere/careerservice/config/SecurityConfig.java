package com.skillsphere.careerservice.config;

import com.skillsphere.careerservice.security.JwtAuthFilter;
import com.skillsphere.careerservice.security.JwtUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

/**
 * Spring Security configuration for the Career Service (Milestone 4).
 *
 * <p>Design decisions:
 * <ul>
 *   <li>Stateless — no HTTP session; every request must carry a valid JWT.</li>
 *   <li>{@code @EnableMethodSecurity(prePostEnabled = true)} activates
 *       {@code @PreAuthorize} on controller methods, enabling fine-grained
 *       role enforcement without cluttering the {@code HttpSecurity} DSL.</li>
 *   <li>H2 console is open for local development convenience.</li>
 *   <li>All {@code /api/career/**} endpoints require a valid token;
 *       per-method role checks are declared directly on {@link
 *       com.skillsphere.careerservice.controller.JobController}.</li>
 * </ul>
 * </p>
 */
@Configuration
@EnableMethodSecurity(prePostEnabled = true)   // ← required for @PreAuthorize to fire
public class SecurityConfig {

    @Bean
    public JwtUtils jwtUtils() {
        return new JwtUtils();
    }

    @Bean
    public JwtAuthFilter jwtAuthFilter() {
        return new JwtAuthFilter();
    }

    @Bean
    @SuppressWarnings("null")
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // H2 console — dev only
                .requestMatchers("/h2-console/**").permitAll()
                // All career API endpoints require a valid JWT;
                // per-role decisions are made by @PreAuthorize on the controller.
                .requestMatchers("/api/career/**").authenticated()
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter(), UsernamePasswordAuthenticationFilter.class);

        // Allow H2 console frames in dev
        http.headers(headers -> headers.frameOptions(frame -> frame.disable()));

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of("*"));
        configuration.setAllowedMethods(
            Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(
            Arrays.asList("Authorization", "Content-Type", "X-Requested-With"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}

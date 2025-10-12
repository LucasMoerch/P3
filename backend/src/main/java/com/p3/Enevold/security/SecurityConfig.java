package com.p3.Enevold.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.*;

import java.util.*;

@Configuration
public class SecurityConfig {

    @Value("${app.admin-emails:}")
    private String adminEmailsCsv;

    @Value("${app.allowed-origins:http://localhost:8080}")
    private String allowedOriginsCsv;

    @Bean
    SecurityFilterChain security(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        // Public files
                        .requestMatchers("/", "/index.html", "/login.html", "/users/**", "/static/**").permitAll()
                        // Admin routes need admin role
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        // Any other API needs an authenticated user
                        .requestMatchers("/api/**").authenticated()
                        // Everything else allow
                        .anyRequest().permitAll()
                )
                .oauth2Login(oauth -> oauth
                        .userInfoEndpoint(u -> u.oidcUserService(userRequest -> {
                            // Ask Google for user info (id token + userinfo)
                            var delegate = new org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService();
                            OidcUser user = delegate.loadUser(userRequest);

                            String email = Optional.ofNullable(user.getEmail()).orElse("").toLowerCase(Locale.ROOT);
                            boolean verified = Boolean.TRUE.equals(user.getEmailVerified());

                            if (!verified) throw new RuntimeException("Google email not verified.");

                            // admins from env gets ROLE_ADMIN, everyone gets ROLE_STAFF
                            Set<String> adminEmails = csvToSet(adminEmailsCsv);
                            boolean isAdmin = adminEmails.contains(email);

                            Set<GrantedAuthority> roles = new HashSet<>(user.getAuthorities());
                            roles.add(new SimpleGrantedAuthority("ROLE_STAFF"));
                            if (isAdmin) roles.add(new SimpleGrantedAuthority("ROLE_ADMIN"));

                            // Return same user but with roles
                            return new org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser(
                                    roles, user.getIdToken(), user.getUserInfo()
                            );
                        }))
                        // After successful login, send them to a simple static page
                        .defaultSuccessUrl("http://localhost:5173/", true)
                )
                .logout(logout -> logout
                        .logoutUrl("/api/logout")
                        .logoutSuccessHandler((req, res, auth) -> res.setStatus(200))
                )
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .httpBasic(Customizer.withDefaults());

        return http.build();
    }

    private CorsConfigurationSource corsConfigurationSource() {
        var cfg = new CorsConfiguration();
        cfg.setAllowedOrigins(Arrays.stream(allowedOriginsCsv.split(",")).map(String::trim).toList());
        cfg.setAllowedMethods(List.of("GET","POST","PUT","PATCH","DELETE","OPTIONS"));
        cfg.setAllowedHeaders(List.of("Content-Type","Authorization","X-Requested-With"));
        cfg.setAllowCredentials(true); // send cookies across origins
        var src = new UrlBasedCorsConfigurationSource();
        src.registerCorsConfiguration("/**", cfg);
        return src;
    }

    private static Set<String> csvToSet(String csv) {
        if (csv == null || csv.isBlank()) return Set.of();
        String[] parts = csv.split(",");
        Set<String> out = new HashSet<>();
        for (String p : parts) {
            String e = p.trim().toLowerCase(Locale.ROOT);
            if (!e.isBlank()) out.add(e);
        }
        return out;
    }
}
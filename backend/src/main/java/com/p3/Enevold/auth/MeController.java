package com.p3.Enevold.auth;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
public class MeController {

    @GetMapping("/me")
    public Map<String, Object> me(@org.springframework.security.core.annotation.AuthenticationPrincipal OidcUser user) {
        if (user == null) return Map.of("authenticated", false);
        return Map.of(
                "authenticated", true,
                "email", user.getEmail(),
                "name", user.getFullName(),
                "roles", user.getAuthorities().stream().map(GrantedAuthority::getAuthority).toList()
        );
    }
}
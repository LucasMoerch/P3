package com.p3.Enevold.users;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.Instant;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/users") // final path = /api/users
public class UserController {
    private final UserRepository repo;
    public UserController(UserRepository repo) { this.repo = repo; }

    @PostMapping("/invite")
    public ResponseEntity<?> invite(@RequestParam String email,
                                    @RequestParam String firstName,
                                    @RequestParam String lastName) {
        try {
            var lower = email.toLowerCase();

            var u = new User();

            var auth = new User.Auth();
            auth.setProvider("google");
            auth.setEmail(lower);
            auth.setEmailVerified(false);
            auth.setPictureUrl(null);

            var profile = new User.Profile();
            profile.setFirstName(firstName);
            profile.setLastName(lastName);
            profile.setDisplayName(firstName + " " + lastName);
            profile.setLocale("da-DK");
            profile.setPhone(null);

            var audit = new User.Audit();
            var now = java.time.Instant.now();
            audit.setCreatedAt(now);
            audit.setUpdatedAt(now);
            audit.setCreatedBy(null);
            audit.setUpdatedBy(null);

            u.setRoles(java.util.List.of("staff"));
            u.setStatus("invited");
            u.setAuth(auth);
            u.setProfile(profile);
            u.setStaff(null);
            u.setAudit(audit);

            return ResponseEntity.ok(repo.save(u));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(java.util.Map.of("error", e.getClass().getSimpleName(), "message", String.valueOf(e.getMessage())));
        }
    }


    @GetMapping
    public ResponseEntity<?> all() { return ResponseEntity.ok(repo.findAll()); }
}
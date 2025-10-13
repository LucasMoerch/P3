package com.p3.Enevold.users;

import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/users") // final path = /api/users
public class UserController {
    private final UserRepository repo;
    private final JwtDecoder googleJwtDecoder;

    public UserController(UserRepository repo, JwtDecoder googleJwtDecoder) { this.repo = repo;
        this.googleJwtDecoder = googleJwtDecoder;
    }

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
    @PostMapping("/activate")
    public ResponseEntity<?> activate(@RequestParam("id_token") String idToken) {
       try {
           // Verify token with Google
           Jwt jwt = googleJwtDecoder.decode(idToken);

           // Extract claims
           String sub = jwt.getClaimAsString("sub");
           String email = jwt.getClaimAsString("email");
           Boolean emailVerified = jwt.getClaimAsBoolean("email_verified");
           String name = jwt.getClaimAsString("name");
           String picture = jwt.getClaimAsString("picture");

           if (email == null || sub == null) {
               return ResponseEntity.badRequest().body(java.util.Map.of("error","InvalidToken","message","Missing email/sub"));
           }
           var lowerEmail = email.toLowerCase();

           var user = repo.findByAuthEmail(lowerEmail).orElseThrow(() -> new IllegalStateException("Invite not found for email: " + lowerEmail));

           // If already active with a different sub, block it
           if (user.getAuth() != null && user.getAuth().getSub() != null && !user.getAuth().getSub().isBlank()) {
               if (!user.getAuth().getSub().equals(sub)) {
                   return ResponseEntity.status(409).body(
                           java.util.Map.of("error", "AlreadyLinked",
                                   "message", "User already activated with a different Google account.")
                   );
               }
           }
           // Update auth Fields
           var auth = user.getAuth();
           if (auth == null){
               auth = new User.Auth();
           }
           auth.setProvider("google");
           auth.setSub(sub);
           auth.setEmail(lowerEmail);
           auth.setEmailVerified(emailVerified);
           if (picture != null) { auth.setPictureUrl(picture); }
           user.setAuth(auth);

           // Flip status to active
           user.setStatus("active");
           if (user.getAudit() == null) user.setAudit(new User.Audit());
           user.getAudit().setUpdatedAt(java.time.Instant.now());

           var saved = repo.save(user);
           return ResponseEntity.ok(saved);
       } catch(Exception e) {
           return ResponseEntity.badRequest().body(java.util.Map.of("error", e.getClass().getSimpleName(), "message", e.getMessage()));
       }

    }

    @GetMapping
    public ResponseEntity<?> all() { return ResponseEntity.ok(repo.findAll()); }
}
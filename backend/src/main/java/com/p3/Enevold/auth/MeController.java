package com.p3.Enevold.auth;

import com.p3.Enevold.users.UserRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/me") // final url = /api/me
public class MeController {

  private final UserRepository repo;

  public MeController(UserRepository repo) {
    this.repo = repo;
  }

  @GetMapping
  public ResponseEntity<?> me(HttpSession session) {
    var uid = (String) session.getAttribute("uid");
    if (uid == null)
      return ResponseEntity.ok(Map.of("authenticated", false));

    var user = repo.findById(uid).orElse(null);
    if (user == null)
      return ResponseEntity.ok(Map.of("authenticated", false));

    // Return only safe fields
    var auth = user.getAuth();
    var profile = user.getProfile();

    return ResponseEntity.ok(Map.of(
        "authenticated", true,
        "id", user.getId(),
        "email", auth != null ? auth.getEmail() : null,
        "displayName", profile != null ? profile.getDisplayName() : null,
        "roles", user.getRoles(),
        "status", user.getStatus(),
        "pictureUrl", auth != null ? auth.getPictureUrl() : null));
  }

  @PostMapping("/logout")
  public ResponseEntity<?> logout(HttpSession session) {
    session.invalidate();
    return ResponseEntity.ok(Map.of("ok", true));
  }
}

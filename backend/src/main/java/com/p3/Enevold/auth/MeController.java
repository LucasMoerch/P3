package com.p3.Enevold.auth;

import com.p3.Enevold.users.UserRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

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

      System.out.println("ME CONTROLLER: session uid=" + uid);
      System.out.println("ME CONTROLLER: user=" + user);

      // Return only safe fields
      var auth = user.getAuth();
      var profile = user.getProfile();

      Map<String, Object> response = new HashMap<>();
      response.put("authenticated", true);
      response.put("id", user.getId());
      response.put("email", auth != null ? auth.getEmail() : "");
      response.put("displayName", profile != null ? profile.getDisplayName() : "");
      response.put("roles", user.getRoles() != null ? user.getRoles() : List.of());
      response.put("status", user.getStatus() != null ? user.getStatus() : "unknown");
      response.put("pictureUrl", auth != null ? auth.getPictureUrl() : "");

      return ResponseEntity.ok(response);
  }

  @PostMapping("/logout")
  public ResponseEntity<?> logout(HttpSession session) {
    session.invalidate();
    return ResponseEntity.ok(Map.of("ok", true));
  }
}

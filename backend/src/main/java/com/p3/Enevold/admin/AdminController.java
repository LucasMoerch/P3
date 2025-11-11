package com.p3.Enevold.admin;

import com.p3.Enevold.users.UserService;
import com.p3.Enevold.users.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final UserService userService;

    public AdminController(UserService userService) {
        this.userService = userService;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/invite")
    public ResponseEntity<?> inviteNewUser(@RequestBody InvitationRequest request) {
      System.out.println("Inviting new user" + request);
      // Basic validation
        if (request == null || request.getEmail() == null || request.getEmail().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "InvalidRequest", "message", "Email is required"));
        }
        try {
            User invitedUser = userService.inviteOrUpdateUser(
                    request.getEmail().toLowerCase(),
                    request.getRoles()
            );
            return ResponseEntity.ok(invitedUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "InternalError", "message", e.getMessage()));
        }
    }
}

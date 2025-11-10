package com.p3.Enevold.admin;

import com.p3.Enevold.users.UserService;
import com.p3.Enevold.users.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

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
        try {
            User invitedUser = userService.inviteOrUpdateUser(
                    request.getEmail().toLowerCase(),
                    request.getRoles()
            );
            return ResponseEntity.ok(invitedUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("An unexpected error occurred.");
        }
    }
}

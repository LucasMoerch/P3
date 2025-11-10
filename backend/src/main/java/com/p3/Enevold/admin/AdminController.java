package com.p3.Enevold.admin;

import com.p3.Enevold.users.UserService;
import com.p3.Enevold.users.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserService userService;

    public AdminController(UserService userService) {
        this.userService = userService;
    }


    //Invite a new user by email and role.
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/invite")
    public ResponseEntity<User> inviteNewUser(@RequestBody InvitationRequest request) {

        List<String> roles = request.getRoles()
                .stream()
                .map(String::toLowerCase)
                .toList();

        List<String> allowed = List.of("staff", "admin");
        boolean invalid = roles.stream().anyMatch(r -> !allowed.contains(r));

        if (invalid) {
            return ResponseEntity.badRequest().body(null);
        }

        try {
            User invitedUser = userService.inviteOrUpdateUser(
                    request.getEmail().toLowerCase(),
                    roles
            );

            return ResponseEntity.ok(invitedUser);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
}

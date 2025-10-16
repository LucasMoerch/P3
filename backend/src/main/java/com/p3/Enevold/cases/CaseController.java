package com.p3.Enevold.cases;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.bson.types.ObjectId;

import java.time.Instant;
import java.util.*;

@RestController
@RequestMapping("/cases")
public class CaseController {

    @Autowired
    private CaseRepository repo;

    @PostMapping("/create")
    public ResponseEntity<?> createCase(@RequestParam String title,
                                        @RequestParam String description,
                                        @RequestParam String status) {
        try {
            // Validate allowed status values
            List<String> allowedStatuses = List.of("OPEN", "ON_HOLD", "CLOSED");
            String normalizedStatus = status.toUpperCase();

            if (!allowedStatuses.contains(normalizedStatus)) {
                return ResponseEntity.badRequest().body(Map.of(
                        "error", "InvalidStatus",
                        "message", "Status must be one of: OPEN, ON_HOLD, CLOSED"
                ));
            }

            Case c = new Case();

            // _id (id) is a string according to your schema
            c.setId("CASE-" + (int) (Math.random() * 10000));

            // Dummy clientId for now
            c.setClientId(new ObjectId("000"));

            c.setTitle(title);
            c.setDescription(description);
            c.setStatus(normalizedStatus);
            c.setAssignedUserIds(new ArrayList<>());

            Date now = Date.from(Instant.now());
            c.setCreatedAt(now);
            c.setUpdatedAt(now);

            Case saved = repo.save(c);
            return ResponseEntity.ok(saved);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of(
                    "error", e.getClass().getSimpleName(),
                    "message", e.getMessage()
            ));
        }
    }

    @GetMapping
    public ResponseEntity<List<Case>> getAllCases() {
        return ResponseEntity.ok(repo.findAll());
    }
}

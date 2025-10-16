package com.p3.Enevold.cases;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.bson.types.ObjectId;

import java.util.*;

@RestController
@RequestMapping("/admin/cases")
public class CaseControllerAdmin {

    @Autowired
    private CaseRepository repo;

    @Autowired
    private ClientRepository clientRepo; // <-- Add this (see below)

    @PostMapping("/assignEmployee")
    public ResponseEntity<?> assignEmployee(@RequestParam String caseId,
                                            @RequestParam String userId) {
        try {
            Optional<Case> opt = repo.findById(caseId);
            if (opt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Case not found"));
            }

            Case c = opt.get();
            ObjectId newUser = new ObjectId(userId);
            List<ObjectId> assigned = c.getAssignedUserIds();
            if (assigned == null) assigned = new ArrayList<>();

            if (!assigned.contains(newUser)) {
                assigned.add(newUser);
            }

            c.setAssignedUserIds(assigned);
            c.setUpdatedAt(new Date());
            repo.save(c);

            return ResponseEntity.ok(Map.of(
                    "message", "Employee assigned successfully",
                    "caseId", caseId,
                    "assignedUserIds", assigned
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/removeEmployee")
    public ResponseEntity<?> removeEmployee(@RequestParam String caseId,
                                            @RequestParam String userId) {
        try {
            Optional<Case> opt = repo.findById(caseId);
            if (opt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Case not found"));
            }

            Case c = opt.get();
            List<ObjectId> assigned = c.getAssignedUserIds();

            if (assigned != null) {
                assigned.removeIf(id -> id.toHexString().equals(userId));
            }

            c.setAssignedUserIds(assigned);
            c.setUpdatedAt(new Date());
            repo.save(c);

            return ResponseEntity.ok(Map.of(
                    "message", "Employee removed successfully",
                    "caseId", caseId,
                    "assignedUserIds", assigned
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteCase(@RequestParam String caseId) {
        try {
            Optional<Case> opt = repo.findById(caseId);
            if (opt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Case not found"));
            }

            repo.deleteById(caseId);
            return ResponseEntity.ok(Map.of(
                    "message", "Case deleted successfully",
                    "caseId", caseId
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/assignClient")
    public ResponseEntity<?> assignClient(@RequestParam String caseId,
                                          @RequestParam String clientId) {
        try {
            Optional<Case> optCase = repo.findById(caseId);
            if (optCase.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Case not found"));
            }

            // Validate client existence
            Optional<Client> optClient = clientRepo.findById(new ObjectId(clientId));
            if (optClient.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Client not found"));
            }

            Case c = optCase.get();
            c.setClientId(new ObjectId(clientId));
            c.setUpdatedAt(new Date());
            repo.save(c);

            return ResponseEntity.ok(Map.of(
                    "message", "Client assigned successfully",
                    "caseId", caseId,
                    "clientId", clientId
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}

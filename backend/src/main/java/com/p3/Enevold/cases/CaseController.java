package com.p3.Enevold.cases;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/cases")
public class CaseController {

    @Autowired
    private CaseService caseService;

    @GetMapping
    public ResponseEntity<List<Case>> getAllCases() {
        return ResponseEntity.ok(caseService.getAllCases());
    }

    @PostMapping
    public ResponseEntity<Case> createCase(@RequestBody Case newCase) {
        newCase.setCreatedAt(new Date());
        newCase.setUpdatedAt(new Date());
        return ResponseEntity.ok(caseService.createCase(newCase));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Case> updateCase(@PathVariable String id, @RequestBody Case update) {
        return caseService.updateCase(id, update)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}

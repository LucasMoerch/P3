package com.p3.Enevold.time;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/times")
public class TimeController {
    private final TimeRepository repo;

    public TimeController(TimeRepository repo) {
        this.repo = repo;
    }

    @GetMapping("/getTimes")
    public List<Time> getTimes() {
        return repo.findAll();
    }

    @PostMapping("/start")
    public ResponseEntity<?> start(@RequestParam String startTime,
                                   @RequestParam String userId,
                                   @RequestParam String currentUserName,
                                   @RequestParam(required = false) String caseId) { // add caseId if you need it
        try {
            var time = new Time();
            time.setStartTime(startTime);
            time.setUserId(userId);
            time.setUserName(currentUserName);
            if (caseId != null) {
                time.setCaseId(caseId);
            }
            return ResponseEntity.ok(repo.save(time));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    Map.of(
                            "error", e.getClass().getSimpleName(),
                            "message", String.valueOf(e.getMessage())
                    )
            );
        }
    }

    @PatchMapping("/update")
    public ResponseEntity<?> updateByStartTime(@RequestParam String startTime,
                                               @RequestParam String stopTime,
                                               @RequestParam String totalTime,
                                               @RequestParam String description,
                                               @RequestParam String date,
                                               @RequestParam String caseId,
                                               @RequestParam String originalStartTime) {

        var optionalTime = repo.findByStartTime(originalStartTime);
        if (optionalTime.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        var time = optionalTime.get();
        time.setStartTime(startTime);
        time.setStopTime(stopTime);
        time.setTotalTime(totalTime);
        time.setDescription(description);
        time.setDate(date);
        if (caseId != null){
            time.setCaseId("Other");
        }

        var saved = repo.save(time);
        return ResponseEntity.ok(saved);
    }

    // Keep the DTO and the endpoint INSIDE the class
    record TimeEntryDto(String startTime, String stopTime) {}

    @GetMapping("/users/{userId}/last-time")
    public ResponseEntity<TimeEntryDto> getLastTime(@PathVariable String userId) {
        return repo.findFirstByUserIdOrderByStartTimeDesc(userId)
                // ⚠️ only keep this fallback if the entity ID == userId
                .or(() -> repo.findById(userId))
                .map(time -> ResponseEntity.ok(new TimeEntryDto(time.getStartTime(), time.getStopTime())))
                .orElseGet(() -> ResponseEntity.noContent().build());
    }
}
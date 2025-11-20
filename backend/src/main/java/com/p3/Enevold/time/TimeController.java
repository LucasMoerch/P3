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
                                   @RequestParam String currentUserName){

        try {
            var time = new Time();
            time.setStartTime(startTime);
            time.setUserId(userId);
            time.setUserName(currentUserName);

            return ResponseEntity.ok(repo.save(time));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "error", e.getClass().getSimpleName(),
                            "message", String.valueOf(e.getMessage())
                    ));
        }
    }
    @PatchMapping("/update")
    public ResponseEntity<?> updateByStartTime(@RequestParam String startTime,
                                               @RequestParam String stopTime,
                                               @RequestParam String totalTime,
                                               @RequestParam String description,
                                               @RequestParam String date,
                                               @RequestParam String caseId,
                                               @RequestParam String originalStartTime
                                               ) {

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
        time.setCaseId(caseId);


        var saved = repo.save(time);
        return ResponseEntity.ok(saved);
    }
    record TimeEntryDto(String startTime, String stopTime) {}

    @GetMapping("/users/{userId}/last-time")
    public ResponseEntity<TimeEntryDto> getLastTime(@PathVariable String userId) {
        return repo.findFirstByUserIdOrderByStartTimeDesc(userId)
                .or(() -> repo.findById(userId))
                .map(time -> ResponseEntity.ok(new TimeEntryDto(time.getStartTime(), time.getStopTime())))
                .orElseGet(() -> ResponseEntity.noContent().build());
    }

    // all time regs for a given case
    @GetMapping("/cases/{caseId}")
    public ResponseEntity<List<Time>> getTimesByCase(@PathVariable String caseId) {
        List<Time> times = repo.findByCaseId(caseId);
        if (times.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(times);
    }

    // all time regs for a given user
    @GetMapping("/users/{userId}")
    public ResponseEntity<List<Time>> getTimesByUser(@PathVariable String userId) {
        List<Time> times = repo.findByUserId(userId);
        if (times.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(times);
    }
}

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
            time.setCaseId(userId);
            time.setUserName(currentUserName);

            return ResponseEntity.ok(repo.save(time));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(java.util.Map.of(
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

}
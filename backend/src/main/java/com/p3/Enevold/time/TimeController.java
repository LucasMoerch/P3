package com.p3.Enevold.time;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @PostMapping("/complete")
    public ResponseEntity<?> complete(@RequestParam String startTime,
                                      @RequestParam String stopTime,
                                      @RequestParam String totalTime,
                                      @RequestParam String description){

        try {
            var time = new Time();
            time.setStartTime(startTime);
            time.setStopTime(stopTime);
            time.setTotalTime(totalTime);
            time.setDescription(description);

            return ResponseEntity.ok(repo.save(time));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(java.util.Map.of(
                            "error", e.getClass().getSimpleName(),
                            "message", String.valueOf(e.getMessage())
                    ));
        }
    }
}
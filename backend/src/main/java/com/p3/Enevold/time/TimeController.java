package com.p3.Enevold.users;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/times")
public class TimeController {

    private final TimeRepository repo;

    public TimeController(TimeRepository repo) {
        this.repo = repo;
    }

    // DTO for request body
    public static record CompleteTimeRequest(java.util.Date startTime, java.util.Date stopTime) {}


    @PostMapping("/complete")
    public ResponseEntity<Time> complete(@RequestParam String Id,
                                    @RequestParam Date startTime,
                                    @RequestParam Date stopTime,
                                    @RequestParam String totalTime) {
        Time time = new Time();
        time.setStartTime(startTime);
        time.setStopTime(stopTime);
        time.setTotalTime(totalTime);

        return ResponseEntity.ok(repo.save(time));
    }

    @GetMapping
    public ResponseEntity<List<Time>> all() {
        return ResponseEntity.ok(repo.findAll());
    }
}
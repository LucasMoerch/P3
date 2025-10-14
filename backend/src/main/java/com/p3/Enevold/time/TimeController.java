package com.p3.Enevold.time;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;


@RestController
@RequestMapping("/times")
public class TimeController {
    private final TimeRepository repo;
    public TimeController(TimeRepository repo) {this.repo = repo;}

    record TimeCompleteDTO(Date startTime, Date stopTime, String totalTime) {}

    @PostMapping("/complete")
    public ResponseEntity<Time> complete(@RequestBody TimeCompleteDTO body) {
        Time time = new Time();
        time.setStartTime(body.startTime());
        time.setStopTime(body.stopTime());
        time.setTotalTime(body.totalTime());
        return ResponseEntity.ok(repo.save(time));
    }


    @GetMapping("/getTimes")
    public List<Time> getTimes() {
        return repo.findAll();
    }
}
package com.p3.Enevold.time;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;


@Document("times")
public class Time {

    @Id private String id;
    private Date startTime; // time of start
    private Date stopTime;  // stop time
    private String totalTime; // total time worked
    private String description; // description of work done

    // Getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public Date getStartTime() { return startTime; }
    public void setStartTime(Date startTime) { this.startTime = startTime; }

    public Date getStopTime() { return stopTime; }
    public void setStopTime(Date stopTime) { this.stopTime = stopTime; }

    public String getTotalTime() { return totalTime; }
    public void setTotalTime(String totalTime) { this.totalTime = totalTime; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}

/**
 * Paste one or more documents here
 */

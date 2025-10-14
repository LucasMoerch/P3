package com.p3.Enevold.cases;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.bson.types.ObjectId;
import java.util.Date;
import java.util.List;

@Document(collection = "cases")
public class Case {

    @Id
    private ObjectId _id;

    private String ID;
    private ObjectId clientId;
    private String title;
    private String description;
    private String status; // OPEN | ON_HOLD | CLOSED
    private List<ObjectId> assignedUserIds;
    private Date createdAt;
    private Date updatedAt;

    public Case() {
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    // Getters and Setters
    public ObjectId get_id() { return _id; }
    public void set_id(ObjectId _id) { this._id = _id; }

    public String getID() { return ID; }
    public void setID(String ID) { this.ID = ID; }

    public ObjectId getClientId() { return clientId; }
    public void setClientId(ObjectId clientId) { this.clientId = clientId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public List<ObjectId> getAssignedUserIds() { return assignedUserIds; }
    public void setAssignedUserIds(List<ObjectId> assignedUserIds) { this.assignedUserIds = assignedUserIds; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }

    public Date getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Date updatedAt) { this.updatedAt = updatedAt; }
}

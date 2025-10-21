package com.p3.Enevold.cases;

import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.bson.types.ObjectId;

import java.util.Date;
import java.util.List;

@Document(collection = "cases")
public class Case {

    @Id
    @Field("_id")
    private String id;

    @Field("clientId")
    private ObjectId clientId;

    @Field("title")
    private String title;

    @Field("description")
    private String description;

    @Field("status")
    private String status;

    @Field("assignedUserIds")
    private List<ObjectId> assignedUserIds;

    @CreatedDate
    private Date createdAt;

    @Field("updatedAt")
    private Date updatedAt;

    @CreatedBy
    private String createdBy;

    // getters and setters
    public String getId() { return id; }

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
    public Date getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Date updatedAt) { this.updatedAt = updatedAt; }

    public String getCreatedBy() { return createdBy; }
}

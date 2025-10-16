package com.p3.Enevold.clients;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document ("clients")
public class Client {
    @Id
     private String id;
     private String name;
     private String contactEmail;
     private String contactPhone;
     private String notes;
     private String createdAt;

    // Getters
    public String getId() { return id; }
    public String getName() { return name; }
    public String getContactEmail() { return contactEmail; }
    public String getContactPhone() { return contactPhone; }
    public String getNotes() { return notes; }
    public String getCreatedAt() { return createdAt; }

    public void setId(String id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setContactEmail(String contactEmail) { this.contactEmail = contactEmail; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }
    public void setNotes(String notes) { this.notes = notes; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }


}

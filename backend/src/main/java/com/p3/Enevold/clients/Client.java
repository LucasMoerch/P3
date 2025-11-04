package com.p3.Enevold.clients;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;
import java.util.Date;
import java.util.ArrayList;
import org.springframework.data.annotation.CreatedDate;


class ClientDocument {
  private String fileName;
  private String contentType;
  private byte[] data;
  private Date uploadedAt;
  private String createdBy;

  // Getters
  public String getFileName() { return fileName; }
  public String getContentType() { return contentType; }
  public byte[] getData() { return data; }
  public Date getUploadedAt() { return uploadedAt; }
  public String getCreatedBy() { return createdBy; }
  // Setters
  public void setFileName(String fileName) { this.fileName = fileName; }
  public void setContentType(String contentType) { this.contentType = contentType; }
  public void setData(byte[] data) { this.data = data; }
  public void setUploadedAt(Date uploadedAt) { this.uploadedAt = uploadedAt; }
  public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
}

@Document ("clients")
public class Client {
    @Id
     private String id;
     private String name;
     private String contactEmail;
     private String contactPhone;
     private String notes;
     @CreatedDate private Date createdAt;
     private List<ClientDocument> documents;

    // Getters
    public String getId() { return id; }
    public String getName() { return name; }
    public String getContactEmail() { return contactEmail; }
    public String getContactPhone() { return contactPhone; }
    public String getNotes() { return notes; }
    public Date getCreatedAt() { return createdAt; }
    public List<ClientDocument> getDocuments() { return documents; }

    // Setters
    public void setId(String id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setContactEmail(String contactEmail) { this.contactEmail = contactEmail; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }
    public void setNotes(String notes) { this.notes = notes; }
    public void setDocuments(List<ClientDocument> documents) { this.documents = documents; }

}

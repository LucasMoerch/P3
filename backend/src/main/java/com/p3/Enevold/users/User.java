package com.p3.Enevold.users;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;
import java.util.Date;
import java.util.ArrayList;
import com.p3.Enevold.utils.FileDocument;

@Document("users")
public class User {
    @Id private String id;

    private List<String> roles; // Either "staff" or "admin"
    private String status; // "invited" | "active" | "disabled"
    private Auth auth;
    private Profile profile;
    private Staff staff;
    private Audit audit;

    public static class Auth {
        private String provider = "google";
        @Indexed(unique = true, sparse = true) private String sub; // null until activate
        @Indexed(unique = true) private String email; // must be unique
        private boolean emailVerified;
        private String pictureUrl;
        // getters/setters
        public String getProvider() { return provider; }
        public void setProvider(String provider) { this.provider = provider; }
        public String getSub() { return sub; }
        public void setSub(String sub) { this.sub = sub; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public boolean isEmailVerified() { return emailVerified; }
        public void setEmailVerified(boolean emailVerified) { this.emailVerified = emailVerified; }
        public String getPictureUrl() { return pictureUrl; }
        public void setPictureUrl(String pictureUrl) { this.pictureUrl = pictureUrl; }
    }
    public static class Profile {
        private String firstName;
        private String lastName;
        private String displayName;
        private String phone;
        private String locale;
        // getters/setters
        public String getFirstName() { return firstName; }
        public void setFirstName(String firstName) { this.firstName = firstName; }
        public String getLastName() { return lastName; }
        public void setLastName(String lastName) { this.lastName = lastName; }
        public String getDisplayName() { return displayName; }
        public void setDisplayName(String displayName) { this.displayName = displayName; }
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
        public String getLocale() { return locale; }
        public void setLocale(String locale) { this.locale = locale; }
    }
    public static class Staff {
        private String employeeNo;
        private Double hourlyRate;
        // getters/setters
        public String getEmployeeNo() { return employeeNo; }
        public void setEmployeeNo(String employeeNo) { this.employeeNo = employeeNo; }
        public Double getHourlyRate() { return hourlyRate; }
        public void setHourlyRate(Double hourlyRate) { this.hourlyRate = hourlyRate; }
    }
    public static class Audit {
        private Instant createdAt;
        private Instant updatedAt;
        private String createdBy;
        private String updatedBy;
        // getters/setters
        public Instant getCreatedAt() { return createdAt; }
        public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
        public Instant getUpdatedAt() { return updatedAt; }
        public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
        public String getCreatedBy() { return createdBy; }
        public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
        public String getUpdatedBy() { return updatedBy; }
        public void setUpdatedBy(String updatedBy) { this.updatedBy = updatedBy; }
    }

    private List<FileDocument> documents = new ArrayList<>();

    // root getters/setters
    public String getId() { return id; }
    public List<String> getRoles() { return roles; }
    public void setRoles(List<String> roles) { this.roles = roles; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Auth getAuth() { return auth; }
    public void setAuth(Auth auth) { this.auth = auth; }
    public Profile getProfile() { return profile; }
    public void setProfile(Profile profile) { this.profile = profile; }
    public Staff getStaff() { return staff; }
    public void setStaff(Staff staff) { this.staff = staff; }
    public Audit getAudit() { return audit; }
    public void setAudit(Audit audit) { this.audit = audit; }
    public List<FileDocument> getDocuments() { return documents; }
    public void setDocuments(List<FileDocument> documents) { this.documents = documents; }
}

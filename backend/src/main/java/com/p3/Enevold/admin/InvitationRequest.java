package com.p3.Enevold.admin;

// This DTO defines the expected JSON body for the invitation request
public class InvitationRequest {
    private String email;
    private String role; // The requested role, e.g., "staff" or "admin"

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
package com.p3.Enevold.admin;

import java.util.List;

// This DTO defines the expected JSON body for the invitation request
public class InvitationRequest {
    private String email;
    private List<String> roles;

    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }

    public List<String> getRoles() {
        return roles;
    }
    public void setRoles(List<String> roles) {
        this.roles = roles;
    }
}

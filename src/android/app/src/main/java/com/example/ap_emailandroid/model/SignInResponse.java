package com.example.ap_emailandroid.model;

/**
 * Response model for sign-in API call
 */
public class SignInResponse {
    private String token;

    public SignInResponse() {}

    public SignInResponse(String token) {
        this.token = token;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}

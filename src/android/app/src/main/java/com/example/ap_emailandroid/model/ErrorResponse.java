package com.example.ap_emailandroid.model;

/**
 * Response model for error responses from the API
 */
public class ErrorResponse {
    private String error;

    public ErrorResponse() {}

    public ErrorResponse(String error) {
        this.error = error;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }
}

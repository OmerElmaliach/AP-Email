package com.example.ap_emailandroid.network;

import com.example.ap_emailandroid.local.User;
import com.example.ap_emailandroid.model.SignInRequest;
import com.example.ap_emailandroid.model.SignInResponse;
import com.example.ap_emailandroid.model.SignUpResponse;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.POST;

/**
 * User API interface for handling user-related operations
 * Corresponds to the user endpoints in the JS server
 */
public interface UserAPI {
    
    /**
     * Create a new user (sign up)
     * Corresponds to POST /api/users endpoint
     * Note: For now using JSON body instead of multipart form data
     * Picture handling will be added in future version
     */
    @POST("/api/signup/")
    Call<SignUpResponse> createUser(@Body User user);

    /**
     * Get current user information
     * Corresponds to GET /api/users/me endpoint
     */
    @GET("/api/users/me")
    Call<User> getCurrentUser(@Header("Authorization") String token);

    /**
     * Sign in user
     * Corresponds to POST /api/signin endpoint  
     */
    @POST("/api/signin")
    Call<SignInResponse> signIn(@Body SignInRequest signInRequest);

    /**
     * Check if email exists (for validation during signup)
     * This would be implemented as a custom endpoint on the server
     */
    //TODO what is this?
    @GET("/api/users/check-email")
    Call<Void> checkEmailExists(@Header("email") String email);

    /**
     * Check if username exists (for validation during signup)
     * This would be implemented as a custom endpoint on the server
     */
    @GET("/api/users/check-username")
    Call<Void> checkUsernameExists(@Header("username") String username);
}

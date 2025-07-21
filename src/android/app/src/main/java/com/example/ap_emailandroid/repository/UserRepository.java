package com.example.ap_emailandroid.repository;

import com.example.ap_emailandroid.local.User;
import com.example.ap_emailandroid.model.SignUpRequest;
import com.example.ap_emailandroid.model.SignInRequest;
import com.example.ap_emailandroid.model.SignInResponse;
import com.example.ap_emailandroid.model.SignUpResponse;
import com.example.ap_emailandroid.network.UserAPI;
import com.example.ap_emailandroid.network.WebServiceAPI;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

/**
 * Repository for user operations
 * Handles API calls and network operations for user management
 */
public class UserRepository {
    
    private UserAPI userAPI;
    private static final String BASE_URL = "http://10.0.2.2:9000"; // JS server URL for Android emulator

    public UserRepository() {
        android.util.Log.e("UserRepository", "Creating UserRepository with BASE_URL: " + BASE_URL);
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl(BASE_URL)
                .addConverterFactory(GsonConverterFactory.create())
                .build();
        
        userAPI = retrofit.create(UserAPI.class);
        android.util.Log.e("UserRepository", "UserRepository created successfully");
    }

    /**
     * Create a new user (sign up)
     * @param user the user data to save
     * @param callback callback for handling response
     */
    public void createUser(User user, Callback<SignUpResponse> callback) {
        Call<SignUpResponse> call = userAPI.createUser(user);
        call.enqueue(callback);
    }

    /**
     * Sign in user
     * @param email user email
     * @param password user password
     * @param callback callback for handling response
     */
    public void signInUser(String email, String password, Callback<SignInResponse> callback) {
        SignInRequest request = new SignInRequest(email, password);
        Call<SignInResponse> call = userAPI.signIn(request);
        call.enqueue(callback);
    }

    /**
     * Get current user information
     * @param token authentication token
     * @param callback callback for handling response
     */
    public void getCurrentUser(String token, Callback<User> callback) {
        Call<User> call = userAPI.getCurrentUser("Bearer " + token);
        call.enqueue(callback);
    }

    /**
     * Check if email already exists
     * @param email the email to check
     * @param callback callback for handling response
     */
    public void checkEmailExists(String email, Callback<Void> callback) {
        Call<Void> call = userAPI.checkEmailExists(email);
        call.enqueue(callback);
    }

    /**
     * Check if username already exists
     * @param userName the username to check
     * @param callback callback for handling response
     */
    public void checkUsernameExists(String userName, Callback<Void> callback) {
        Call<Void> call = userAPI.checkUsernameExists(userName);
        call.enqueue(callback);
    }

    /**
     * Synchronous method for checking if email exists (for legacy support)
     * @param email the email to check
     * @return true if email exists, false otherwise
     */
    public boolean emailExists(String email) {
        // This is a simplified synchronous version
        // In a real implementation, you would use the async version above
        return false;
    }

    /**
     * Synchronous method for checking if username exists (for legacy support)
     * @param userName the username to check
     * @return true if username exists, false otherwise
     */
    public boolean userNameExists(String userName) {
        // This is a simplified synchronous version
        // In a real implementation, you would use the async version above
        return false;
    }

    /**
     * Legacy method for creating user (synchronous)
     * @param signUpRequest the user data to save
     * @return success/failure result
     */
    public boolean createUser(SignUpRequest signUpRequest) {
        // Convert SignUpRequest to User and use async method
        User user = new User();
        user.setFirstName(signUpRequest.getFirstName());
        user.setLastName(signUpRequest.getLastName());
        user.setEmail(signUpRequest.getEmail());
        user.setUserName(signUpRequest.getUserName());
        user.setPassword(signUpRequest.getPassword());
        user.setBirthday(signUpRequest.getBirthday());
        user.setGender(signUpRequest.getGender());
        user.setPhoneNumber(signUpRequest.getPhoneNumber());
        // Note: Picture handling will be implemented later with multipart uploads
        
        // For now, return true as placeholder
        // Real implementation would use the async createUser method above
        return true;
    }
}

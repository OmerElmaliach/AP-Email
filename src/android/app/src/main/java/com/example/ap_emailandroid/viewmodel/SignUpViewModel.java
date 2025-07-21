package com.example.ap_emailandroid.viewmodel;

import android.net.Uri;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;
import com.example.ap_emailandroid.local.User;
import com.example.ap_emailandroid.model.SignUpRequest;
import com.example.ap_emailandroid.model.SignUpResponse;
import com.example.ap_emailandroid.repository.UserRepository;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

/**
 * viewmodel for managing signup process data and state
 * follows mvvm pattern and coordinates with repository for data operations
 */
public class SignUpViewModel extends ViewModel {
    
    private UserRepository userRepository;
    
    // signup form data
    private String firstName;
    private String lastName;
    private Uri profilePictureUri;
    private String birthday;
    private String gender;
    private String email;
    private String password;
    private String phoneNumber;
    
    // observables for ui state
    private MutableLiveData<Boolean> isLoading = new MutableLiveData<>(false);
    private MutableLiveData<Boolean> signUpSuccess = new MutableLiveData<>(false);
    private MutableLiveData<String> errorMessage = new MutableLiveData<>("");
    private MutableLiveData<String> authToken = new MutableLiveData<>("");
    
    public SignUpViewModel() {
        userRepository = new UserRepository();
    }
    
    // getters and setters for form data
    public String getFirstName() {
        return firstName;
    }
    
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }
    
    public String getLastName() {
        return lastName;
    }
    
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
    
    public Uri getProfilePictureUri() {
        return profilePictureUri;
    }
    
    public void setProfilePictureUri(Uri profilePictureUri) {
        this.profilePictureUri = profilePictureUri;
    }
    
    public String getBirthday() {
        return birthday;
    }
    
    public void setBirthday(String birthday) {
        this.birthday = birthday;
    }
    
    public String getGender() {
        return gender;
    }
    
    public void setGender(String gender) {
        this.gender = gender;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
    
    // observables for ui
    public LiveData<Boolean> getIsLoading() {
        return isLoading;
    }
    
    public LiveData<Boolean> getSignUpSuccess() {
        return signUpSuccess;
    }
    
    public LiveData<String> getErrorMessage() {
        return errorMessage;
    }

    public LiveData<String> getAuthToken() {
        return authToken;
    }
    
    /**
     * submits the signup request to the backend
     * this method coordinates with the repository to save user data via API
     */
    public void submitSignUp() {
        isLoading.setValue(true);
        errorMessage.setValue("");
        
        // create user object
        User user = new User();
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEmail(email);
        user.setUserName(email); // username = email as per web implementation
        user.setPassword(password);
        user.setBirthday(birthday);
        user.setGender(gender);
        user.setPhoneNumber(phoneNumber);
        // Note: Picture handling will be implemented later with multipart uploads
        
        // make API call to create user
        userRepository.createUser(user, new Callback<SignUpResponse>() {
            @Override
            public void onResponse(Call<SignUpResponse> call, Response<SignUpResponse> response) {
                isLoading.postValue(false);
                
                if (response.isSuccessful() && response.body() != null) {
                    SignUpResponse signUpResponse = response.body();
                    authToken.postValue(signUpResponse.getToken());
                    signUpSuccess.postValue(true);
                } else {
                    // Handle error response
                    String error = "Sign up failed. Please try again.";
                    if (response.code() == 409) {
                        error = "Email or username already exists.";
                    } else if (response.code() == 400) {
                        error = "Invalid input. Please check your information.";
                    }
                    errorMessage.postValue(error);
                }
            }
            
            @Override
            public void onFailure(Call<SignUpResponse> call, Throwable t) {
                isLoading.postValue(false);
                errorMessage.postValue("Network error. Please check your connection and try again.");
            }
        });
    }

    /**
     * Check if email is already in use
     * @param email the email to check
     * @param callback callback to handle result
     */
    public void checkEmailAvailability(String email, Callback<Void> callback) {
        userRepository.checkEmailExists(email, callback);
    }

    /**
     * Check if username is already in use
     * @param userName the username to check
     * @param callback callback to handle result
     */
    public void checkUsernameAvailability(String userName, Callback<Void> callback) {
        userRepository.checkUsernameExists(userName, callback);
    }
    
    /**
     * clears all form data (useful for testing or if user wants to start over)
     */
    public void clearData() {
        firstName = null;
        lastName = null;
        profilePictureUri = null;
        birthday = null;
        gender = null;
        email = null;
        password = null;
        phoneNumber = null;
    }
}

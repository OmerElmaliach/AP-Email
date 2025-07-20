package com.example.ap_emailandroid.viewmodel;

import android.net.Uri;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;
import com.example.ap_emailandroid.model.SignUpRequest;
import com.example.ap_emailandroid.repository.UserRepository;

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
    
    // observables for ui state
    private MutableLiveData<Boolean> isLoading = new MutableLiveData<>(false);
    private MutableLiveData<Boolean> signUpSuccess = new MutableLiveData<>(false);
    private MutableLiveData<String> errorMessage = new MutableLiveData<>("");
    
    public SignUpViewModel() {
        userRepository = new UserRepository(); // placeholder - will be implemented by another team member
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
    
    /**
     * submits the signup request to the backend
     * this method will coordinate with the repository to save user data to mongodb
     */
    public void submitSignUp() {
        isLoading.setValue(true);
        errorMessage.setValue("");
        
        // create signup request object
        SignUpRequest request = new SignUpRequest();
        request.setFirstName(firstName);
        request.setLastName(lastName);
        request.setEmail(email);
        request.setUserName(email); // username = email as per web implementation
        request.setPassword(password);
        request.setBirthday(birthday);
        request.setGender(gender);
        request.setProfilePictureUri(profilePictureUri);
        
        // todo: implement actual network call via repository
        // for now, simulate success after delay
        // the actual implementation will be done by another team member
        simulateNetworkCall(request);
    }
    
    /**
     * placeholder method to simulate network call
     * the actual implementation will use mongodb and network calls
     * implemented by another team member
     */
    private void simulateNetworkCall(SignUpRequest request) {
        // simulate network delay
        new Thread(() -> {
            try {
                Thread.sleep(2000); // 2 second delay
                
                // simulate success
                isLoading.postValue(false);
                signUpSuccess.postValue(true);
                
                // todo: replace with actual repository call
                // userRepository.createUser(request);
                
            } catch (InterruptedException e) {
                isLoading.postValue(false);
                errorMessage.postValue("signup failed. please try again.");
            }
        }).start();
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
    }
}

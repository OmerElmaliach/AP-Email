package com.example.ap_emailandroid.model;

import android.net.Uri;

/**
 * data model for signup request
 * contains all necessary fields for user registration
 */
public class SignUpRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String userName;
    private String password;
    private String birthday;
    private String gender;
    private Uri profilePictureUri;
    private String phoneNumber; // optional
    
    // constructors
    public SignUpRequest() {}
    
    public SignUpRequest(String firstName, String lastName, String email, String userName, 
                        String password, String birthday, String gender) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.userName = userName;
        this.password = password;
        this.birthday = birthday;
        this.gender = gender;
    }
    
    // getters and setters
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
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getUserName() {
        return userName;
    }
    
    public void setUserName(String userName) {
        this.userName = userName;
    }
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
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
    
    public Uri getProfilePictureUri() {
        return profilePictureUri;
    }
    
    public void setProfilePictureUri(Uri profilePictureUri) {
        this.profilePictureUri = profilePictureUri;
    }
    //TODO save picture adress then in add it to http req in VM(?)
    public String getPhoneNumber() {
        return phoneNumber;
    }
    
    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
}

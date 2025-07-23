package com.example.ap_emailandroid.network;

import com.example.ap_emailandroid.local.Email;
import com.example.ap_emailandroid.local.Label;
import com.example.ap_emailandroid.local.LabelResponse;
import com.example.ap_emailandroid.local.User;
import com.example.ap_emailandroid.model.SignInRequest;
import com.example.ap_emailandroid.model.SignInResponse;
import com.example.ap_emailandroid.model.SignUpResponse;

import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.PATCH;
import retrofit2.http.POST;
import retrofit2.http.DELETE;
import retrofit2.http.Body;
import retrofit2.http.Path;
import retrofit2.http.Query;
import retrofit2.http.Header;

import java.util.List;

// TODO: CHANGE TO JS SERVER URLS
public interface WebServiceAPI {
    // Emails
    @GET("/api/mails/") //works
    Call<List<Email>> getEmails();

    @POST("/api/mails/") //TODO
    Call<Email> createEmail(@Body Email email);

    @PATCH("/api/mails/{id}") //TODO
    Call<Email> updateEmail(@Path("id") String mailId, @Body Email email);

    @DELETE("/api/mails/{id}") //TODO
    Call<Void> deleteEmail(@Path("id") String mailId);

    @GET("/api/labels/") //TODO - remove degualt labels
    Call<List<Label>> getLabels();

    @POST("/api/labels/") //TODO change backend
    Call<LabelResponse> createLabel(@Body Label label);

    @DELETE("/api/labels/{id}") //works
    Call<Void> deleteLabel(@Path("id") String id);

    // User endpoints
    @POST("/api/users") //we dont use
    Call<SignUpResponse> createUser(@Body User user);

    @GET("/api/users/me")
    Call<User> getCurrentUser(@Header("Authorization") String token);

    @POST("/api/signin")
    Call<SignInResponse> signIn(@Body SignInRequest signInRequest);

}
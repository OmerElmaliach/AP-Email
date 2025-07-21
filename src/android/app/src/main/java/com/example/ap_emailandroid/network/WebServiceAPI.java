package com.example.ap_emailandroid.network;

import com.example.ap_emailandroid.local.Email;
import com.example.ap_emailandroid.local.Label;
import com.example.ap_emailandroid.local.User;
import com.example.ap_emailandroid.model.SignInRequest;
import com.example.ap_emailandroid.model.SignInResponse;
import com.example.ap_emailandroid.model.SignUpResponse;

import retrofit2.Call;
import retrofit2.http.GET;
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
    @GET("/emails")
    Call<List<Email>> getEmails(@Query("userId") String userId);

    @POST("/emails")
    Call<Email> createEmail(@Body Email email);

    @DELETE("/emails/{id}")
    Call<Void> deleteEmail(@Path("id") String mail_id, @Query("userId") String userId);

    @GET("/labels")
    Call<List<Label>> getLabels(@Query("userId") String userId);

    @POST("/labels")
    Call<Label> createLabel(@Body Label label);

    @DELETE("/labels/{id}")
    Call<Void> deleteLabel(@Path("id") String id, @Query("userId") String userId);

    // User endpoints
    @POST("/api/users")
    Call<SignUpResponse> createUser(@Body User user);

    @GET("/api/users/me")
    Call<User> getCurrentUser(@Header("Authorization") String token);

    @POST("/api/signin")
    Call<SignInResponse> signIn(@Body SignInRequest signInRequest);

}
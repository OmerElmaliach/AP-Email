package com.example.ap_emailandroid.network;

import com.example.ap_emailandroid.local.Email;
import com.example.ap_emailandroid.local.Label;

import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.PATCH;
import retrofit2.http.POST;
import retrofit2.http.DELETE;
import retrofit2.http.Body;
import retrofit2.http.Path;
import retrofit2.http.Query;

import java.util.List;

// TODO: CHANGE TO JS SERVER URLS
public interface WebServiceAPI {
    // Emails
    @GET("/emails")
    Call<List<Email>> getEmails();

    @POST("/emails")
    Call<Email> createEmail(@Body Email email);

    @PATCH("/emails/{id}")
    Call<Email> updateEmail(@Path("id") String mailId, @Body Email email);

    @DELETE("/emails/{id}")
    Call<Void> deleteEmail(@Path("id") String mailId);

    @GET("/labels")
    Call<List<Label>> getLabels();

    @POST("/labels")
    Call<Label> createLabel(@Body Label label);

    @DELETE("/labels/{id}")
    Call<Void> deleteLabel(@Path("id") String id);

}
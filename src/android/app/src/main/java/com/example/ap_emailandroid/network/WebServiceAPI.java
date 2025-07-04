package com.example.ap_emailandroid.network;

import com.example.ap_emailandroid.local.Email;
import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.DELETE;
import retrofit2.http.Body;
import retrofit2.http.Path;

import java.util.List;

public interface WebServiceAPI {
    @GET("/")
    Call<List<Email>> getEmails();

    @POST("/")
    Call<Void> createEmail(@Body Email email);

    @DELETE("/{id}")
    Call<Void> deleteEmail(@Path("id") int id);
}
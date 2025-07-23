package com.example.ap_emailandroid.network;

import androidx.annotation.NonNull;

import java.io.IOException;

import okhttp3.Interceptor;
import okhttp3.Request;
import okhttp3.Response;

public class AuthInterceptor implements Interceptor {
    private final String userId;

    public AuthInterceptor(String userId) {
        this.userId = userId;
    }

    @NonNull
    @Override
    public Response intercept(Chain chain) throws IOException {
        Request original = chain.request();
        Request requestWithHeaders = original.newBuilder()
                .header("Authorization", "Bearer " + userId)
                .build();

        return chain.proceed(requestWithHeaders);
    }
}
package com.example.ap_emailandroid.network;

import android.util.Log;

import androidx.annotation.NonNull;
import androidx.lifecycle.MutableLiveData;

import com.example.ap_emailandroid.AppController;
import com.example.ap_emailandroid.R;
import com.example.ap_emailandroid.local.Email;
import com.example.ap_emailandroid.local.EmailDao;
import retrofit2.Call;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.Callback;
import retrofit2.converter.gson.GsonConverterFactory;

import java.util.List;

public class EmailAPI {
    private MutableLiveData<List<Email>> emailListData;
    private EmailDao dao;
    private final String userId;
    Retrofit retrofit;
    WebServiceAPI webServiceAPI;

    public EmailAPI(MutableLiveData<List<Email>> emailListData, EmailDao dao, String userId) {
        this.userId = userId;
        this.emailListData = emailListData;
        this.dao = dao;

        retrofit = new Retrofit.Builder().baseUrl(AppController.context.getString(R.string.BaseUrl))
                .addConverterFactory(GsonConverterFactory.create())
                .build();
        webServiceAPI = retrofit.create(WebServiceAPI.class);
    }

    public void get() {
        Call<List<Email>> call = webServiceAPI.getEmails(userId);
        call.enqueue(new Callback<>() {
            @Override
            public void onResponse(@NonNull Call<List<Email>> call, @NonNull Response<List<Email>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    List<Email> fromSer = response.body();

                    new Thread(() -> {
                        List<Email> current = dao.index();
                        dao.delete(current.toArray(new Email[0]));
                        dao.insert(fromSer.toArray(new Email[0]));
                        emailListData.postValue(dao.index());
                    }).start();
                }
            }

            @Override
            public void onFailure(@NonNull Call<List<Email>> call, @NonNull Throwable t) {
                Log.e("EmailAPI", "API call failed", t);
            }
        });
    }

    public void create(Email email) {
        Call<Void> call = webServiceAPI.createEmail(email);
        call.enqueue(new Callback<>() {
            @Override
            public void onResponse(@NonNull Call<Void> call, @NonNull Response<Void> response) {
                if (response.isSuccessful()) {
                    Log.i("EmailAPI", "Email created: " + response.body());
                } else {
                    Log.e("EmailAPI", "Failed to create email: " + response.code());
                }
            }

            @Override
            public void onFailure(@NonNull Call<Void> call, @NonNull Throwable t) {
                Log.e("EmailAPI", "Create request failed", t);
            }
        });
    }

    public void delete(Email email) {
        Call<Void> call = webServiceAPI.deleteEmail(email.getEmailJaId(), userId);
        call.enqueue(new Callback<>() {
            @Override
            public void onResponse(@NonNull Call<Void> call, @NonNull Response<Void> response) {
                if (response.isSuccessful()) {
                    Log.e("EmailAPI", "Email deleted successfully: " + response.code());
                } else {
                    Log.e("EmailAPI", "Deletion failed: " + response.code());
                }
            }

            @Override
            public void onFailure(@NonNull Call<Void> call, @NonNull Throwable t) {
                Log.e("EmailAPI", "Delete request failed", t);
            }
        });
    }
}


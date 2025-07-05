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
    Retrofit retrofit;
    WebServiceAPI webServiceAPI;

    public EmailAPI(MutableLiveData<List<Email>> emailListData, EmailDao dao) {
        this.emailListData = emailListData;
        this.dao = dao;

        retrofit = new Retrofit.Builder().baseUrl(AppController.context.getString(R.string.BaseUrl))
                .addConverterFactory(GsonConverterFactory.create())
                .build();
        webServiceAPI = retrofit.create(WebServiceAPI.class);
    }

    public void get() {
        Call<List<Email>> call = webServiceAPI.getEmails();
        call.enqueue(new Callback<List<Email>>() {
            @Override
            public void onResponse(@NonNull Call<List<Email>> call, @NonNull Response<List<Email>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    List<Email> fromSer = response.body();
                    List<Email> current = dao.index();
                    dao.delete(current.toArray(new Email[0]));
                    dao.insert(fromSer.toArray(new Email[0]));
                    emailListData.postValue(dao.index());
                }
            }

            @Override
            public void onFailure(Call<List<Email>> call, Throwable t) {
                // TODO: IMPLEMENT FAILURE EVENT.
                Log.e("EmailAPI", "API call failed", t);
            }
        });
    }
}


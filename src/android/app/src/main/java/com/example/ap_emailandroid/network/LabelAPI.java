package com.example.ap_emailandroid.network;

import android.util.Log;

import androidx.annotation.NonNull;
import androidx.lifecycle.MutableLiveData;

import com.example.ap_emailandroid.AppController;
import com.example.ap_emailandroid.R;
import com.example.ap_emailandroid.local.Label;
import com.example.ap_emailandroid.local.LabelDao;

import retrofit2.Call;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.Callback;
import retrofit2.converter.gson.GsonConverterFactory;

import java.util.List;

public class LabelAPI {
    private MutableLiveData<List<Label>> labelListData;
    private LabelDao dao;
    Retrofit retrofit;
    WebServiceAPI webServiceAPI;

    public LabelAPI(MutableLiveData<List<Label>> labelListData, LabelDao dao) {
        this.labelListData = labelListData;
        this.dao = dao;

        retrofit = new Retrofit.Builder().baseUrl(AppController.context.getString(R.string.BaseUrl))
                .addConverterFactory(GsonConverterFactory.create())
                .build();
        webServiceAPI = retrofit.create(WebServiceAPI.class);
    }

    public void get() {
        Call<List<Label>> call = webServiceAPI.getLabels();
        call.enqueue(new Callback<>() {
            @Override
            public void onResponse(@NonNull Call<List<Label>> call, @NonNull Response<List<Label>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    List<Label> fromSer = response.body();

                    new Thread(() -> {
                        List<Label> current = dao.index();
                        dao.delete(current.toArray(new Label[0]));
                        dao.insert(fromSer.toArray(new Label[0]));
                        labelListData.postValue(dao.index());
                    }).start();
                }
            }

            @Override
            public void onFailure(@NonNull Call<List<Label>> call, @NonNull Throwable t) {
                Log.e("LabelAPI", "API call failed", t);
            }
        });
    }

    public void create(Label label) {
        Call<Void> call = webServiceAPI.createLabel(label);
        call.enqueue(new Callback<>() {
            @Override
            public void onResponse(@NonNull Call<Void> call, @NonNull Response<Void> response) {
                if (response.isSuccessful()) {
                    Log.i("LabelAPI", "Label created: " + response.body());
                } else {
                    Log.e("LabelAPI", "Failed to create label: " + response.code());
                }
            }

            @Override
            public void onFailure(@NonNull Call<Void> call, @NonNull Throwable t) {
                Log.e("LabelAPI", "Create request failed", t);
            }
        });
    }

    public void delete(Label label) {
        Call<Void> call = webServiceAPI.deleteLabel(label.getId());
        call.enqueue(new Callback<>() {
            @Override
            public void onResponse(@NonNull Call<Void> call, @NonNull Response<Void> response) {
                if (response.isSuccessful()) {
                    Log.e("LabelAPI", "Label deleted successfully: " + response.code());
                } else {
                    Log.e("LabelAPI", "Deletion failed: " + response.code());
                }
            }

            @Override
            public void onFailure(@NonNull Call<Void> call, @NonNull Throwable t) {
                Log.e("LabelAPI", "Delete request failed", t);
            }
        });
    }
}


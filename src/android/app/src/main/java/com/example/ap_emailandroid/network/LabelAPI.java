package com.example.ap_emailandroid.network;

import android.util.Log;

import androidx.annotation.NonNull;
import androidx.lifecycle.MutableLiveData;

import com.example.ap_emailandroid.AppController;
import com.example.ap_emailandroid.R;
import com.example.ap_emailandroid.local.Label;
import com.example.ap_emailandroid.local.LabelDao;

import okhttp3.OkHttpClient;
import retrofit2.Call;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.Callback;
import retrofit2.converter.gson.GsonConverterFactory;

import java.util.List;
import java.util.function.Consumer;

public class LabelAPI {
    private MutableLiveData<List<Label>> labelListData;
    private LabelDao dao;
    private final String userId;
    Retrofit retrofit;
    WebServiceAPI webServiceAPI;

    public LabelAPI(MutableLiveData<List<Label>> labelListData, LabelDao dao, String userId) {
        this.userId = userId;
        this.labelListData = labelListData;
        this.dao = dao;

        OkHttpClient client = new OkHttpClient.Builder()
                .addInterceptor(new AuthInterceptor(userId))
                .build();

        retrofit = new Retrofit.Builder()
                .baseUrl(AppController.context.getString(R.string.BaseUrl))
                .client(client)
                .addConverterFactory(GsonConverterFactory.create())
                .build();
        webServiceAPI = retrofit.create(WebServiceAPI.class);
    }

    public void get() {
        Call<List<Label>> call = webServiceAPI.getLabels();
        call.enqueue(new Callback<>() {
            @Override
            public void onResponse(@NonNull Call<List<Label>> call, @NonNull Response<List<Label>> res) {
                if (res.isSuccessful() && res.body() != null) {
                    List<Label> fromSer = res.body();

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

    public void create(Label label, Consumer<Label> onSuccess) {
        Call<Label> call = webServiceAPI.createLabel(label);
        call.enqueue(new Callback<>() {
            @Override
            public void onResponse(@NonNull Call<Label> call, @NonNull Response<Label> res) {
                if (res.isSuccessful() && res.body() != null) {
                    Label createdLabel = res.body();
                    label.setId(createdLabel.getId());
                    Log.i("LabelAPI", "Label created: " + createdLabel.getId());
                    onSuccess.accept(createdLabel);
                } else {
                    Log.e("LabelAPI", "Failed to create label: " + res.code());
                }
            }

            @Override
            public void onFailure(@NonNull Call<Label> call, @NonNull Throwable t) {
                Log.e("LabelAPI", "Create request failed", t);
            }
        });
    }

    public void delete(Label label) {
        Call<Void> call = webServiceAPI.deleteLabel(label.getId());
        call.enqueue(new Callback<>() {
            @Override
            public void onResponse(@NonNull Call<Void> call, @NonNull Response<Void> res) {
                if (res.isSuccessful()) {
                    Log.e("LabelAPI", "Label deleted successfully: " + res.code());
                } else {
                    Log.e("LabelAPI", "Deletion failed: " + res.code());
                }
            }

            @Override
            public void onFailure(@NonNull Call<Void> call, @NonNull Throwable t) {
                Log.e("LabelAPI", "Delete request failed", t);
            }
        });
    }
}


package com.example.ap_emailandroid.repository;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.example.ap_emailandroid.AppController;
import com.example.ap_emailandroid.AppSession;
import com.example.ap_emailandroid.db.LocalDatabase;
import com.example.ap_emailandroid.local.Label;
import com.example.ap_emailandroid.local.LabelDao;
import com.example.ap_emailandroid.network.LabelAPI;

import java.util.LinkedList;
import java.util.List;

public class LabelsRepository {
    private final LabelDao dao;
    private final LabelListData labelListData;
    private final LabelAPI api;

    public LabelsRepository() {
        dao = LocalDatabase.getInstance(AppController.context).labelDao();
        labelListData = new LabelListData();
        api = new LabelAPI(labelListData, dao, AppSession.userId);
    }

    class LabelListData extends MutableLiveData<List<Label>> {
        public LabelListData() {
            super();
            setValue(new LinkedList<>());
        }

        @Override
        protected void onActive() {
            super.onActive();
            new Thread(() -> postValue(dao.index())).start();
        }
    }

    public LiveData<List<Label>> getAll() {
        return labelListData;
    }

    public void add(Label label) {
        new Thread(() -> {
            long id = dao.insert(label);
            label.setLabelJaId((int) id);
            labelListData.postValue(dao.index());
        }).start();
        api.create(label);
    }

    public void delete(Label label) {
        new Thread(() -> {
            dao.delete(label);
            labelListData.postValue(dao.index());
        }).start();
        api.delete(label);
    }

    public void reload() {
        api.get();
    }
}

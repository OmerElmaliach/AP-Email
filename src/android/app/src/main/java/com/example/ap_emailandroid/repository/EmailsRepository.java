package com.example.ap_emailandroid.repository;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.example.ap_emailandroid.AppController;
import com.example.ap_emailandroid.db.LocalDatabase;
import com.example.ap_emailandroid.local.Email;
import com.example.ap_emailandroid.local.EmailDao;
import com.example.ap_emailandroid.network.EmailAPI;

import java.util.LinkedList;
import java.util.List;

public class EmailsRepository {
    private final EmailDao dao;
    private final EmailListData emailListData;
    private final EmailAPI api;

    public EmailsRepository() {
        dao = LocalDatabase.getInstance(AppController.context).emailDao();
        emailListData = new EmailListData();
        api = new EmailAPI(emailListData, dao);
    }

    class EmailListData extends MutableLiveData<List<Email>> {
        public EmailListData() {
            super();
            setValue(new LinkedList<>());
        }

        @Override
        protected void onActive() {
            super.onActive();
            postValue(dao.index());
        }
    }

    public LiveData<List<Email>> getAll() {
        return emailListData;
    }

    public void add(Email email) {
        dao.insert(email);
        emailListData.postValue(dao.index());
    }

    public void delete(Email email) {
        dao.delete(email);
        emailListData.postValue(dao.index());
    }

    public void reload() {
        api.get();
    }
}

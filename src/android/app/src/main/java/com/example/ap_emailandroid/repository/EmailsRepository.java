package com.example.ap_emailandroid.repository;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.example.ap_emailandroid.AppController;
import com.example.ap_emailandroid.AppSession;
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
        api = new EmailAPI(emailListData, dao, AppSession.userId);
    }

    class EmailListData extends MutableLiveData<List<Email>> {
        public EmailListData() {
            super();
            setValue(new LinkedList<>());
        }

        @Override
        protected void onActive() {
            super.onActive();
            new Thread(() -> postValue(dao.index())).start();
        }
    }

    public LiveData<List<Email>> getAll() {
        return emailListData;
    }

    public void add(Email email) {
        api.create(email, created -> {
            new Thread(() -> {
                dao.insert(created);
                emailListData.postValue(dao.index());
            }).start();
        });
    }

    public void update(Email email) {
        api.update(email, updateEmail -> {
            new Thread(() -> {
                emailListData.postValue(dao.index());
            }).start();
        });
    }

    public void delete(Email email) {
        new Thread(() -> {
            dao.delete(email);
            emailListData.postValue(dao.index());
        }).start();
        api.delete(email);
    }

    public void reload() {
        api.get();
    }
}

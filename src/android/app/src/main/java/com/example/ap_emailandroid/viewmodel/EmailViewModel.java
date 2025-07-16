package com.example.ap_emailandroid.viewmodel;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.ViewModel;

import com.example.ap_emailandroid.local.Email;
import com.example.ap_emailandroid.repository.EmailsRepository;

import java.util.List;

public class EmailViewModel extends ViewModel {
    private EmailsRepository repository;
    private LiveData<List<Email>> emails;

    public EmailViewModel () {
        repository = new EmailsRepository();
        emails = repository.getAll();
        repository.reload();
    }

    public LiveData<List<Email>> getEmails() { return emails; }

    public void add(Email email) { repository.add(email); }

    public void delete(Email email) { repository.delete(email); }

    public void reload() { repository.reload(); }
}
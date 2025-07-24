package com.example.ap_emailandroid.viewmodel;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.Transformations;
import androidx.lifecycle.ViewModel;

import com.example.ap_emailandroid.local.Email;
import com.example.ap_emailandroid.repository.EmailsRepository;

import java.util.ArrayList;
import java.util.List;

public class EmailViewModel extends ViewModel {
    private EmailsRepository repository;
    private LiveData<List<Email>> emails;

    public EmailViewModel () {
        repository = new EmailsRepository();
        emails = repository.getAll();
        repository.reload();
    }

    public LiveData<List<Email>> getEmails() {
        return emails;
    }

    public void add(Email email) {
        repository.add(email);
    }

    public void delete(Email email) {
        repository.delete(email);
    }

    public void update(Email email) {
        repository.update(email);
    }

    public void reportSpam(String url) {
        repository.reportSpam(url);
    }

    public void reload() {
        repository.reload();
    }

    public LiveData<List<Email>> searchEmailsInLabel(String label, String query) {
        return Transformations.map(emails, list -> {
            List<Email> filteredEmails = new ArrayList<>();
            for (Email email : list) {
                boolean matchesText = email.getSubject().toLowerCase().contains(query.toLowerCase())
                        || email.getBody().toLowerCase().contains(query.toLowerCase());
                if ((query.isBlank() || matchesText)
                        && (email.getLabel() != null && email.getLabel().contains(label)))
                    filteredEmails.add(email);
            }
            return filteredEmails;
        });
    }
}
package com.example.ap_emailandroid.viewmodel;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.ViewModel;

import com.example.ap_emailandroid.local.Label;
import com.example.ap_emailandroid.repository.LabelsRepository;

import java.util.List;

public class LabelViewModel extends ViewModel {
    private LabelsRepository repository;
    private LiveData<List<Label>> labels;

    public LabelViewModel () {
        repository = new LabelsRepository();
        labels = repository.getAll();
        repository.reload();
    }

    public LiveData<List<Label>> getLabels() { return labels; }

    public void add(Label label) { repository.add(label); }

    public void delete(Label label) { repository.delete(label); }

    public void reload() { repository.reload(); }
}
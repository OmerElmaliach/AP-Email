package com.example.ap_emailandroid.ui;

import android.annotation.SuppressLint;
import android.os.Bundle;
import android.widget.ImageButton;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;

import com.example.ap_emailandroid.R;
import com.example.ap_emailandroid.local.Email;
import com.example.ap_emailandroid.local.Label;
import com.example.ap_emailandroid.viewmodel.EmailViewModel;
import com.example.ap_emailandroid.viewmodel.LabelViewModel;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class EmailActivity extends AppCompatActivity {
    static final List<String> defLabels = List.of("inbox", "sent", "draft", "trash");
    private List<String> availableLabels;
    private List<String> availableRemLabels;
    private Map<String, String> userLabelMap;
    private boolean infoUpdated = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_email);

        // Assign to map default labels
        userLabelMap = new HashMap<>();
        userLabelMap.put("inbox", "Inbox");
        userLabelMap.put("starred", "Starred");
        userLabelMap.put("sent", "Sent");
        userLabelMap.put("draft", "Draft");
        userLabelMap.put("spam", "Spam");
        userLabelMap.put("trash", "Trash");

        EmailViewModel emailViewModel = new ViewModelProvider(this).get(EmailViewModel.class);
        Email email = (Email) getIntent().getSerializableExtra("email");
        if (email == null) {
            Toast.makeText(this, "Failed to load email information", Toast.LENGTH_SHORT).show();
            finish();
            return;
        }

        LabelViewModel labelViewModel = new ViewModelProvider(this).get(LabelViewModel.class);
        availableLabels = new ArrayList<>();
        availableRemLabels = new ArrayList<>();

        labelViewModel.getLabels().observe(this, labels -> {
            availableLabels.clear();
            availableRemLabels.clear();

            if (labels != null) {
                for (Label label : labels) {
                    String name = label.getName();
                    String id = label.getId();
                    if (name == null || id == null) continue;

                    userLabelMap.put(id, name);

                    String keyForName = findKeyByValue(name);
                    if (email.getLabel() != null && !email.getLabel().contains(keyForName)) {
                        availableLabels.add(name);
                    }
                }
            }

            if (!infoUpdated) {
                updateInfo(email);
                infoUpdated = true;
            }

            for (String label : email.getLabel()) {
                if (!defLabels.contains(label)) {
                    String name = userLabelMap.get(label);
                    if (name != null) availableRemLabels.add(name);
                }
            }

            updateLabelsInEmailView(email.getLabel());
        });

        ImageButton btn_back = findViewById(R.id.btn_back);
        btn_back.setOnClickListener(view -> finish());

        ImageButton btn_spam = findViewById(R.id.btn_spam);
        btn_spam.setOnClickListener(view -> addLabel(email, emailViewModel, "Spam"));

        ImageButton btn_starred = findViewById(R.id.btn_starred);
        btn_starred.setOnClickListener(view -> addLabel(email, emailViewModel, "Starred"));

        ImageButton btn_add_label = findViewById(R.id.btn_add_labels);
        btn_add_label.setOnClickListener(view -> {
            if (availableLabels.isEmpty()) {
                Toast.makeText(this, "No labels available", Toast.LENGTH_SHORT).show();
                return;
            }
            String[] labelsArray = availableLabels.toArray(new String[0]);

            AlertDialog.Builder builder = new AlertDialog.Builder(this);
            builder.setTitle("Select a Label to add");
            builder.setItems(labelsArray, (dialog, which) -> {
                String selectedLabel = labelsArray[which];
                addLabel(email, emailViewModel, selectedLabel);
            });

            builder.show();
        });

        ImageButton btn_remove_label = findViewById(R.id.btn_remove_labels);
        btn_remove_label.setOnClickListener(view -> {
            if (email.getLabel().isEmpty()) {
                Toast.makeText(this, "No labels to remove", Toast.LENGTH_SHORT).show();
                return;
            }
            String[] labelsArray = availableRemLabels.toArray(new String[0]);

            AlertDialog.Builder builder = new AlertDialog.Builder(this);
            builder.setTitle("Select a Label to remove");
            builder.setItems(labelsArray, (dialog, which) -> {
                String selectedLabel = labelsArray[which];
                removeLabel(email, emailViewModel, selectedLabel);
            });

            builder.show();
        });

        ImageButton btn_trash = findViewById(R.id.btn_trash);
        btn_trash.setOnClickListener(view -> {
            addLabel(email, emailViewModel, "Trash");
            finish();
        });
    }

    private void updateInfo(Email email) {
        TextView textView = findViewById(R.id.email_subject);
        textView.append(email.getSubject());

        List<String> labels = email.getLabel();
        updateLabelsInEmailView(labels);

        TextView fromView = findViewById(R.id.email_from);
        fromView.append(" " + email.getFrom());

        TextView toView = findViewById(R.id.email_to);
        toView.append(" " + email.getTo());

        TextView dateView = findViewById(R.id.email_date);
        dateView.append(" " + email.getDateSent());

        TextView bodyView = findViewById(R.id.email_body);
        bodyView.append(email.getBody());
    }

    private void addLabel(Email email, EmailViewModel emailViewModel, String labelName) {
        String labelId = findKeyByValue(labelName);
        if (email.getLabel().contains(labelId)) {
            Toast.makeText(this, "Email already labeled as such", Toast.LENGTH_SHORT).show();
            return;
        }

        List<String> newLabels = new ArrayList<>(email.getLabel());
        newLabels.add(labelId);
        email.setLabel(newLabels);
        emailViewModel.update(email);
        TextView labelView = findViewById(R.id.labels);
        labelView.append(", " + labelName);

        availableLabels.remove(labelName);
        availableRemLabels.add(labelName);
        emailViewModel.reload();
    }

    @SuppressLint("SetTextI18n")
    private void removeLabel(Email email, EmailViewModel emailViewModel, String labelName) {
        String labelId = findKeyByValue(labelName);
        if (defLabels.contains(labelId)) {
            Toast.makeText(this, "Cannot remove a default label", Toast.LENGTH_SHORT).show();
            return;
        }

        if (!email.getLabel().contains(labelId)) {
            Toast.makeText(this, "Email does not contain this label", Toast.LENGTH_SHORT).show();
            return;
        }

        List<String> newLabels = new ArrayList<>(email.getLabel());
        newLabels.remove(labelId);
        email.setLabel(newLabels);
        emailViewModel.update(email);
        updateLabelsInEmailView(newLabels);
        availableLabels.add(labelName);
        availableRemLabels.remove(labelName);
        emailViewModel.reload();
    }

    @SuppressLint("SetTextI18n")
    private void updateLabelsInEmailView(List<String> emailLabelIds) {
        TextView labelView = findViewById(R.id.labels);
        labelView.setText("Labels: ");
        for (int i = 0; i < emailLabelIds.size(); i++) {
            String labelId = emailLabelIds.get(i);
            String labelName = userLabelMap.get(labelId);
            if (labelName == null) {
                labelName = "[Unknown: " + labelId + "]";
            }
            labelView.append(labelName);
            if (i < emailLabelIds.size() - 1) {
                labelView.append(", ");
            }
        }
    }

    public String findKeyByValue(String targetValue) {
        for (Map.Entry<String, String> entry : userLabelMap.entrySet()) {
            if (entry.getValue().equals(targetValue)) {
                return entry.getKey();
            }
        }

        return null;
    }
}

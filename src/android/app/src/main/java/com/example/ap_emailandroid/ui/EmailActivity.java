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
import java.util.List;

public class EmailActivity extends AppCompatActivity {
    static final List<String> defLabels = List.of("Inbox", "Starred", "Sent", "Draft", "Spam", "Trash");
    private List<String> availableLabels;
    private List<String> availableRemLabels;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_email);
        EmailViewModel emailViewModel = new ViewModelProvider(this).get(EmailViewModel.class);
        Email email = (Email) getIntent().getSerializableExtra("email");
        if (email != null) {
            updateInfo(email);
        } else {
            Toast.makeText(this, "Failed to load email information", Toast.LENGTH_SHORT).show();
            finish();
        }

        LabelViewModel labelViewModel = new ViewModelProvider(this).get(LabelViewModel.class);
        availableLabels = new ArrayList<>();
        availableRemLabels = new ArrayList<>();

        labelViewModel.getLabels().observe(this, labels -> {
            availableLabels.clear();
            if (labels != null) {
                for (Label label : labels) {
                    assert email != null;
                    if (!email.getLabel().contains(label.getName()))
                        availableLabels.add(label.getName());
                }
            }
        });

        assert email != null;
        for (String label : email.getLabel()) {
            if (!defLabels.contains(label))
                availableRemLabels.add(label);
        }

        ImageButton btn_back = findViewById(R.id.btn_back);
        btn_back.setOnClickListener(view -> {
            finish();
        });

        ImageButton btn_spam = findViewById(R.id.btn_spam);
        btn_spam.setOnClickListener(view -> {
            assert email != null;
            addLabel(email, emailViewModel, "spam");
        });

        ImageButton btn_starred = findViewById(R.id.btn_starred);
        btn_starred.setOnClickListener(view -> {
            assert email != null;
            addLabel(email, emailViewModel, "starred");
        });

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
            assert email != null;
            addLabel(email, emailViewModel, "trash");
            finish();
        });
    }

    private void updateInfo(Email email) {
        TextView textView = findViewById(R.id.email_subject);
        textView.append(email.getSubject());

        List<String> labels = email.getLabel();
        TextView labelView = findViewById(R.id.labels);
        labelView.append(" ");
        for (int i = 0; i < labels.size() - 1; i++) {
            labelView.append(labels.get(i) + ", ");
        }
        labelView.append(labels.get(labels.size() - 1));

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
        if (email.getLabel().contains(labelName)) {
            Toast.makeText(this, "Email already labeled as such", Toast.LENGTH_SHORT).show();
            return;
        }

        List<String> newLabels = new ArrayList<>(email.getLabel());
        newLabels.add(labelName);
        email.setLabel(newLabels);
        emailViewModel.update(email);
        TextView labelView = findViewById(R.id.labels);
        labelView.append(", " + labelName);

        availableLabels.remove(labelName);
        availableRemLabels.add(labelName);
    }

    @SuppressLint("SetTextI18n")
    private void removeLabel(Email email, EmailViewModel emailViewModel, String labelName) {
        if (defLabels.contains(labelName)) {
            Toast.makeText(this, "Cannot remove a default label", Toast.LENGTH_SHORT).show();
            return;
        }

        if (!email.getLabel().contains(labelName)) {
            Toast.makeText(this, "Email does not contain this label", Toast.LENGTH_SHORT).show();
            return;
        }

        List<String> newLabels = new ArrayList<>(email.getLabel());
        newLabels.remove(labelName);
        email.setLabel(newLabels);
        emailViewModel.update(email);
        TextView labelView = findViewById(R.id.labels);
        labelView.setText("Labels: ");
        for (int i = 0; i < newLabels.size() - 1; i++) {
            labelView.append(newLabels.get(i) + ", ");
        }
        labelView.append(newLabels.get(newLabels.size() - 1));
        availableLabels.add(labelName);
        availableRemLabels.remove(labelName);
    }
}

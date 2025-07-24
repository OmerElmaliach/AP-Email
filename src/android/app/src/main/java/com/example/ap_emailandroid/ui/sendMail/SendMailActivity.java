package com.example.ap_emailandroid.ui.sendMail;

import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.widget.EditText;
import android.widget.Toast;
import android.widget.ImageButton;
import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;

import com.example.ap_emailandroid.R;
import com.example.ap_emailandroid.local.Email;
import  com.example.ap_emailandroid.network.EmailAPI;
import com.example.ap_emailandroid.ui.InboxActivity;
import com.example.ap_emailandroid.viewmodel.EmailViewModel;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class SendMailActivity extends AppCompatActivity {
    // navigation buttons on the top
    private ImageButton btnBack, btnSend,btnSaveDraft;
    // textboxes to hold mail info
    private EditText editTo, editSubject, editBody;
    private Email oldEmail = null;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_send_mail);

        btnBack = findViewById(R.id.btn_back);
        btnSend = findViewById(R.id.btn_send);
        btnSaveDraft = findViewById(R.id.btn_draft);

        editTo = findViewById(R.id.edit_to);
        editSubject = findViewById(R.id.edit_subject);
        editBody = findViewById(R.id.edit_body);


        // if this is a edit page the intent will pass the old email
        oldEmail = (Email) getIntent().getSerializableExtra("email");
        if (oldEmail != null) {
            // Join the list into a comma-separated string
            String toText = String.join(", ", oldEmail.getTo());

            editTo.setText(toText);
            editSubject.setText(oldEmail.getSubject());
            editBody.setText(oldEmail.getBody());
        }


        //focus listener- when user clicks another box add the @AP
        editTo.setOnFocusChangeListener(new View.OnFocusChangeListener() {
            @Override
            public void onFocusChange(View v, boolean hasFocus) {
                if (!hasFocus) {  // lost focus
                    String rawInput = editTo.getText().toString().trim();
                    if (rawInput.isEmpty()) return;

                    String[] parts = rawInput.split("[,\\s]+"); // split by comma or whitespace
                    List<String> fixedEmails = new ArrayList<>();

                    for (String part : parts) {
                        String email = part.trim();
                        if (!email.endsWith("@AP-Email")) {
                            int atIndex = email.indexOf('@');
                            if (atIndex != -1) {
                                email = email.substring(0, atIndex);
                            }
                            email += "@AP-Email";
                        }
                        fixedEmails.add(email);
                    }

                    // Join with comma+space, update EditText so user sees normalized emails
                    editTo.setText(TextUtils.join(", ", fixedEmails));
                }
            }
        });
        btnBack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();  // close the activity
            }
        });

        btnSend.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                sendEmail();
            }
        });


        btnSaveDraft.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                saveDraft();
            }
        });
    }
    private void sendEmail(){

        String rawTo = editTo.getText().toString().trim();

        if (rawTo.isEmpty()) {
            Toast.makeText(this, "Missing recipient email", Toast.LENGTH_SHORT).show();
            return;
        }
        // then parse and fix the emails to
        String[] toArray = rawTo.split(",");
        List<String> to = new ArrayList<>();

        for (String rawEmail : toArray) {
            String email = rawEmail.trim();
            if (!email.endsWith("@AP-Email")) {
                int atIndex = email.indexOf('@');
                if (atIndex != -1) {
                    email = email.substring(0, atIndex);
                }
                email = email + "@AP-Email";
            }
            to.add(email);
        }

        // now check if list is empty )
        if (to.isEmpty()) {
            Toast.makeText(this, "Missing recipient email", Toast.LENGTH_SHORT).show();
            return;
        }

        String subject = editSubject.getText().toString().trim();
        String body = editBody.getText().toString().trim();

        if (subject.isEmpty()) {
            Toast.makeText(this, "missing email subject", Toast.LENGTH_SHORT).show();
            return;
        }
        if (body.isEmpty()) {
            Toast.makeText(this, "missing email body", Toast.LENGTH_SHORT).show();
            return;
        }

        Toast.makeText(this, "Sending mail...", Toast.LENGTH_SHORT).show();

        EmailViewModel viewModel = new ViewModelProvider(this).get(EmailViewModel.class);

        Email email = new Email(null, null, to, subject, body, null, null);
        viewModel.add(email);

        // if this WAS a draft and now being sent, delete the draft email
        if (oldEmail != null && oldEmail.getLabel() != null && oldEmail.getLabel().contains("draft")) {
            // need to add 'trash' to label so the backend deletes
            oldEmail.setLabel(Arrays.asList("trash"));
            viewModel.delete(oldEmail);
        }
        Toast.makeText(this, "Mail sent", Toast.LENGTH_SHORT).show();
        //return to inbox
        Intent intent = new Intent(this, InboxActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        startActivity(intent);
    }

    private void saveDraft() {
        String rawTo = editTo.getText().toString().trim();
        String subject = editSubject.getText().toString().trim();
        String body = editBody.getText().toString().trim();

        if (subject.isEmpty()) {
            Toast.makeText(this, "Cannot save draft: Subject is empty", Toast.LENGTH_SHORT).show();
            return;
        }

        List<String> to = new ArrayList<>();
        if (!rawTo.isEmpty()) {
            String[] toArray = rawTo.split(",");
            for (String rawEmail : toArray) {
                String email = rawEmail.trim();
                if (!email.endsWith("@AP-Email")) {
                    int atIndex = email.indexOf('@');
                    if (atIndex != -1) {
                        email = email.substring(0, atIndex);
                    }
                    email += "@AP-Email";
                }
                to.add(email);
            }
        }

        EmailViewModel viewModel = new ViewModelProvider(this).get(EmailViewModel.class);

        // Construct draft email object
        if (oldEmail != null && oldEmail.getLabel() != null && oldEmail.getLabel().contains("draft")) {
            Email email = new Email(
                    oldEmail.getMailId(),          // <-- reuse the old ID
                    oldEmail.getFrom(),        // <-- keep same sender
                    to,
                    subject,
                    body,
                    oldEmail.getDateSent(),    // optional, or null if system sets
                    Arrays.asList("draft")
            );
            viewModel.update(email);
        } else {
            Email email = new Email(
                    null,
                    null,
                    to,
                    subject,
                    body,
                    null,
                    Arrays.asList("draft")
            );
            viewModel.add(email);
        }
        Toast.makeText(this, "Draft saved", Toast.LENGTH_SHORT).show();
        //return to inbox
        Intent intent = new Intent(this, InboxActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        startActivity(intent);    }





}
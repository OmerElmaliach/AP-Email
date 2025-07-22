package com.example.ap_emailandroid.ui.sendMail;

import android.os.Bundle;
import android.view.View;
import android.widget.EditText;
import android.widget.Toast;
import android.widget.ImageButton;
import androidx.appcompat.app.AppCompatActivity;

import com.example.ap_emailandroid.R;
import com.example.ap_emailandroid.local.Email;
import  com.example.ap_emailandroid.network.EmailAPI;

public class SendMailActivity extends AppCompatActivity {
    // navigation buttons on the top
    ImageButton btnBack, btnSend;
    // textboxes to hold mail info
    EditText editTo, editSubject, editBody;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_send_mail);

        btnBack = findViewById(R.id.btn_back);
        btnSend = findViewById(R.id.btn_send);

        editTo = findViewById(R.id.edit_to);
        editSubject = findViewById(R.id.edit_subject);
        editBody = findViewById(R.id.edit_body);

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

    }
    private void sendEmail(){
        String to = editTo.getText().toString().trim();
        String subject = editSubject.getText().toString().trim();
        String body = editBody.getText().toString().trim();

        if (to.isEmpty()) {
            Toast.makeText(this, "missing recipient email", Toast.LENGTH_SHORT).show();
            return;
        }
        if (subject.isEmpty()) {
            Toast.makeText(this, "missing email subject", Toast.LENGTH_SHORT).show();
            return;
        }
        if (body.isEmpty()) {
            Toast.makeText(this, "missing email body", Toast.LENGTH_SHORT).show();
            return;
        }

        Toast.makeText(this, "Sending mail...", Toast.LENGTH_SHORT).show();

        Email email = new Email(null,null,to,subject,body,null,null);

        //TODO send email, probably implament a send mail api


    }






}
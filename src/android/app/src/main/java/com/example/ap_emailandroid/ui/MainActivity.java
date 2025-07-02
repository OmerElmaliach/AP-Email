package com.example.ap_emailandroid.ui;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;

import com.example.ap_emailandroid.R;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_main);
        Button btn = findViewById(R.id.main_btn);
        btn.setOnClickListener(view -> {
            Intent intent = new Intent(this, InboxActivity.class);
            startActivity(intent);
        });

        // Temporary setup until Signin is defined and working.
    }
}
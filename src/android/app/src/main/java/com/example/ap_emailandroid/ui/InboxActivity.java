package com.example.ap_emailandroid.ui;

import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;
import com.example.ap_emailandroid.R;
import androidx.appcompat.app.ActionBarDrawerToggle;
import androidx.appcompat.widget.Toolbar;
import androidx.drawerlayout.widget.DrawerLayout;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.ap_emailandroid.ui.email.Email;
import com.example.ap_emailandroid.ui.email.EmailAdapter;
import com.google.android.material.navigation.NavigationView;

import java.util.Arrays;
import java.util.List;
import java.util.Objects;

public class InboxActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_inbox);

        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        Objects.requireNonNull(getSupportActionBar()).setDisplayShowTitleEnabled(false);

        DrawerLayout drawerLayout = findViewById(R.id.drawer_layout);
        NavigationView navView = findViewById(R.id.nav_view);

        ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(
                this, drawerLayout, toolbar,
                R.string.navigation_drawer_open,
                R.string.navigation_drawer_close);

        drawerLayout.addDrawerListener(toggle);
        toggle.syncState();

        // TODO: ADD DYNAMIC EMAILS
        RecyclerView emailList = findViewById(R.id.email_list);
        emailList.setLayoutManager(new LinearLayoutManager(this));

        List<Email> emails = Arrays.asList(
                new Email("Test Email 1", "Thanks for joining AP-Email."),
                new Email("Test Email 2", "Check out the new features."),
                new Email("Test Email 3", "We detected a login from a new device.")
        );

        EmailAdapter adapter = new EmailAdapter(emails, email -> {
            // TODO: ADD ONCLICK EVENT
        });

        emailList.setAdapter(adapter);
    }
}

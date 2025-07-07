package com.example.ap_emailandroid.ui;

import android.os.Bundle;
import android.view.Menu;
import android.view.View;
import android.widget.Button;

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

        // Handle user authentication data passed from SignInActivity
        handleUserAuthentication();
        
        setupToolbar();
        setupEmails();
    }

    /**
     * Handle user authentication data passed from SignInActivity
     */
    private void handleUserAuthentication() {
        String userToken = getIntent().getStringExtra("user_token");
        String userEmail = getIntent().getStringExtra("user_email");
        
        // Store authentication data for future API calls
        // In real implementation, you would store this in SharedPreferences or similar
        if (userToken != null && userEmail != null) {
            // Mock storage - in real app this would be properly secured
            // SharedPreferences prefs = getSharedPreferences("auth", MODE_PRIVATE);
            // prefs.edit().putString("token", userToken).putString("email", userEmail).apply();
        }
    }

    /**
     * Loads up the default and user specific labels to the toolbar.
     */
    public void setupToolbar() {
        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        Objects.requireNonNull(getSupportActionBar()).setDisplayShowTitleEnabled(false);

        DrawerLayout drawerLayout = findViewById(R.id.drawer_layout);
        ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(
                this, drawerLayout, toolbar,
                R.string.navigation_drawer_open,
                R.string.navigation_drawer_close);

        drawerLayout.addDrawerListener(toggle);
        toggle.syncState();

        // TODO: ADD DYNAMIC LABELS
        NavigationView nav_view = findViewById(R.id.nav_view);
        Menu menu = nav_view.getMenu();

        View headerView = nav_view.getHeaderView(0);
        Button label_btn = headerView.findViewById(R.id.add_label_btn);
        label_btn.setOnClickListener(view -> {
            // TODO: ADD ONCLICK EVENT
        });

        nav_view.setNavigationItemSelectedListener(item -> {
            String labelName = item.getTitle().toString();
            // TODO: ADD ONCLICK EVENT
            return true;
        });
    }


    /**
     * Loads up the relevant emails to the view.
     */
    public void setupEmails() {
        RecyclerView emailList = findViewById(R.id.email_list);
        emailList.setLayoutManager(new LinearLayoutManager(this));

        // TODO: ADD DYNAMIC EMAILS
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

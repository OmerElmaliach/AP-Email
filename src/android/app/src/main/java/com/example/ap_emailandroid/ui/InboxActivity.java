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
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.ap_emailandroid.ui.email.EmailAdapter;
import com.example.ap_emailandroid.viewmodel.EmailViewModel;
import com.google.android.material.navigation.NavigationView;

import java.util.ArrayList;
import java.util.Objects;

public class InboxActivity extends AppCompatActivity {
    private EmailViewModel viewModel;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_inbox);

        setupToolbar();
        setupEmails();
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

        EmailAdapter adapter = new EmailAdapter(new ArrayList<>(), email -> {
            // TODO: HANDLE CLICK
        });
        emailList.setAdapter(adapter);

        viewModel = new ViewModelProvider(this).get(EmailViewModel.class);
        viewModel.getEmails().observe(this, adapter::setEmails);
    }

}

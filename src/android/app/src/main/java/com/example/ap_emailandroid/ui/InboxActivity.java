package com.example.ap_emailandroid.ui;

import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import com.example.ap_emailandroid.R;
import androidx.appcompat.app.ActionBarDrawerToggle;
import androidx.appcompat.widget.Toolbar;
import androidx.drawerlayout.widget.DrawerLayout;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.ap_emailandroid.local.Label;
import com.example.ap_emailandroid.ui.adapters.EmailAdapter;
import com.example.ap_emailandroid.viewmodel.EmailViewModel;
import com.example.ap_emailandroid.viewmodel.LabelViewModel;
import com.google.android.material.navigation.NavigationView;

import java.util.ArrayList;
import java.util.Objects;

public class InboxActivity extends AppCompatActivity {
    String user_id = "1"; // TODO: DELETE

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

        LabelViewModel labelViewModel = new ViewModelProvider(this).get(LabelViewModel.class);
        NavigationView nav_view = findViewById(R.id.nav_view);
        Menu menu = nav_view.getMenu();

        labelViewModel.getLabels().observe(this, labels -> {
            int groupId = Menu.FIRST;
            menu.removeGroup(groupId);
            for (Label label : labels) {
                MenuItem item = menu.add(groupId, View.generateViewId(), Menu.NONE, label.name);
                item.setIcon(R.drawable.label_ic);
            }
        });

        View headerView = nav_view.getHeaderView(0);
        Button label_btn = headerView.findViewById(R.id.add_label_btn);
        label_btn.setOnClickListener(view -> {
            AlertDialog.Builder builder = new AlertDialog.Builder(this);
            builder.setTitle("Create Label");
            final EditText input = new EditText(this);
            input.setHint("Enter label name");
            builder.setView(input);

            builder.setPositiveButton("Add", (dialog, which) -> {
                String labelName = input.getText().toString().trim();
                if (!labelName.isEmpty()) {
                    labelViewModel.add(new Label(user_id, labelName));
                } else {
                    Toast.makeText(this, "Label must include a name", Toast.LENGTH_SHORT).show();
                }
            });

            builder.setNegativeButton("Cancel", (dialog, which) -> dialog.cancel());
            builder.show();
        });

        // Define event listener for label click
        nav_view.setNavigationItemSelectedListener(item -> {
            String labelName = item.getTitle().toString();
            // TODO: ADD ONCLICK LABEL EVENT
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
            // TODO: ADD ONCLICK EVENT
        });

        emailList.setAdapter(adapter);
        EmailViewModel viewModel = new ViewModelProvider(this).get(EmailViewModel.class);
        viewModel.getEmails().observe(this, adapter::setEmails);
    }

}

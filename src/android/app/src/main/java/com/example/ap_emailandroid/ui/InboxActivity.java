package com.example.ap_emailandroid.ui;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.os.Bundle;
import android.view.Gravity;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.PopupMenu;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatDelegate;
import androidx.appcompat.widget.SearchView;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

import com.example.ap_emailandroid.AppSession;
import com.example.ap_emailandroid.R;
import androidx.appcompat.app.ActionBarDrawerToggle;
import androidx.appcompat.widget.Toolbar;
import androidx.drawerlayout.widget.DrawerLayout;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.ap_emailandroid.local.Label;
import com.example.ap_emailandroid.ui.adapters.EmailAdapter;
import com.example.ap_emailandroid.ui.signin.SignInActivity;
import com.example.ap_emailandroid.viewmodel.EmailViewModel;
import com.example.ap_emailandroid.viewmodel.LabelViewModel;
import com.google.android.material.navigation.NavigationView;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.atomic.AtomicBoolean;

import com.example.ap_emailandroid.repository.UserRepository;
import com.example.ap_emailandroid.local.User;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import com.squareup.picasso.Picasso;

public class InboxActivity extends AppCompatActivity {
    static final List<String> defLabels = List.of("Inbox", "Starred", "Sent", "Draft", "Spam", "Trash");
    private EmailAdapter adapter;
    private EmailViewModel emailViewModel;
    private String currLabel = "inbox";
    private Map<String, String> userLabelMap;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_inbox);

        userLabelMap = new HashMap<>();
        userLabelMap.put("Inbox", "inbox");
        userLabelMap.put("Starred", "starred");
        userLabelMap.put("Sent", "sent");
        userLabelMap.put("Draft", "draft");
        userLabelMap.put("Spam", "spam");
        userLabelMap.put("Trash", "trash");

        AppSession.userId = "1"; // TODO: INTEGRATE WITH GABI

        // Handle user authentication data passed from SignInActivity
        handleUserAuthentication();
        
        setupToolbar();
        setupEmails();
        setupHeader();
        setupUserProfileMenu();
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
            AppSession.userToken = userToken;
            AppSession.userEmail = userEmail;

            // fetch current user details
            UserRepository userRepo = new UserRepository();
            userRepo.getCurrentUser(AppSession.userToken, new Callback<User>() {
                @Override
                public void onResponse(Call<User> call, Response<User> response) {
                    if (response.isSuccessful() && response.body() != null) {
                        AppSession.userFullName = response.body().getFullName();
                        AppSession.userPicture = response.body().getPicture();
                        // Update header UI with real user info and picture
                        runOnUiThread(() -> {
                            NavigationView navView = findViewById(R.id.nav_view);
                            View header = navView.getHeaderView(0);
                            TextView userEmailText = header.findViewById(R.id.user_email);
                            TextView userFullNameText = header.findViewById(R.id.user_full_name);
                            ImageButton pfpButton = header.findViewById(R.id.pfp);
                            userEmailText.setText(AppSession.userEmail);
                            userFullNameText.setText(AppSession.userFullName);
                            Picasso.get()
                                   .load(AppSession.userPicture)
                                   .placeholder(R.drawable.placeholder_pfp)
                                   .into(pfpButton);
                        });
                    }
                }

                @Override
                public void onFailure(Call<User> call, Throwable t) {
                    // handle failure silently
                }
            });
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

        LabelViewModel labelViewModel = new ViewModelProvider(this).get(LabelViewModel.class);
        NavigationView nav_view = findViewById(R.id.nav_view);
        Menu menu = nav_view.getMenu();
        labelViewModel.getLabels().observe(this, labels -> {
            int groupId = Menu.FIRST;
            menu.removeGroup(groupId);
            for (Label label : labels) {
                MenuItem item = menu.add(groupId, View.generateViewId(), Menu.NONE, label.name);
                item.setIcon(R.drawable.label_ic);
                userLabelMap.put(label.getName(), label.getId());

                @SuppressLint("InflateParams") View actionView = getLayoutInflater()
                        .inflate(R.layout.menu_label_item, null);
                ImageButton delete_btn = actionView.findViewById(R.id.delete_button);
                delete_btn.setOnClickListener(v -> {
                    new AlertDialog.Builder(this)
                            .setTitle("Delete Label")
                            .setMessage("Are you sure you want to delete '" + label.name + "'?")
                            .setPositiveButton("Yes", (dialog, which) -> {
                                labelViewModel.delete(label);
                                userLabelMap.remove(label.getName());
                            })
                            .setNegativeButton("Cancel", null)
                            .show();
                });

                item.setActionView(actionView);
            }
        });

        // Add label button.
        View headerView = nav_view.getHeaderView(0);
        Button label_btn = headerView.findViewById(R.id.add_label_btn);
        label_btn.setOnClickListener(view -> {
            View dialogView = getLayoutInflater().inflate(R.layout.dialog_create_label, null);
            EditText input = dialogView.findViewById(R.id.label_input);

            AlertDialog.Builder builder = new AlertDialog.Builder(this);
            builder.setTitle("Create Label");
            builder.setView(dialogView);

            builder.setPositiveButton("Add", (dialog, which) -> {
                String labelName = input.getText().toString().trim();
                AtomicBoolean exists = new AtomicBoolean(false);
                labelViewModel.getLabels().observe(this, labels -> {
                    for (Label label : labels) {
                        if (label.getName().equals(labelName)) {
                            exists.set(true);
                            break;
                        }
                    }
                });

                if (defLabels.contains(labelName)) {
                    exists.set(true);
                }

                if (!exists.get()) {
                    if (!labelName.isEmpty()) {
                        labelViewModel.add(new Label(AppSession.userId, labelName));
                    } else
                        Toast.makeText(this, "Label must include a name", Toast.LENGTH_SHORT).show();
                } else
                    Toast.makeText(this, "Label already exists", Toast.LENGTH_SHORT).show();
            });

            builder.setNegativeButton("Cancel", (dialog, which) -> dialog.cancel());
            builder.show();
        });

        // Define event listener for label click
        nav_view.setNavigationItemSelectedListener(item -> {
            String labelName = Objects.requireNonNull(item.getTitle()).toString();
            emailViewModel.searchEmailsInLabel(userLabelMap.get(labelName), "").observe(this, emails -> {
                adapter.setEmails(emails);
                currLabel = userLabelMap.get(labelName);
            });
            drawerLayout.closeDrawers();
            return true;
        });
    }


    /**
     * Loads up the relevant emails to the view.
     */
    public void setupEmails() {
        RecyclerView emailList = findViewById(R.id.email_list);
        emailList.setLayoutManager(new LinearLayoutManager(this));

        adapter = new EmailAdapter(new ArrayList<>(), email -> {
            Intent intent = new Intent(this, EmailActivity.class);
            intent.putExtra("email", email);
            startActivity(intent);
        });

        emailList.setAdapter(adapter);
        emailViewModel = new ViewModelProvider(this).get(EmailViewModel.class);
        emailViewModel.searchEmailsInLabel(currLabel, "").observe(this, adapter::setEmails);
    }

    /**
     * Changes the SearchView so that it filters emails according to query.
     */
    public void setupHeader() {
        SearchView searchView = findViewById(R.id.drawer_search);
        searchView.setOnQueryTextListener(new SearchView.OnQueryTextListener() {
            @Override
            public boolean onQueryTextSubmit(String query) {
                emailViewModel.searchEmailsInLabel(currLabel, query).observe(InboxActivity.this, adapter::setEmails);
                return true;
            }

            @Override
            public boolean onQueryTextChange(String newQuery) {
                emailViewModel.searchEmailsInLabel(currLabel, newQuery).observe(InboxActivity.this, adapter::setEmails);
                return true;
            }
        });

        ImageButton mode_btn = findViewById(R.id.mode_btn);
        mode_btn.setOnClickListener(view -> {
            if (AppCompatDelegate.getDefaultNightMode() == AppCompatDelegate.MODE_NIGHT_YES) {
                AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_NO);
            } else {
                AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_YES);
            }
        });
    }

    /**
     * Setup user profile menu in the navigation drawer
     */
    private void setupUserProfileMenu() {
        NavigationView nav_view = findViewById(R.id.nav_view);
        View headerView = nav_view.getHeaderView(0);
        ImageButton pfpButton = headerView.findViewById(R.id.pfp);
        TextView userEmailText = headerView.findViewById(R.id.user_email);
        TextView userFullNameText = headerView.findViewById(R.id.user_full_name);
        // Load user picture and details
        userEmailText.setText(AppSession.userEmail);
        userFullNameText.setText(AppSession.userFullName);
        if (AppSession.userPicture != null) {
            Picasso.get()
                   .load(AppSession.userPicture)
                   .placeholder(R.drawable.placeholder_pfp)
                   .into(pfpButton);
        }
        pfpButton.setOnClickListener(v -> {
            PopupMenu popup = new PopupMenu(this, pfpButton, Gravity.END);
            popup.getMenuInflater().inflate(R.menu.pfp_menu, popup.getMenu());
            MenuItem emailItem = popup.getMenu().findItem(R.id.menu_email);
            emailItem.setTitle(AppSession.userEmail);
            emailItem.setEnabled(false);
            MenuItem nameItem = popup.getMenu().findItem(R.id.menu_name);
            nameItem.setTitle(AppSession.userFullName);
            nameItem.setEnabled(false);
            popup.setOnMenuItemClickListener(item -> {
                if (item.getItemId() == R.id.menu_sign_out) {
                    Intent intent = new Intent(this, SignInActivity.class);
                    startActivity(intent);
                    finish();
                    return true;
                }
                return false;
            });
            popup.show();
        });
    }
}

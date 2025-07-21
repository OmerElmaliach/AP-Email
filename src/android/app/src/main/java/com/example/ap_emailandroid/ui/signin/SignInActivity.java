package com.example.ap_emailandroid.ui.signin;

import android.content.Intent;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.util.Patterns;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;
import com.example.ap_emailandroid.R;
import com.example.ap_emailandroid.ui.InboxActivity;
import com.example.ap_emailandroid.ui.signup.SignUpActivity;
import com.example.ap_emailandroid.model.SignInResponse;
import com.example.ap_emailandroid.repository.UserRepository;
import com.google.android.material.textfield.TextInputEditText;
import com.google.android.material.textfield.TextInputLayout;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

/**
 * Sign-in activity that provides user authentication interface.
 * Handles email/password validation, navigation to sign-up, and inbox navigation.
 */
public class SignInActivity extends AppCompatActivity {
    
    private TextInputEditText emailInput;
    private TextInputEditText passwordInput;
    private TextInputLayout emailInputLayout;
    private TextInputLayout passwordInputLayout;
    private Button signInButton;
    private Button createAccountButton;
    private TextView errorMessage;
    private UserRepository userRepository;
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_signin);
        
        userRepository = new UserRepository();
        
        initializeViews();
        setupValidation();
        setupClickListeners();
    }
    
    /**
     * Initialize all view components
     */
    private void initializeViews() {
        emailInput = findViewById(R.id.email_input);
        passwordInput = findViewById(R.id.password_input);
        emailInputLayout = findViewById(R.id.email_input_layout);
        passwordInputLayout = findViewById(R.id.password_input_layout);
        signInButton = findViewById(R.id.signin_button);
        createAccountButton = findViewById(R.id.create_account_button);
        errorMessage = findViewById(R.id.error_message);
    }
    
    /**
     * Setup real-time validation for email and password fields
     */
    private void setupValidation() {
        TextWatcher validationWatcher = new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {}
            
            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                validateInputs();
                clearError();
            }
            
            @Override
            public void afterTextChanged(Editable s) {}
        };
        
        emailInput.addTextChangedListener(validationWatcher);
        passwordInput.addTextChangedListener(validationWatcher);
        
        // Auto-append @AP-Email domain when user loses focus on email field
        emailInput.setOnFocusChangeListener((v, hasFocus) -> {
            if (!hasFocus) {
                autoCompleteEmailDomain();
            }
        });
    }
    
    /**
     * Setup click listeners for buttons
     */
    private void setupClickListeners() {
        signInButton.setOnClickListener(v -> handleSignIn());
        createAccountButton.setOnClickListener(v -> navigateToSignUp());
    }
    
    /**
     * Validate email and password inputs and enable/disable sign-in button
     */
    private void validateInputs() {
        String email = emailInput.getText().toString().trim();
        String password = passwordInput.getText().toString().trim();
        
        boolean isEmailValid = isValidEmail(email);
        boolean isPasswordValid = !password.isEmpty();
        
        signInButton.setEnabled(isEmailValid && isPasswordValid);
    }
    
    /**
     * Check if email is valid
     */
    private boolean isValidEmail(String email) {
        return !email.isEmpty() && Patterns.EMAIL_ADDRESS.matcher(email).matches();
    }
    
    /**
     * Auto-complete email domain if user enters just username
     */
    private void autoCompleteEmailDomain() {
        String email = emailInput.getText().toString().trim();
        if (!email.isEmpty() && !email.contains("@")) {
            emailInput.setText(email + "@AP-Email");
        } else if (email.contains("@") && !email.endsWith("@AP-Email")) {
            // Replace domain with AP-Email if different domain was entered
            String[] parts = email.split("@");
            if (parts.length > 0) {
                emailInput.setText(parts[0] + "@AP-Email");
            }
        }
    }
    
    /**
     * Handle sign-in button click
     */
    private void handleSignIn() {
        String email = emailInput.getText().toString().trim();
        String password = passwordInput.getText().toString().trim();
        
        if (!validateCredentials(email, password)) {
            return;
        }
        
        // Show loading state
        signInButton.setEnabled(false);
        signInButton.setText("Signing in...");
        
        // Make API call for authentication
        userRepository.signInUser(email, password, new Callback<SignInResponse>() {
            @Override
            public void onResponse(Call<SignInResponse> call, Response<SignInResponse> response) {
                // Reset button state
                signInButton.setEnabled(true);
                signInButton.setText("Sign In");
                
                if (response.isSuccessful() && response.body() != null) {
                    String token = response.body().getToken();
                    navigateToInbox(token, email);
                } else {
                    String error = "Invalid email or password";
                    if (response.code() == 404) {
                        error = "User not found or incorrect credentials";
                    } else if (response.code() >= 500) {
                        error = "Server error. Please try again later.";
                    }
                    showError(error);
                }
            }
            
            @Override
            public void onFailure(Call<SignInResponse> call, Throwable t) {
                // Reset button state
                signInButton.setEnabled(true);
                signInButton.setText("Sign In");
                showError("Network error. Please check your connection and try again.");
            }
        });
    }
    
    /**
     * Validate credentials before attempting sign-in
     */
    private boolean validateCredentials(String email, String password) {
        clearError();
        
        if (email.isEmpty()) {
            emailInputLayout.setError(getString(R.string.invalid_email));
            return false;
        }
        
        if (!isValidEmail(email)) {
            emailInputLayout.setError(getString(R.string.invalid_email));
            return false;
        }
        
        if (password.isEmpty()) {
            passwordInputLayout.setError(getString(R.string.invalid_password));
            return false;
        }
        
        return true;
    }
    
    /**
     * Navigate to inbox activity with user token
     */
    private void navigateToInbox(String userToken, String userEmail) {
        Intent intent = new Intent(this, InboxActivity.class);
        intent.putExtra("user_token", userToken);
        intent.putExtra("user_email", userEmail);
        startActivity(intent);
        finish(); // Close sign-in activity
    }
    
    /**
     * Navigate to sign-up activity
     */
    private void navigateToSignUp() {
        Intent intent = new Intent(this, SignUpActivity.class);
        startActivity(intent);
    }
    
    /**
     * Show error message
     */
    private void showError(String message) {
        errorMessage.setText(message);
        errorMessage.setVisibility(View.VISIBLE);
    }
    
    /**
     * Clear error message and field errors
     */
    private void clearError() {
        errorMessage.setVisibility(View.GONE);
        emailInputLayout.setError(null);
        passwordInputLayout.setError(null);
    }
}

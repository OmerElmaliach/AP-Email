package com.example.ap_emailandroid.ui.signup;

import android.os.Bundle;
import android.text.Editable;
import android.text.TextUtils;
import android.text.TextWatcher;
import android.util.Patterns;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import com.example.ap_emailandroid.R;
import com.example.ap_emailandroid.viewmodel.SignUpViewModel;

/**
 * fourth and final step of signup process - collecting email and password
 * includes password validation similar to web implementation
 */
public class EmailPasswordStepFragment extends Fragment {
    
    private EditText etEmail;
    private EditText etPassword;
    private EditText etConfirmPassword;
    private TextView tvPasswordRequirements;
    private Button btnCreateAccount;
    private Button btnBack;
    private ProgressBar progressBar;
    private SignUpNavigationListener navigationListener;
    private SignUpViewModel viewModel;
    
    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        navigationListener = (SignUpNavigationListener) getActivity();
        viewModel = ((SignUpActivity) getActivity()).getSignUpViewModel();
    }
    
    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_email_password_step, container, false);
        
        etEmail = view.findViewById(R.id.et_email);
        etPassword = view.findViewById(R.id.et_password);
        etConfirmPassword = view.findViewById(R.id.et_confirm_password);
        tvPasswordRequirements = view.findViewById(R.id.tv_password_requirements);
        btnCreateAccount = view.findViewById(R.id.btn_create_account);
        btnBack = view.findViewById(R.id.btn_back);
        progressBar = view.findViewById(R.id.progress_bar);
        
        // load existing data if available
        if (viewModel.getEmail() != null) {
            etEmail.setText(viewModel.getEmail());
        }
        if (viewModel.getPassword() != null) {
            etPassword.setText(viewModel.getPassword());
        }
        
        // setup password requirements text
        updatePasswordRequirements();
        
        // add text watchers to update button state
        TextWatcher formWatcher = new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {}
            
            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {}
            
            @Override
            public void afterTextChanged(Editable s) {
                updateCreateButtonState();
                updatePasswordRequirements();
            }
        };
        
        etEmail.addTextChangedListener(formWatcher);
        etPassword.addTextChangedListener(formWatcher);
        etConfirmPassword.addTextChangedListener(formWatcher);
        
        btnCreateAccount.setOnClickListener(v -> {
            if (validateAndCreateAccount()) {
                progressBar.setVisibility(View.VISIBLE);
                btnCreateAccount.setEnabled(false);
                
                // save data to viewmodel
                viewModel.setEmail(etEmail.getText().toString().trim());
                viewModel.setPassword(etPassword.getText().toString());
                
                // simulate account creation (replace with actual implementation)
                createAccount();
            }
        });
        
        btnBack.setOnClickListener(v -> navigationListener.onPreviousStep());
        
        // initial button state
        updateCreateButtonState();
        
        return view;
    }
    
    private void updateCreateButtonState() {
        String email = etEmail.getText().toString().trim();
        String password = etPassword.getText().toString();
        String confirmPassword = etConfirmPassword.getText().toString();
        
        boolean isFormValid = !TextUtils.isEmpty(email) && 
                             !TextUtils.isEmpty(password) && 
                             !TextUtils.isEmpty(confirmPassword) &&
                             password.equals(confirmPassword) &&
                             isValidPassword(password);
        
        if (isFormValid) {
            btnCreateAccount.setAlpha(1.0f);
            btnCreateAccount.setEnabled(true);
        } else {
            btnCreateAccount.setAlpha(0.5f);
            btnCreateAccount.setEnabled(false);
        }
    }
    
    private boolean validateAndCreateAccount() {
        String email = etEmail.getText().toString().trim();
        String password = etPassword.getText().toString();
        String confirmPassword = etConfirmPassword.getText().toString();
        
        // validate email
        if (TextUtils.isEmpty(email)) {
            etEmail.setError("email is required");
            etEmail.requestFocus();
            return false;
        }
        
        if (!Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
            etEmail.setError("please enter a valid email address");
            etEmail.requestFocus();
            return false;
        }
        
        // validate password (same rules as web implementation)
        String passwordError = validatePassword(password);
        if (passwordError != null) {
            etPassword.setError(passwordError);
            etPassword.requestFocus();
            return false;
        }
        
        // validate password confirmation
        if (!password.equals(confirmPassword)) {
            etConfirmPassword.setError("passwords don't match");
            etConfirmPassword.requestFocus();
            return false;
        }
        
        return true;
    }
    
    /**
     * validates password according to the same rules as web implementation
     * must be 8 chars and include number and letters, with at least one capital
     * only allow letters and digits
     */
    private String validatePassword(String password) {
        if (password.length() < 8) {
            return "password must be at least 8 characters long";
        }
        
        if (!password.matches(".*[A-Z].*")) {
            return "password must contain at least one uppercase letter";
        }
        
        if (!password.matches(".*[a-z].*")) {
            return "password must contain at least one lowercase letter";
        }
        
        if (!password.matches(".*\\d.*")) {
            return "password must contain at least one number";
        }
        
        // only allow letters and digits
        if (!password.matches("^[a-zA-Z\\d]+$")) {
            return "password can only contain letters and numbers";
        }
        
        return null; // is valid
    }
    
    private void updatePasswordRequirements() {
        // similar logic to validatePassword, but updates the UI with which requirements are not met
        String password = etPassword.getText().toString();
        
        StringBuilder requirements = new StringBuilder("password must be at least 8 characters long and contain:");
        boolean isValid = true;
        
        if (password.length() < 8) {
            requirements.append("\n• at least 8 characters");
            isValid = false;
        } else {
            requirements.append("\n• ✓ at least 8 characters");
        }
        
        if (!password.matches(".*[A-Z].*")) {
            requirements.append("\n• at least one uppercase letter");
            isValid = false;
        } else {
            requirements.append("\n• ✓ at least one uppercase letter");
        }
        
        if (!password.matches(".*[a-z].*")) {
            requirements.append("\n• at least one lowercase letter");
            isValid = false;
        } else {
            requirements.append("\n• ✓ at least one lowercase letter");
        }
        
        if (!password.matches(".*\\d.*")) {
            requirements.append("\n• at least one number");
            isValid = false;
        } else {
            requirements.append("\n• ✓ at least one number");
        }
        
        // only allow letters and digits
        if (!password.matches("^[a-zA-Z\\d]+$")) {
            requirements.append("\n• only letters and numbers (no special characters)");
            isValid = false;
        } else {
            requirements.append("\n• ✓ only letters and numbers (no special characters)");
        }
        
        tvPasswordRequirements.setText(requirements.toString());
        
        // also update button state based on password validity
        updateCreateButtonState();
    }
    
    private void createAccount() {
        // TODO: implement account creation logic
        // this is just a simulation
        new android.os.Handler().postDelayed(() -> {
            progressBar.setVisibility(View.GONE);
            btnCreateAccount.setEnabled(true);
            navigationListener.onSignUpComplete();
        }, 2000);
    }
}

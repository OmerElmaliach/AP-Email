package com.example.ap_emailandroid.ui.signup;

import android.os.Bundle;
import android.text.TextUtils;
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
import androidx.lifecycle.LifecycleOwner;
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
        
        // show password requirements
        tvPasswordRequirements.setText("password must be at least 8 characters long and contain:\n• at least one uppercase letter\n• at least one lowercase letter\n• at least one number\n• only letters and numbers (no special characters)");
        
        // Auto-append domain on focus loss
        etEmail.setOnFocusChangeListener((v, hasFocus) -> {
            if (!hasFocus) {
                String emailText = etEmail.getText().toString().trim();
                if (!emailText.contains("@")) {
                    etEmail.setText(emailText + "@AP-Email.com");
                }
            }
        });

        btnCreateAccount.setOnClickListener(v -> {
            android.util.Log.e("EmailPasswordStep", "CREATE ACCOUNT BUTTON CLICKED!");
            if (validateInput()) {
                android.util.Log.e("EmailPasswordStep", "VALIDATION PASSED - CALLING onSignUpComplete");
                // show loading
                progressBar.setVisibility(View.VISIBLE);
                btnCreateAccount.setEnabled(false);
                
                navigationListener.onSignUpComplete();
            } else {
                android.util.Log.e("EmailPasswordStep", "VALIDATION FAILED");
            }
        });
        
        btnBack.setOnClickListener(v -> navigationListener.onPreviousStep());
        
        // observe signup process
        viewModel.getIsLoading().observe((LifecycleOwner) this, isLoading -> {
            progressBar.setVisibility(isLoading ? View.VISIBLE : View.GONE);
            btnCreateAccount.setEnabled(!isLoading);
        });
        
        return view;
    }
    
    private boolean validateInput() {
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
        
        // Save data to viewmodel and proceed
        viewModel.setEmail(email);
        viewModel.setPassword(password);
        
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
}

package com.example.ap_emailandroid.ui.signup;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;
import com.example.ap_emailandroid.R;
import com.example.ap_emailandroid.ui.InboxActivity;
import com.example.ap_emailandroid.ui.signin.SignInActivity;
import com.example.ap_emailandroid.viewmodel.SignUpViewModel;

/**
 * main signup activity that manages the multi-step signup process
 * coordinates between different signup fragments (name, picture, birthday, email/password)
 */
public class SignUpActivity extends AppCompatActivity implements SignUpNavigationListener {
    
    private static final String TAG = "SignUpActivity";
    private SignUpViewModel signUpViewModel;
    private int currentStep = 1;
    private static final int TOTAL_STEPS = 4;
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_signup);
        Log.d(TAG, "SignUpActivity created");

        // initialize viewmodel
        signUpViewModel = new ViewModelProvider(this).get(SignUpViewModel.class);
        
        // observe signup completion
        signUpViewModel.getSignUpSuccess().observe(this, success -> {
            Log.d(TAG, "SignUpSuccess observed: " + success);
            if (success) {
                // navigate to inbox after successful signup
                String token = signUpViewModel.getAuthToken().getValue();
                Log.d(TAG, "Navigating to InboxActivity with token: " + (token != null ? "present" : "null"));
                Intent intent = new Intent(this, InboxActivity.class);
                intent.putExtra("user_token", token);
                intent.putExtra("user_email", signUpViewModel.getEmail());
                startActivity(intent);
                finish();
            }
        });
        
        // observe error messages
        signUpViewModel.getErrorMessage().observe(this, error -> {
            Log.d(TAG, "Error message observed: " + error);
            if (error != null && !error.isEmpty()) {
                // show error message to user
                // todo: implement proper error display
            }
        });
        
        // start with name step
        showNameStep();
    }
    
    @Override
    public void onNextStep() {
        currentStep++;
        switch (currentStep) {
            case 2:
                showPictureStep();
                break;
            case 3:
                showBirthdayStep();
                break;
            case 4:
                showEmailPasswordStep();
                break;
            default:
                // should not happen
                break;
        }
    }
    
    @Override
    public void onPreviousStep() {
        if (currentStep > 1) {
            currentStep--;
            switch (currentStep) {
                case 1:
                    showNameStep();
                    break;
                case 2:
                    showPictureStep();
                    break;
                case 3:
                    showBirthdayStep();
                    break;
                default:
                    // should not happen
                    break;
            }
        }
    }
    
    @Override
    public void onSignUpComplete() {
        android.util.Log.e("SignUpActivity", "onSignUpComplete() called - submitting signup");
        signUpViewModel.submitSignUp();
    }
    
    @Override
    public void onGoToSignIn() {
        Intent intent = new Intent(this, SignInActivity.class);
        startActivity(intent);
        finish();
    }
    
    private void showNameStep() {
        replaceFragment(new NameStepFragment());
    }
    
    private void showPictureStep() {
        replaceFragment(new PictureStepFragment());
    }
    
    private void showBirthdayStep() {
        replaceFragment(new BirthdayStepFragment());
    }
    
    private void showEmailPasswordStep() {
        replaceFragment(new EmailPasswordStepFragment());
    }
    
    private void replaceFragment(Fragment fragment) {
        getSupportFragmentManager()
                .beginTransaction()
                .replace(R.id.fragment_container, fragment)
                .commitAllowingStateLoss();
    }
    
    public SignUpViewModel getSignUpViewModel() {
        return signUpViewModel;
    }
}

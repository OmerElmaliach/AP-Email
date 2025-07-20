package com.example.ap_emailandroid.ui.signup;

import android.os.Bundle;
import android.text.TextUtils;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import com.example.ap_emailandroid.R;
import com.example.ap_emailandroid.viewmodel.SignUpViewModel;

/**
 * first step of signup process - collecting user's first and last name
 */
public class NameStepFragment extends Fragment {
    
    private EditText etFirstName;
    private EditText etLastName;
    private Button btnNext;
    private Button btnGoToSignIn;
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
        View view = inflater.inflate(R.layout.fragment_name_step, container, false);
        
        etFirstName = view.findViewById(R.id.et_first_name);
        etLastName = view.findViewById(R.id.et_last_name);
        btnNext = view.findViewById(R.id.btn_next);
        btnGoToSignIn = view.findViewById(R.id.btn_go_to_signin);
        
        // load existing data if available
        if (viewModel.getFirstName() != null) {
            etFirstName.setText(viewModel.getFirstName());
        }
        if (viewModel.getLastName() != null) {
            etLastName.setText(viewModel.getLastName());
        }
        
        btnNext.setOnClickListener(v -> {
            if (validateInput()) {
                // save data to viewmodel
                viewModel.setFirstName(etFirstName.getText().toString().trim());
                viewModel.setLastName(etLastName.getText().toString().trim());
                navigationListener.onNextStep();
            }
        });
        
        btnGoToSignIn.setOnClickListener(v -> navigationListener.onGoToSignIn());
        
        return view;
    }
    
    private boolean validateInput() {
        String firstName = etFirstName.getText().toString().trim();
        String lastName = etLastName.getText().toString().trim();
        
        if (TextUtils.isEmpty(firstName)) {
            etFirstName.setError("first name is required");
            etFirstName.requestFocus();
            return false;
        }
        
        if (TextUtils.isEmpty(lastName)) {
            etLastName.setError("last name is required");
            etLastName.requestFocus();
            return false;
        }
        
        if (firstName.length() < 2) {
            etFirstName.setError("first name must be at least 2 characters");
            etFirstName.requestFocus();
            return false;
        }
        
        if (lastName.length() < 2) {
            etLastName.setError("last name must be at least 2 characters");
            etLastName.requestFocus();
            return false;
        }
        
        return true;
    }
}

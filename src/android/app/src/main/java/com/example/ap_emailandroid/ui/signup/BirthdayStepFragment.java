package com.example.ap_emailandroid.ui.signup;

import android.app.DatePickerDialog;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.AutoCompleteTextView;
import android.widget.Button;
import android.widget.Toast;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import com.example.ap_emailandroid.R;
import com.example.ap_emailandroid.viewmodel.SignUpViewModel;
import com.google.android.material.textfield.TextInputEditText;
import java.util.Calendar;

/**
 * third step of signup process - collecting birthday and gender information
 */
public class BirthdayStepFragment extends Fragment {
    
    private TextInputEditText etBirthdayDisplay;
    private Button btnSelectDate;
    private AutoCompleteTextView spinnerGender;
    private Button btnNext;
    private Button btnBack;
    private SignUpNavigationListener navigationListener;
    private SignUpViewModel viewModel;
    private String selectedDate;
    private String selectedGender;
    
    // gender options matching web implementation
    private static final String[] GENDER_OPTIONS = {"male", "female", "prefer not to say"};
    
    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        navigationListener = (SignUpNavigationListener) getActivity();
        viewModel = ((SignUpActivity) getActivity()).getSignUpViewModel();
    }
    
    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_birthday_step, container, false);
        
        etBirthdayDisplay = view.findViewById(R.id.et_birthday_display);
        btnSelectDate = view.findViewById(R.id.btn_select_date);
        spinnerGender = view.findViewById(R.id.spinner_gender);
        btnNext = view.findViewById(R.id.btn_next);
        btnBack = view.findViewById(R.id.btn_back);
        
        // setup gender dropdown
        ArrayAdapter<String> adapter = new ArrayAdapter<>(getContext(), android.R.layout.simple_dropdown_item_1line, GENDER_OPTIONS);
        spinnerGender.setAdapter(adapter);
        
        // load existing data if available
        if (viewModel.getBirthday() != null) {
            selectedDate = viewModel.getBirthday();
            etBirthdayDisplay.setText(selectedDate);
        }
        if (viewModel.getGender() != null) {
            selectedGender = viewModel.getGender();
            spinnerGender.setText(selectedGender, false);
        }
        
        spinnerGender.setOnItemClickListener((parent, view1, position, id) -> {
            selectedGender = GENDER_OPTIONS[position];
        });
        
        // handle clicks on the birthday field
        etBirthdayDisplay.setOnClickListener(v -> showDatePicker());
        btnSelectDate.setOnClickListener(v -> showDatePicker());
        
        btnNext.setOnClickListener(v -> {
            if (validateInput()) {
                // save data to viewmodel
                viewModel.setBirthday(selectedDate);
                viewModel.setGender(selectedGender);
                navigationListener.onNextStep();
            }
        });
        
        btnBack.setOnClickListener(v -> navigationListener.onPreviousStep());
        
        return view;
    }
    
    private void showDatePicker() {
        Calendar calendar = Calendar.getInstance();
        int year = calendar.get(Calendar.YEAR) - 18; // default to 18 years ago
        int month = calendar.get(Calendar.MONTH);
        int day = calendar.get(Calendar.DAY_OF_MONTH);
        
        DatePickerDialog datePickerDialog = new DatePickerDialog(
                getContext(),
                (view, selectedYear, selectedMonth, selectedDay) -> {
                    // format: yyyy-mm-dd (to match web implementation)
                    selectedDate = String.format("%04d-%02d-%02d", selectedYear, selectedMonth + 1, selectedDay);
                    etBirthdayDisplay.setText(selectedDate);
                },
                year, month, day
        );
        
        // set max date to today (cannot be born in the future)
        datePickerDialog.getDatePicker().setMaxDate(System.currentTimeMillis());
        
        // set min date to 100 years ago (reasonable limit)
        Calendar minDate = Calendar.getInstance();
        minDate.add(Calendar.YEAR, -100);
        datePickerDialog.getDatePicker().setMinDate(minDate.getTimeInMillis());
        
        datePickerDialog.show();
    }
    
    private boolean validateInput() {
        if (selectedDate == null || selectedDate.isEmpty()) {
            Toast.makeText(getContext(), "please select your birthday", Toast.LENGTH_SHORT).show();
            return false;
        }
        
        if (selectedGender == null || selectedGender.isEmpty()) {
            Toast.makeText(getContext(), "please select your gender", Toast.LENGTH_SHORT).show();
            return false;
        }
        
        // validate age (must be at least 13 years old) - same logic as web
        try {
            String[] dateParts = selectedDate.split("-");
            int birthYear = Integer.parseInt(dateParts[0]);
            int birthMonth = Integer.parseInt(dateParts[1]);
            int birthDay = Integer.parseInt(dateParts[2]);
            
            Calendar birthDate = Calendar.getInstance();
            birthDate.set(birthYear, birthMonth - 1, birthDay);
            
            Calendar today = Calendar.getInstance();
            int age = today.get(Calendar.YEAR) - birthDate.get(Calendar.YEAR);
            int m = today.get(Calendar.MONTH) - birthDate.get(Calendar.MONTH);
            
            boolean isUnder13 = m < 0 || (m == 0 && today.get(Calendar.DAY_OF_MONTH) < birthDate.get(Calendar.DAY_OF_MONTH))
                    ? age - 1 < 13
                    : age < 13;
            
            if (isUnder13) {
                Toast.makeText(getContext(), "you must be at least 13 years old to create an account", Toast.LENGTH_LONG).show();
                return false;
            }
            
            if (age > 130) {
                Toast.makeText(getContext(), "please enter a valid age under 130", Toast.LENGTH_SHORT).show();
                return false;
            }
        } catch (Exception e) {
            Toast.makeText(getContext(), "invalid date format", Toast.LENGTH_SHORT).show();
            return false;
        }
        
        return true;
    }
}

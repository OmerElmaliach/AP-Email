package com.example.ap_emailandroid.ui.signup;

import android.app.DatePickerDialog;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.MotionEvent;
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
    
    private TextInputEditText tvSelectedDate;
    private AutoCompleteTextView etGender;
    private Button btnNext;
    private Button btnBack;
    private SignUpNavigationListener navigationListener;
    private SignUpViewModel viewModel;
    private String selectedDate;
    
    private final String[] genderOptions = {"Male", "Female", "Prefer not to say"};

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
        
        tvSelectedDate = view.findViewById(R.id.tv_selected_date);
        etGender = view.findViewById(R.id.et_gender);
        btnNext = view.findViewById(R.id.btn_next);
        btnBack = view.findViewById(R.id.btn_back);
        
        // set up gender dropdown
        ArrayAdapter<String> genderAdapter = new ArrayAdapter<>(getContext(), android.R.layout.simple_dropdown_item_1line, genderOptions);
        etGender.setAdapter(genderAdapter);

        // load existing data if available
        if (viewModel.getBirthday() != null) {
            selectedDate = viewModel.getBirthday();
            tvSelectedDate.setText(selectedDate);
        }
        if (viewModel.getGender() != null) {
            String genderText = "";
            if (viewModel.getGender().equals("M")) {
                genderText = "Male";
            } else if (viewModel.getGender().equals("F")) {
                genderText = "Female";
            } else if (viewModel.getGender().equals("P")) {
                genderText = "Prefer not to say";
            }
            etGender.setText(genderText);
        }
        
        // make date field clickable to show date picker
        tvSelectedDate.setOnClickListener(v -> showDatePicker());

        // Ensure dropdown appears when the field is clicked
        etGender.setOnClickListener(v -> etGender.showDropDown());
        etGender.setOnTouchListener((v, event) -> {
            if (event.getAction() == MotionEvent.ACTION_DOWN) {
                etGender.showDropDown();
            }
            return false;
        });

        btnNext.setOnClickListener(v -> {
            if (validateInput()) {
                // save data to viewmodel
                viewModel.setBirthday(selectedDate);
                
                // save gender
                String selectedGender = etGender.getText().toString();
                if (selectedGender.equals("Male")) {
                    viewModel.setGender("M");
                } else if (selectedGender.equals("Female")) {
                    viewModel.setGender("F");
                } else if (selectedGender.equals("Prefer not to say")) {
                    viewModel.setGender("P");
                }
                
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
                    // format: dd/mm/yyyy (to match the hint)
                    selectedDate = String.format("%02d/%02d/%04d", selectedDay, selectedMonth + 1, selectedYear);
                    tvSelectedDate.setText(selectedDate);
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
        
        if (etGender.getText().toString().isEmpty()) {
            Toast.makeText(getContext(), "please select your gender", Toast.LENGTH_SHORT).show();
            return false;
        }
        
        // validate age (must be at least 13 years old)
        try {
            String[] dateParts = selectedDate.split("/");
            int birthYear = Integer.parseInt(dateParts[2]);
            int currentYear = Calendar.getInstance().get(Calendar.YEAR);
            int age = currentYear - birthYear;
            
            if (age < 13) {
                Toast.makeText(getContext(), "you must be at least 13 years old to sign up", Toast.LENGTH_SHORT).show();
                return false;
            }
        } catch (Exception e) {
            Toast.makeText(getContext(), "invalid date format", Toast.LENGTH_SHORT).show();
            return false;
        }
        
        return true;
    }
}

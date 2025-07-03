package com.example.ap_emailandroid.ui.signup;

import android.app.DatePickerDialog;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.TextView;
import android.widget.Toast;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import com.example.ap_emailandroid.R;
import com.example.ap_emailandroid.viewmodel.SignUpViewModel;
import java.util.Calendar;

/**
 * third step of signup process - collecting birthday and gender information
 */
public class BirthdayStepFragment extends Fragment {
    
    private TextView tvSelectedDate;
    private Button btnSelectDate;
    private RadioGroup rgGender;
    private RadioButton rbMale;
    private RadioButton rbFemale;
    private Button btnNext;
    private Button btnBack;
    private SignUpNavigationListener navigationListener;
    private SignUpViewModel viewModel;
    private String selectedDate;
    
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
        btnSelectDate = view.findViewById(R.id.btn_select_date);
        rgGender = view.findViewById(R.id.rg_gender);
        rbMale = view.findViewById(R.id.rb_male);
        rbFemale = view.findViewById(R.id.rb_female);
        btnNext = view.findViewById(R.id.btn_next);
        btnBack = view.findViewById(R.id.btn_back);
        
        // load existing data if available
        if (viewModel.getBirthday() != null) {
            selectedDate = viewModel.getBirthday();
            tvSelectedDate.setText(selectedDate);
        }
        if (viewModel.getGender() != null) {
            if (viewModel.getGender().equals("M")) {
                rbMale.setChecked(true);
            } else if (viewModel.getGender().equals("W")) {
                rbFemale.setChecked(true);
            }
        }
        
        btnSelectDate.setOnClickListener(v -> showDatePicker());
        
        btnNext.setOnClickListener(v -> {
            if (validateInput()) {
                // save data to viewmodel
                viewModel.setBirthday(selectedDate);
                
                int selectedGenderId = rgGender.getCheckedRadioButtonId();
                if (selectedGenderId == R.id.rb_male) {
                    viewModel.setGender("M");
                } else if (selectedGenderId == R.id.rb_female) {
                    viewModel.setGender("W");
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
                    // format: yyyy-mm-dd (to match web implementation)
                    selectedDate = String.format("%04d-%02d-%02d", selectedYear, selectedMonth + 1, selectedDay);
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
        
        int selectedGenderId = rgGender.getCheckedRadioButtonId();
        if (selectedGenderId == -1) {
            Toast.makeText(getContext(), "please select your gender", Toast.LENGTH_SHORT).show();
            return false;
        }
        
        // validate age (must be at least 13 years old)
        try {
            String[] dateParts = selectedDate.split("-");
            int birthYear = Integer.parseInt(dateParts[0]);
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

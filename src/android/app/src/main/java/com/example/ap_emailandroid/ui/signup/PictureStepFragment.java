package com.example.ap_emailandroid.ui.signup;

import android.Manifest;
import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.MediaStore;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.Toast;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.Fragment;
import com.example.ap_emailandroid.R;
import com.example.ap_emailandroid.viewmodel.SignUpViewModel;

/**
 * second step of signup process - uploading profile picture
 * uses external library: none (using built-in android image picker)
 */
public class PictureStepFragment extends Fragment {
    
    private ImageView ivProfilePicture;
    private Button btnNext;
    private SignUpNavigationListener navigationListener;
    private SignUpViewModel viewModel;
    private Uri selectedImageUri;
    
    private ActivityResultLauncher<String> permissionLauncher;
    private ActivityResultLauncher<Intent> imagePickerLauncher;

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Activity activity = getActivity();
        if (activity instanceof SignUpNavigationListener) {
            navigationListener = (SignUpNavigationListener) activity;
        } else {
            throw new IllegalStateException("Activity must implement SignUpNavigationListener");
        }
        if (activity instanceof SignUpActivity) {
            viewModel = ((SignUpActivity) activity).getSignUpViewModel();
        } else {
            throw new IllegalStateException("Activity must be an instance of SignUpActivity");
        }

        // register activity result launchers
        permissionLauncher = registerForActivityResult(
                new ActivityResultContracts.RequestPermission(),
                isGranted -> {
                    if (isGranted) {
                        openImagePicker();
                    } else {
                        Toast.makeText(getContext(), "permission denied. cannot access images", Toast.LENGTH_SHORT).show();
                    }
                });

        imagePickerLauncher = registerForActivityResult(
                new ActivityResultContracts.StartActivityForResult(),
                result -> {
                    if (result.getResultCode() == Activity.RESULT_OK && result.getData() != null) {
                        selectedImageUri = result.getData().getData();
                        if (selectedImageUri != null) {
                            ivProfilePicture.setImageURI(selectedImageUri);
                            btnNext.setEnabled(true);
                            Toast.makeText(getContext(), "image selected successfully", Toast.LENGTH_SHORT).show();
                        }
                    }
                });
    }
    
    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_picture_step, container, false);
        
        ivProfilePicture = view.findViewById(R.id.iv_profile_picture);
        Button btnChooseImage = view.findViewById(R.id.btn_choose_image);
        btnNext = view.findViewById(R.id.btn_next);
        Button btnBack = view.findViewById(R.id.btn_back);

        // load existing image if available
        if (viewModel.getProfilePictureUri() != null) {
            selectedImageUri = viewModel.getProfilePictureUri();
            ivProfilePicture.setImageURI(selectedImageUri);
            btnNext.setEnabled(true);
        }
        
        btnChooseImage.setOnClickListener(v -> {
            if (checkPermission()) {
                openImagePicker();
            } else {
                requestPermission();
            }
        });
        
        btnNext.setOnClickListener(v -> {
            if (selectedImageUri != null) {
                viewModel.setProfilePictureUri(selectedImageUri);
                navigationListener.onNextStep();
            } else {
                Toast.makeText(getContext(), "please select a profile picture", Toast.LENGTH_SHORT).show();
            }
        });
        
        btnBack.setOnClickListener(v -> navigationListener.onPreviousStep());

        return view;
    }
    
    private boolean checkPermission() {
        // Ensure context is not null before checking permissions
        if (getContext() == null) {
            return false;
        }
        // For Android 13+ (API 33+), use READ_MEDIA_IMAGES
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            return ContextCompat.checkSelfPermission(getContext(), Manifest.permission.READ_MEDIA_IMAGES)
                    == PackageManager.PERMISSION_GRANTED;
        }
        // For Android 6.0+ but below 13, use READ_EXTERNAL_STORAGE
        return ContextCompat.checkSelfPermission(getContext(), Manifest.permission.READ_EXTERNAL_STORAGE)
                == PackageManager.PERMISSION_GRANTED;
    }
    
    private void requestPermission() {
        String permission = Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU
                ? Manifest.permission.READ_MEDIA_IMAGES
                : Manifest.permission.READ_EXTERNAL_STORAGE;
        permissionLauncher.launch(permission);
    }
    
    private void openImagePicker() {
        Intent intent = new Intent(Intent.ACTION_PICK);
        intent.setDataAndType(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, "image/*");
        imagePickerLauncher.launch(intent);
    }
}

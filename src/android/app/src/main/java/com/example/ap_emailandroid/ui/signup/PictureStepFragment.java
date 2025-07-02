package com.example.ap_emailandroid.ui.signup;

import android.Manifest;
import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.Toast;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.Fragment;
import com.example.ap_emailandroid.R;
import com.example.ap_emailandroid.viewmodel.SignUpViewModel;

/**
 * second step of signup process - uploading profile picture
 * uses external library: none (using built-in android image picker)
 */
public class PictureStepFragment extends Fragment {
    
    private static final int REQUEST_PICK_IMAGE = 1001;
    private static final int REQUEST_PERMISSION = 1002;
    
    private ImageView ivProfilePicture;
    private Button btnChooseImage;
    private Button btnNext;
    private Button btnBack;
    private SignUpNavigationListener navigationListener;
    private SignUpViewModel viewModel;
    private Uri selectedImageUri;
    
    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        navigationListener = (SignUpNavigationListener) getActivity();
        viewModel = ((SignUpActivity) getActivity()).getSignUpViewModel();
    }
    
    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_picture_step, container, false);
        
        ivProfilePicture = view.findViewById(R.id.iv_profile_picture);
        btnChooseImage = view.findViewById(R.id.btn_choose_image);
        btnNext = view.findViewById(R.id.btn_next);
        btnBack = view.findViewById(R.id.btn_back);
        
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
        // for android 6.0 and above, check read external storage permission
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) {
            return ContextCompat.checkSelfPermission(getContext(), Manifest.permission.READ_EXTERNAL_STORAGE) 
                    == PackageManager.PERMISSION_GRANTED;
        }
        return true;
    }
    
    private void requestPermission() {
        ActivityCompat.requestPermissions(getActivity(), 
                new String[]{Manifest.permission.READ_EXTERNAL_STORAGE}, 
                REQUEST_PERMISSION);
    }
    
    private void openImagePicker() {
        Intent intent = new Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
        intent.setType("image/*");
        startActivityForResult(intent, REQUEST_PICK_IMAGE);
    }
    
    @Override
    public void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        
        if (requestCode == REQUEST_PICK_IMAGE && resultCode == Activity.RESULT_OK && data != null) {
            selectedImageUri = data.getData();
            if (selectedImageUri != null) {
                ivProfilePicture.setImageURI(selectedImageUri);
                btnNext.setEnabled(true);
                Toast.makeText(getContext(), "image selected successfully", Toast.LENGTH_SHORT).show();
            }
        }
    }
    
    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        
        if (requestCode == REQUEST_PERMISSION) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                openImagePicker();
            } else {
                Toast.makeText(getContext(), "permission denied. cannot access images", Toast.LENGTH_SHORT).show();
            }
        }
    }
}

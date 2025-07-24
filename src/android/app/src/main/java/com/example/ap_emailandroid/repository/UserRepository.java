package com.example.ap_emailandroid.repository;

import android.content.Context;
import android.database.Cursor;
import android.net.Uri;
import android.provider.MediaStore;
import android.webkit.MimeTypeMap;
import com.example.ap_emailandroid.AppController;
import com.example.ap_emailandroid.R;
import com.example.ap_emailandroid.local.User;
import com.example.ap_emailandroid.model.SignUpRequest;
import com.example.ap_emailandroid.model.SignInRequest;
import com.example.ap_emailandroid.model.SignInResponse;
import com.example.ap_emailandroid.model.SignUpResponse;
import com.example.ap_emailandroid.network.UserAPI;

import java.io.File;
import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.OkHttpClient;
import okhttp3.RequestBody;
import okhttp3.logging.HttpLoggingInterceptor;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

/**
 * Repository for user operations
 * Handles API calls and network operations for user management
 */
public class UserRepository {
    
    private UserAPI userAPI;

    public UserRepository() {
        // Use Retrofit with base URL from string resources (matches EmailAPI)
        String baseUrl = AppController.context.getString(R.string.BaseUrl);
        android.util.Log.e("UserRepository", "Creating UserRepository with BASE_URL: " + baseUrl);

        // Logging interceptor
        HttpLoggingInterceptor logging = new HttpLoggingInterceptor();
        logging.setLevel(HttpLoggingInterceptor.Level.BODY);
        OkHttpClient client = new OkHttpClient.Builder()
                .addInterceptor(logging)
                .build();

        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl(baseUrl)
                .client(client)
                .addConverterFactory(GsonConverterFactory.create())
                .build();
        
        userAPI = retrofit.create(UserAPI.class);
        android.util.Log.e("UserRepository", "UserRepository created successfully");
    }

    /**
     * Create a new user (sign up)
     * @param user the user data to save
     * @param callback callback for handling response
     */
    public void createUser(User user, Callback<SignUpResponse> callback) {
        try {
            // Create RequestBody for each text field
            RequestBody firstName = RequestBody.create(MediaType.parse("text/plain"), user.getFirstName());
            RequestBody lastName = RequestBody.create(MediaType.parse("text/plain"), user.getLastName());
            RequestBody email = RequestBody.create(MediaType.parse("text/plain"), user.getEmail());
            RequestBody userName = RequestBody.create(MediaType.parse("text/plain"), user.getUserName());
            RequestBody password = RequestBody.create(MediaType.parse("text/plain"), user.getPassword());
            RequestBody birthday = RequestBody.create(MediaType.parse("text/plain"), user.getBirthday());
            RequestBody gender = RequestBody.create(MediaType.parse("text/plain"), user.getGender());
            RequestBody phoneNumber = RequestBody.create(MediaType.parse("text/plain"), 
                user.getPhoneNumber() != null ? user.getPhoneNumber() : "");

            // Create file part for picture
            MultipartBody.Part picturePart = null;
            if (user.getProfilePictureUri() != null) {
                File file = getFileFromUri(user.getProfilePictureUri());
                if (file != null && file.exists()) {
                    // Get the proper MIME type and file extension
                    String mimeType = getMimeType(user.getProfilePictureUri());
                    String fileName = getFileName(user.getProfilePictureUri());

                    // Ensure the file has a valid image extension
                    if (fileName != null && (fileName.toLowerCase().endsWith(".jpg") ||
                        fileName.toLowerCase().endsWith(".jpeg") ||
                        fileName.toLowerCase().endsWith(".png"))) {

                        RequestBody requestFile = RequestBody.create(MediaType.parse(mimeType), file);
                        picturePart = MultipartBody.Part.createFormData("picture", fileName, requestFile);
                    } else {
                        // If filename doesn't have proper extension, add one based on MIME type
                        String extension = getExtensionFromMimeType(mimeType);
                        String finalFileName = "profile_picture" + extension;
                        RequestBody requestFile = RequestBody.create(MediaType.parse(mimeType), file);
                        picturePart = MultipartBody.Part.createFormData("picture", finalFileName, requestFile);
                    }
                }
            }

            if (picturePart == null) {
                // Handle case where no picture is provided - this should not happen in normal flow
                android.util.Log.e("UserRepository", "No picture file found, cannot create user");
                return;
            }

            Call<SignUpResponse> call = userAPI.createUser(firstName, lastName, email, userName, 
                password, birthday, gender, phoneNumber, picturePart);
            call.enqueue(callback);
        } catch (Exception e) {
            android.util.Log.e("UserRepository", "Error creating multipart request", e);
        }
    }

    /**
     * Convert Uri to File
     */
    private File getFileFromUri(Uri uri) {
        try {
            Context context = AppController.context;

            // Try the MediaStore approach
            String[] projection = {MediaStore.Images.Media.DATA};
            Cursor cursor = context.getContentResolver().query(uri, projection, null, null, null);
            if (cursor != null) {
                try {
                    int columnIndex = cursor.getColumnIndexOrThrow(MediaStore.Images.Media.DATA);
                    cursor.moveToFirst();
                    String filePath = cursor.getString(columnIndex);
                    if (filePath != null) {
                        File file = new File(filePath);
                        if (file.exists()) {
                            return file;
                        }
                    }
                } finally {
                    cursor.close();
                }
            }
        } catch (Exception e) {
            android.util.Log.e("UserRepository", "Error getting file from Uri", e);
        }
        return null;
    }

    /**
     * Get MIME type from Uri
     */
    private String getMimeType(Uri uri) {
        Context context = AppController.context;
        String mimeType = context.getContentResolver().getType(uri);

        // If we can't get the MIME type, try to determine it from the file extension
        if (mimeType == null) {
            String fileName = getFileName(uri);
            if (fileName != null) {
                String extension = MimeTypeMap.getFileExtensionFromUrl(fileName);
                mimeType = MimeTypeMap.getSingleton().getMimeTypeFromExtension(extension);
            }
        }

        // Default to jpeg if we can't determine the type
        return mimeType != null ? mimeType : "image/jpeg";
    }

    /**
     * Get filename from Uri
     */
    private String getFileName(Uri uri) {
        Context context = AppController.context;
        String fileName = null;

        if (uri.getScheme().equals("content")) {
            String[] projection = {MediaStore.Images.Media.DISPLAY_NAME};
            Cursor cursor = context.getContentResolver().query(uri, projection, null, null, null);
            if (cursor != null) {
                try {
                    if (cursor.moveToFirst()) {
                        int columnIndex = cursor.getColumnIndex(MediaStore.Images.Media.DISPLAY_NAME);
                        if (columnIndex >= 0) {
                            fileName = cursor.getString(columnIndex);
                        }
                    }
                } finally {
                    cursor.close();
                }
            }
        }

        if (fileName == null) {
            fileName = uri.getLastPathSegment();
        }

        return fileName;
    }

    /**
     * Get file extension from MIME type
     */
    private String getExtensionFromMimeType(String mimeType) {
        if (mimeType == null) return ".jpg";

        switch (mimeType) {
            case "image/jpeg":
                return ".jpg";
            case "image/png":
                return ".png";
            case "image/jpg":
                return ".jpg";
            default:
                return ".jpg"; // Default to jpg
        }
    }

    /**
     * Sign in user
     * @param email user email
     * @param password user password
     * @param callback callback for handling response
     */
    public void signInUser(String email, String password, Callback<SignInResponse> callback) {
        SignInRequest request = new SignInRequest(email, password);
        Call<SignInResponse> call = userAPI.signIn(request);
        call.enqueue(callback);
    }

    /**
     * Get current user information
     * @param token authentication token
     * @param callback callback for handling response
     */
    public void getCurrentUser(String token, Callback<User> callback) {
        Call<User> call = userAPI.getCurrentUser("Bearer " + token);
        call.enqueue(callback);
    }

    /**
     * Check if email already exists
     * @param email the email to check
     * @param callback callback for handling response
     */
    public void checkEmailExists(String email, Callback<Void> callback) {
        Call<Void> call = userAPI.checkEmailExists(email);
        call.enqueue(callback);
    }

    /**
     * Check if username already exists
     * @param userName the username to check
     * @param callback callback for handling response
     */
    public void checkUsernameExists(String userName, Callback<Void> callback) {
        Call<Void> call = userAPI.checkUsernameExists(userName);
        call.enqueue(callback);
    }

    // GABI - ADDED CODE GET USER PHOTO
    /**
     * Get user profile picture
     * @param token authentication token
     * @param callback callback for handling response
     */
    public void getUserPhoto(String token, Callback<okhttp3.ResponseBody> callback) {
        Call<okhttp3.ResponseBody> call = userAPI.getUserPhoto("Bearer " + token);
        call.enqueue(callback);
    }

    // GABI - DELETED CODE
    // /**
    //  * Synchronous method for checking if email exists (for legacy support)
    //  * @param email the email to check
    //  * @return true if email exists, false otherwise
    //  */
    // public boolean emailExists(String email) {
    //     // This is a simplified synchronous version
    //     // In a real implementation, you would use the async version above
    //     return false;
    // }

    // /**
    //  * Synchronous method for checking if username exists (for legacy support)
    //  * @param userName the username to check
    //  * @return true if username exists, false otherwise
    //  */
    // public boolean userNameExists(String userName) {
    //     // This is a simplified synchronous version
    //     // In a real implementation, you would use the async version above
    //     return false;
    // }
//
//    /**
//     * Legacy method for creating user (synchronous)
//     * @param signUpRequest the user data to save
//     * @return success/failure result
//     */
//    public boolean createUser(SignUpRequest signUpRequest) {
//        // Convert SignUpRequest to User and use async method
//        User user = new User();
//        user.setFirstName(signUpRequest.getFirstName());
//        user.setLastName(signUpRequest.getLastName());
//        user.setEmail(signUpRequest.getEmail());
//        user.setUserName(signUpRequest.getUserName());
//        user.setPassword(signUpRequest.getPassword());
//        user.setBirthday(signUpRequest.getBirthday());
//        user.setGender(signUpRequest.getGender());
//        user.setPhoneNumber(signUpRequest.getPhoneNumber());
//        // Note: Picture handling is not supported in this legacy method
//
//        // For now, return true as placeholder
//        // Real implementation would use the async createUser method above
//        return true;
//    }
}

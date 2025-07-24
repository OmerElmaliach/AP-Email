package com.example.ap_emailandroid;
import android.net.Uri;

public class AppSession {
    public static String userId;
    public static String userToken;
    public static String userEmail;
    public static String userFullName;

  //GABI - ADDED CODE (FIELDS FOR USER PROFILE)
    public static String userBirthday;
    public static String userGender;
    public static Uri userPicture;
    public static String userPhotoUrl; // URL for loading from server
    //public static String userPicture; // TODO delete this gabi?

    public static String currentLabel = "inbox"; //TODO delete this gabi?
}

package com.example.ap_emailandroid.db;

import android.content.Context;
import androidx.room.Room;

public class LocalDatabase {
    private static AppDB instance;

    public static AppDB getInstance(Context context) {
        if (instance == null) {
            instance = Room.databaseBuilder(context.getApplicationContext(), AppDB.class, "ap_email.db")
                    .fallbackToDestructiveMigration()
                    .build();
        }

        return instance;
    }
}

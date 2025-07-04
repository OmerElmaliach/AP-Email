package com.example.ap_emailandroid.db;

import androidx.room.Database;
import androidx.room.RoomDatabase;

import com.example.ap_emailandroid.local.Email;
import com.example.ap_emailandroid.local.EmailDao;

@Database(entities = {Email.class}, version = 1)
public abstract class AppDB extends RoomDatabase {
    public abstract EmailDao emailDao();
}

package com.example.ap_emailandroid.db;

import androidx.room.Database;
import androidx.room.RoomDatabase;
import androidx.room.TypeConverters;

import com.example.ap_emailandroid.local.Email;
import com.example.ap_emailandroid.local.EmailDao;

@Database(entities = {Email.class}, version = 2)
@TypeConverters({Converters.class})
public abstract class AppDB extends RoomDatabase {
    public abstract EmailDao emailDao();
}

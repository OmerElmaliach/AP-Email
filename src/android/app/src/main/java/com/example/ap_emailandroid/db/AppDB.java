package com.example.ap_emailandroid.db;

import androidx.room.Database;
import androidx.room.RoomDatabase;
import androidx.room.TypeConverters;

import com.example.ap_emailandroid.local.Email;
import com.example.ap_emailandroid.local.EmailDao;
import com.example.ap_emailandroid.local.Label;
import com.example.ap_emailandroid.local.LabelDao;

@Database(entities = {Email.class, Label.class}, version = 4)
@TypeConverters({Converters.class})
public abstract class AppDB extends RoomDatabase {
    public abstract EmailDao emailDao();
    public abstract LabelDao labelDao();
}

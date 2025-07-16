package com.example.ap_emailandroid.local;

import androidx.room.Dao;
import androidx.room.Delete;
import androidx.room.Insert;
import androidx.room.Query;
import androidx.room.Update;

import java.util.List;

@Dao
public interface EmailDao {
    @Insert
    long insert(Email email);

    @Query("SELECT * FROM email")
    List<Email> index();

    @Query("SELECT * FROM email WHERE id = :id")
    Email get(int id);

    @Insert
    void insert(Email... emails);

    @Update
    void update(Email... emails);

    @Delete
    void delete(Email... emails);
}


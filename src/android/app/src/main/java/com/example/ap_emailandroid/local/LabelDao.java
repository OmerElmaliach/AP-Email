package com.example.ap_emailandroid.local;

import androidx.room.Dao;
import androidx.room.Delete;
import androidx.room.Insert;
import androidx.room.Query;
import androidx.room.Update;

import java.util.List;

@Dao
public interface LabelDao {
    @Insert
    long insert(Label label);

    @Query("SELECT * FROM label")
    List<Label> index();

    @Query("SELECT * FROM label WHERE labelJaId = :labelJaId")
    Label get(int labelJaId);

    @Insert
    void insert(Label... labels);

    @Update
    void update(Label... labels);

    @Delete
    void delete(Label... labels);
}


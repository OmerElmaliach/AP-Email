package com.example.ap_emailandroid.db;

import androidx.room.TypeConverter;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class Converters {
    @TypeConverter
    public static String fromList(List<String> list) {
        if (list == null) return "";
        StringBuilder sb = new StringBuilder();
        for (String item : list) {
            sb.append(item).append(",");
        }

        return sb.toString();
    }

    @TypeConverter
    public static List<String> toList(String data) {
        if (data == null || data.isEmpty())
            return new ArrayList<>();

        return Arrays.asList(data.split(","));
    }
}

package com.example.ap_emailandroid.local;
import androidx.room.Entity;
import androidx.room.PrimaryKey;
import com.google.gson.annotations.SerializedName;
import java.util.List;

@Entity
public class Label {

    @PrimaryKey(autoGenerate = true)
    private int id;

    @SerializedName("userId")
    public String user_id;

    @SerializedName("name")
    public String name;

    public Label(String user_id, String name) {
        this.user_id = user_id;
        this.name = name;
    }

    public int getId() {
        return id;
    }

    public String getUserId() {
        return user_id;
    }

    public String getName() {
        return name;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setUserId(String content) {
        this.user_id = content;
    }

    public void setName(String content) {
        this.name = content;
    }
}

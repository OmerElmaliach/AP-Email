package com.example.ap_emailandroid.local;
import androidx.room.Entity;
import androidx.room.Ignore;
import androidx.room.PrimaryKey;
import com.google.gson.annotations.SerializedName;

@Entity
public class Label {

    @PrimaryKey(autoGenerate = true)
    private int labelJaId;

    @SerializedName("id")
    public String id;

    @SerializedName("userId")
    public String user_id;

    @SerializedName("name")
    public String name;

    public Label(String user_id, String name) {
        this.user_id = user_id;
        this.name = name;
    }

    public String getUserId() {
        return user_id;
    }

    public String getName() {
        return name;
    }

    public void setUserId(String content) {
        this.user_id = content;
    }

    public void setName(String content) {
        this.name = content;
    }

    public int getLabelJaId() { return labelJaId; }
    public void setLabelJaId(int labelJaId) { this.labelJaId = labelJaId; }

    public String getId() { return id; }

    public void setId(String id) { this.id = id; }
}

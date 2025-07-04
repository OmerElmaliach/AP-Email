package com.example.ap_emailandroid.local;
import androidx.room.Entity;
import androidx.room.PrimaryKey;

@Entity
public class Email {

    @PrimaryKey(autoGenerate = true)
    private int id;

    public String subject;
    public String body;

    public Email(String subject, String body) {
        this.subject = subject;
        this.body = body;
    }

    public int getId() {
        return id;
    }

    public String getSubject() {
        return subject;
    }

    public String getBody() {
        return body;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setSubject(String content) {
        this.subject = subject;
    }

    public void setBody(String content) {
        this.body = body;
    }
}

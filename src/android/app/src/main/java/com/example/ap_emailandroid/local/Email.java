package com.example.ap_emailandroid.local;
import androidx.room.Entity;
import androidx.room.Ignore;
import androidx.room.PrimaryKey;
import androidx.room.TypeConverters;

import com.example.ap_emailandroid.db.Converters;
import com.google.gson.annotations.SerializedName;

import java.io.Serializable;
import java.util.List;

@Entity
public class Email implements Serializable {

    @PrimaryKey(autoGenerate = true)
    private int emailJaId;

    @Ignore
    @SerializedName("id")
    public String id;

    @SerializedName("mail_id")
    public String mail_id;

    @SerializedName("from")
    public String from;

    @SerializedName("to")
    public String to;

    @SerializedName("subject")
    public String subject;

    @SerializedName("body")
    public String body;

    @SerializedName("date_sent")
    public String date_sent;

    @SerializedName("label")
    @TypeConverters(Converters.class)
    public List<String> label;

    public Email(String mail_id, String from, String to, String subject, String body, String date_sent, List<String> label) {
        this.mail_id = mail_id;
        this.from = from;
        this.to = to;
        this.subject = subject;
        this.body = body;
        this.date_sent = date_sent;
        this.label = label;
    }

    public int getEmailJaId() {
        return emailJaId;
    }

    public String getSubject() {
        return subject;
    }

    public String getBody() {
        return body;
    }

    public String getMailId() {
        return mail_id;
    }

    public String getFrom() {
        return from;
    }

    public String getTo() {
        return to;
    }

    public String getDateSent() {
        return date_sent;
    }

    public List<String> getLabel() {
        return label;
    }

    public void setEmailJaId(int emailJaId) {
        this.emailJaId = emailJaId;
    }

    public void setSubject(String content) {
        this.subject = content;
    }

    public void setBody(String content) {
        this.body = content;
    }

    public void setMailId(String content) {
        this.mail_id = content;
    }

    public void setTo(String content) {
        this.to = content;
    }

    public void setDateSent(String content) {
        this.date_sent = content;
    }

    public void setLabel(List<String> label) {
        this.label = label;
    }
}

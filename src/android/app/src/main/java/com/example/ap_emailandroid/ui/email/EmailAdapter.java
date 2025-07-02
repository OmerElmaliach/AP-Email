package com.example.ap_emailandroid.ui.email;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import com.example.ap_emailandroid.R;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import java.util.List;

public class EmailAdapter extends RecyclerView.Adapter<EmailAdapter.EmailViewHolder> {

    public interface OnEmailClickListener {
        void onEmailClick(Email email);
    }

    private final List<Email> emails;
    private final OnEmailClickListener listener;

    public EmailAdapter(List<Email> emails, OnEmailClickListener listener) {
        this.emails = emails;
        this.listener = listener;
    }

    @NonNull
    @Override
    public EmailViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.
                from(parent.getContext()).inflate(R.layout.email_item, parent, false);
        return new EmailViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull EmailViewHolder holder, int position) {
        Email email = emails.get(position);
        holder.subject.setText(email.subject);
        holder.body.setText(email.body);
        holder.itemView.setOnClickListener(v -> listener.onEmailClick(email));
    }

    @Override
    public int getItemCount() {
        return emails.size();
    }

    static class EmailViewHolder extends RecyclerView.ViewHolder {
        TextView subject, body;

        public EmailViewHolder(@NonNull View itemView) {
            super(itemView);
            subject = itemView.findViewById(R.id.email_subject);
            body = itemView.findViewById(R.id.email_body);
        }
    }
}


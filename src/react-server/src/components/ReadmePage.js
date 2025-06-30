
import React from 'react';
import '../styles/ReadmePage.css';

const ReadmePage = () => {
  return (
    <div className="readme-container">
      <div className="readme-header">
        <h1>AP-Email System</h1>
      </div>
      <div className="readme-content">
        <section>
          <h2>Overview</h2>
          <p>
            AP-Email is a modern email application with features such as inbox management, email composition, trash handling, and a flexible labeling system. Users can register, sign in, and manage their personal email workflow efficiently from the browser.
          </p>
        </section>

        <section>
          <h2>Inbox</h2>
          <ul>
            <li>The inbox displays all received emails.</li>
            <li>Emails are grouped using labels like "sent", "trash", or user-created categories.</li>
            <li>Clicking on any email opens its full view.</li>
          </ul>
        </section>

        <section>
          <h2>Compose Email</h2>
          <ul>
            <li>Users can send new emails through the Compose page.</li>
            <li>Each email requires a recipient, subject, and body.</li>
            <li>Sent emails are automatically labeled and stored in the "sent" page.</li>
          </ul>
        </section>

        <section>
          <h2>Drafts</h2>
          <ul>
            <li>Emails can be saved as drafts by selecting the "draft" label before sending.</li>
            <li>Drafts do not require a recipient, allowing you to save partial emails at any point.</li>
            <li>Saved drafts are reusable—you can open, edit, and send them later.</li>
            <li>When you're done with a draft, you can move it to the trash.</li>
          </ul>
        </section>
        <section>
          <h2>Trash System</h2>
          <ul>
            <li>Deleting an email moves it to the "trash" label.</li>
            <li>Emails in the trash can still be opened and recovered.</li>
            <li>To permanently remove an email, it must be deleted from the trash explicitly.</li>
          </ul>
        </section>

        <section>
          <h2>Label System</h2>
          <ul>
            <li>Users can create custom labels such as "Work" or "School".</li>
            <li>Labels can be applied to emails to help with categorization.</li>
            <li>The inbox can be filtered to view only emails with a specific label.</li>
            <li>Users can rename or delete existing labels anytime.</li>
            <li>Each email can have multiple labels at once.</li>
          </ul>
        </section>

      </div>
    </div>
  );
};

export default ReadmePage;
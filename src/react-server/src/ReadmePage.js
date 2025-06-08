import React from 'react';
import './ReadmePage.css';

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
            AP-Email is a RESTful email server with a C++ blacklist server using Bloom filter logic. It supports user management, mail creation, labeling, and real-time URL validation against a blacklist.
          </p>
        </section>
        <section>
          <h2>Architecture</h2>
          <ul>
            <li><strong>C++ Blacklist Server:</strong> TCP server with Bloom filter, persistent storage, and command pattern for URL management.</li>
            <li><strong>JavaScript Email Server:</strong> Express.js REST API for mails, users, labels, and blacklist, communicating with the C++ server for URL checks.</li>
            <li><strong>React Frontend:</strong> Modern UI for email management and user profile.</li>
          </ul>
        </section>
        <section>
          <h2>How it Works</h2>
          <ol>
            <li>Blacklist server starts (C++, port 8091), loads Bloom filter and storage.</li>
            <li>Email server starts (Node.js, port 9000), exposes REST API.</li>
            <li>Emails are checked for URLs; each URL is validated via the blacklist server.</li>
            <li>Blacklisted URLs block email sending; otherwise, emails are sent and stored.</li>
          </ol>
        </section>
        <section>
          <h2>Bloom Filter Logic</h2>
          <ul>
            <li>URLs are hashed with multiple functions; bits set in the filter.</li>
            <li>Query: If any bit is 0, URL is not blacklisted. If all are 1, check storage for confirmation.</li>
            <li>False positives possible, false negatives impossible.</li>
          </ul>
        </section>
        <section>
          <h2>Setup & Running</h2>
          <ol>
            <li>Install Docker and run <code>docker-compose up --build</code></li>
            <li>API: <code>http://localhost:9000/api/</code> | Blacklist TCP: <code>localhost:8091</code></li>
            <li>Stop: <code>docker-compose down</code></li>
          </ol>
        </section>
        <section>
          <h2>Example API Usage</h2>
          <ul>
            <li><code>GET /api/mails/</code> - Get inbox</li>
            <li><code>POST /api/mails/</code> - Send email</li>
            <li><code>GET /api/blacklist/:url</code> - Check URL</li>
            <li><code>POST /api/blacklist</code> - Add URL to blacklist</li>
            <li><code>DELETE /api/blacklist/:url</code> - Remove URL</li>
            <li><code>POST /api/users</code> - Register user</li>
            <li><code>POST /api/tokens</code> - Login</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default ReadmePage;

import React from 'react';
import './ReadmePage.css';

const ReadmePage = () => {
  return (
    <div className="readme-container">
      <div className="readme-header">
        <h1>AP-Email System</h1>
        <button 
          className="close-readme"
          onClick={() => window.close()}
        >
          ×
        </button>
      </div>
      
      <div className="readme-content">
        <section>
          <h2>Overview</h2>
          <p>
            AP-Email is an advanced email management system that integrates URL blacklisting 
            functionality using Bloom filters for efficient spam detection and security.
          </p>
        </section>

        <section>
          <h2>Features</h2>
          <ul>
            <li>Email inbox management with categorization (Primary, Social, Promotions)</li>
            <li>URL blacklisting system with Bloom filter technology</li>
            <li>User authentication and profile management</li>
            <li>Real-time email filtering and security</li>
            <li>Modern React-based user interface</li>
          </ul>
        </section>

        <section>
          <h2>System Architecture</h2>
          <h3>Backend Services</h3>
          <ul>
            <li><strong>JavaScript API Server (Port 9000):</strong> Handles HTTP requests and user operations</li>
            <li><strong>C++ Blacklist Server (Port 8091):</strong> Manages URL blacklisting with Bloom filters</li>
            <li><strong>React Frontend (Port 3000):</strong> User interface for email management</li>
          </ul>
        </section>

        <section>
          <h2>Blacklist Management</h2>
          <h3>Adding URLs</h3>
          <p>POST /api/blacklist endpoint → TCP POST command → Bloom filter insertion + storage persistence</p>
          
          <h3>Checking URLs</h3>
          <p>GET /api/blacklist/:url endpoint → TCP GET command → Bloom filter query + storage verification</p>
          
          <h3>Removing URLs</h3>
          <p>DELETE /api/blacklist/:url endpoint → TCP DELETE command → Storage removal (Bloom filter bits remain set)</p>
        </section>

        <section>
          <h2>Bloom Filter Logic</h2>
          <ul>
            <li><strong>Insertion:</strong> URLs are hashed using multiple hash functions, corresponding bits set to 1 in filter array</li>
            <li><strong>Query:</strong> URL hashed with same functions, all corresponding bits checked:
              <ul>
                <li>If any bit is 0: URL definitely NOT blacklisted</li>
                <li>If all bits are 1: URL MIGHT be blacklisted (verified against storage for accuracy)</li>
              </ul>
            </li>
            <li><strong>False Positives:</strong> Possible but rare; manual storage check provides definitive answer</li>
            <li><strong>False Negatives:</strong> Impossible due to Bloom filter mathematical properties</li>
          </ul>
        </section>

        <section>
          <h2>Getting Started</h2>
          <ol>
            <li>Ensure Docker is running</li>
            <li>Start the backend services: <code>docker-compose up</code></li>
            <li>Access the web interface at <code>http://localhost:3000</code></li>
            <li>Use the API endpoints for programmatic access</li>
          </ol>
        </section>

        <section>
          <h2>API Endpoints</h2>
          <div className="api-section">
            <h3>Blacklist Management</h3>
            <div className="endpoint">
              <span className="method post">POST</span>
              <span className="path">/api/blacklist</span>
              <span className="desc">Add URL to blacklist</span>
            </div>
            <div className="endpoint">
              <span className="method get">GET</span>
              <span className="path">/api/blacklist/:url</span>
              <span className="desc">Check if URL is blacklisted</span>
            </div>
            <div className="endpoint">
              <span className="method delete">DELETE</span>
              <span className="path">/api/blacklist/:url</span>
              <span className="desc">Remove URL from blacklist</span>
            </div>
          </div>

          <div className="api-section">
            <h3>User Management</h3>
            <div className="endpoint">
              <span className="method post">POST</span>
              <span className="path">/api/users</span>
              <span className="desc">Create new user</span>
            </div>
            <div className="endpoint">
              <span className="method get">GET</span>
              <span className="path">/api/users/:id</span>
              <span className="desc">Get user information</span>
            </div>
          </div>
        </section>

        <section>
          <h2>Technical Support</h2>
          <p>
            For technical issues or questions, please refer to the project documentation 
            or contact the development team.
          </p>
        </section>
      </div>
    </div>
  );
};

export default ReadmePage;

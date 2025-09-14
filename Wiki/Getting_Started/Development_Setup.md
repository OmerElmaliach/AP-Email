# Installation Guide (For Developers)

## Introduction

This guide will walk you through setting up the **AP-Email development environment**. The application requires a **backend (Node.js with MongoDB)** to be running before launching the client applications.

---

## Prerequisites

Before starting, ensure you have the following installed on your system:

- **Node.js (v16 or higher)** – [Download here](https://nodejs.org/)
- **npm (Node Package Manager)** – Comes with Node.js
- **MongoDB** – [Download here](https://www.mongodb.com/try/download/community)
- **Docker & Docker Compose** – [Install here](https://docs.docker.com/get-docker/)

  **See our Prerequisites page for more details** - [Prerequisites](./Prerequisites.md)
   
---

## Clone the Repository
In your favourite terminal, enter:

```bash
git clone https://github.com/OmerElmaliach/AP-Email.git
cd AP-Email
```
### Method 1: Using Docker Compose (Recommended)

1. **Run the Complete System:**
   Run the following in your terminal:
   ```bash
   sudo docker-compose up
   ```
   Wait for the process to finish.
   
2. **Access the Services:**
   In order to use services you must create an account.
   In your local browser enter the following URL - 
    - to create an account go to Email SignUp : [http://localhost:3000/SignUp](http://localhost:3000/SignUp)
    - if you already have an account go to Email SignIn : [http://localhost:3000/SignIn](http://localhost:3000/SignIn)
      
Users may only interact with the React frontend. Any attempt to access the backend directly will redirect them to the sign-in page.

3. **Stop the System:**
   Run the following in your terminal:
   ```bash
   docker-compose down
   ```

### Method 2: Manual Docker Setup (But why make life complicated?)

1. **Build Docker Images:**
   ```bash
   # Navigate to src directory
   cd src
   
   # Build blacklist server
   docker build -f config/DockerServer -t docker-server .
   
   # Build JavaScript server
   docker build -f config/DockerJs -t docker-js .
   ```

2. **Create Docker Network:**
   ```bash
   docker network create ap-email-net
   ```

3. **Run Blacklist Server:**
   ```bash
   # Create data directory for persistence
   mkdir -p ../data
   
   # Run blacklist server with Bloom filter settings: port=8091, size=32, hash_functions=2, seed=5
   docker run -d --name docker-server --network ap-email-net \
     -p 8091:8091 -v "$(pwd)/../data:/Ap_Email/data" \
     docker-server 8091 32 2 5
   ```

4. **Run JavaScript Email Server:**
   ```bash
   docker run -d --name docker-js --network ap-email-net \
     -p 9000:9000 docker-js
   ```

5. **Run React Frontend:**
   ```bash
   # Navigate to the react-server project folder 

   # Install dependencies
   npm install

   # Start the development server
   npm start
   ```

   The frontend will be accessible at `http://localhost:3000`

### Manual MongoDB Setup
```bash
# Install MongoDB locally
# Windows: Download from https://www.mongodb.com/try/download/community
# macOS: brew install mongodb-community
# Linux: sudo apt-get install mongodb

# Start MongoDB service
# Windows: Start MongoDB service from Services
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod

# Verify MongoDB is running
mongo --eval "db.adminCommand('listCollections')"
```

## Troubleshooting Setup

### Common Backend Issues
```bash
# Port already in use
lsof -ti:9000 | xargs kill -9

# Node modules issues
rm -rf node_modules package-lock.json
npm install

# Permission issues
sudo npm install -g npm@latest
```

### Common React Issues
```bash
# Clear React cache
npm start -- --reset-cache

# Node modules issues
rm -rf node_modules package-lock.json
npm install

# Port conflicts
# React will automatically use next available port
```

## Verification Steps

### 1. Backend Verification
```bash
# Test API endpoints
curl http://localhost:9000/api/health
curl -X POST http://localhost:9000/api/users -H "Content-Type: application/json" -d '{"email":"test@example.com"}'
```

### 2. Frontend Verification
1. Open http://localhost:3000 in browser
2. Verify React app loads correctly
3. Test navigation between pages
4. Check browser console for errors

## Additional Notes

### Common Issues
- **Backend Not Connecting?** Ensure MongoDB is running and backend is accessible
- **Web App Not Loading Data?** Check the `.env` file for correct API URL
- **Port Conflicts?** Check if ports 3000 and 9000 are available

### Development Tips
- **Use Docker** for easier database setup
- **Check console logs** for debugging information
- **Restart services** if any configuration changes are made
- **Use browser DevTools** for web debugging


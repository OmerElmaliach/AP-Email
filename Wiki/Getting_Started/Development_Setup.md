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
- **Android Studio** (for Android development) – [Download here](https://developer.android.com/studio)

---

## Clone the Repository

```bash
git clone https://github.com/OmerElmaliach/AP-Email.git
cd AP-Email
```
### Method 1: Using Docker Compose (Recommended)

1. **Run the Complete System:**
   ```bash
   sudo docker-compose up
   ```
   
2. **Access the Services:**
   in order to use services most create an account.
   in your local browser copy to your url
    - to create an account go to Email SignUp : `http://localhost:3000/SignUp` 
    - if you already have an account go to Email SignIn : `http://localhost:3000/SignIn` 
      
Users may only interact with the React frontend. Any attempt to access the backend directly will redirect them to the sign-in page.

3. **Stop the System:**
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

## Setting Up the Android Application

### **Open the Android Project in Android Studio**
1. Open **Android Studio**
2. Click **File > Open**
3. Navigate to the **AP-Email/src/android** folder and open the project

### **Configure the API Connection**
The Android application needs to connect to the backend server:

#### **Update the Backend URL**
1. Navigate to the Android app's network configuration
2. Update the backend URL to `http://localhost:9000` (or your computer's IP if using a physical device)

### **Build and Run the Android Application**
1. In **Android Studio**, click **Run > Run 'app'**
2. Select your emulator or connected device
3. The application should launch and connect to the backend server



## Manual Android Application Setup

### 1. Navigate to Android Directory
```bash
cd src/android
```

### 2. Configure Local Properties
```bash
# Create local.properties file
touch local.properties

# Add Android SDK path (adjust path for your system)
# Windows
echo "sdk.dir=C:\\Users\\YourName\\AppData\\Local\\Android\\Sdk" >> local.properties

# macOS
echo "sdk.dir=/Users/YourName/Library/Android/sdk" >> local.properties

# Linux
echo "sdk.dir=/home/YourName/Android/Sdk" >> local.properties
```

### 3. Sync and Build Project
```bash
# Make gradlew executable (macOS/Linux)
chmod +x gradlew

# Sync project dependencies
./gradlew sync

# Build the project
./gradlew build

# For debug build
./gradlew assembleDebug
```

### 4. Run on Emulator or Device
```bash
# List available devices
adb devices

# Install and run on connected device/emulator
./gradlew installDebug

# Or use Android Studio to run the app
```

## Database Setup

### Option 1: In-Memory Development (Current)
No additional setup required. The application uses in-memory storage for development.

### Option 2: MongoDB Setup (Planned)
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

### Common Android Issues
```bash
# Gradle sync failures
./gradlew clean build

# Android SDK issues
# Update SDK through Android Studio SDK Manager

# Emulator issues
# Wipe emulator data and restart
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

### 3. Android Verification
1. App builds without errors
2. App runs on emulator/device
3. API calls work correctly
4. Navigation flows work properly

## Additional Notes

### Common Issues
- **Backend Not Connecting?** Ensure MongoDB is running and backend is accessible
- **Web App Not Loading Data?** Check the `.env` file for correct API URL
- **Android App Cannot Reach Backend?** Make sure your device is on the same network as your computer
- **Port Conflicts?** Check if ports 3000 and 9000 are available

### Development Tips
- **Use Docker** for easier database setup
- **Check console logs** for debugging information
- **Restart services** if any configuration changes are made
- **Use browser DevTools** for web debugging


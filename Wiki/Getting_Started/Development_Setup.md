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

## 1. Clone the Repository

```bash
git clone https://github.com/OmerElmaliach/AP-Email.git
cd AP-Email
```

## 2. Setting Up the Backend (Node.js)

### **Navigate to the backend folder**
```bash
cd src/js
```

### **Install Dependencies**
```bash
npm install
```

### **Create the Backend Configuration File (.env)**
Inside the `src/js` folder, create a file named `.env` with the following content:
```bash
NODE_ENV=development
PORT=9000
JWT_SECRET=your_jwt_secret_key
MONGODB_URI=mongodb://localhost:27017/ap-email
```

### **Start the Backend**
```bash
npm start
```

The backend server will run on `http://localhost:9000`

---

## 3. Setting Up the Web Application (React)

### **Navigate to the frontend folder**
```bash
cd src/react-server
```

### **Install Dependencies**
```bash
npm install
```

### **Create the Frontend Configuration File (.env)**
In the `src/react-server` folder create a config file called `.env`:
```bash
REACT_APP_API_URL=http://localhost:9000
REACT_APP_NODE_ENV=development
```

### **Start the Frontend**
```bash
npm start
```

Note: By default, the frontend will start on `http://localhost:3000`

---

## 4. Setting Up the Android Application

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

---

## 5. Running the Application

Once everything is set up:
1. Ensure the backend is running (`npm start` in `src/js`)
2. Run the web application (`npm start` in `src/react-server`)
3. Run the Android application in **Android Studio**
4. Access the web app at `http://localhost:3000`
5. Use the Android app on your device/emulator

---

## 6. Troubleshooting & Additional Notes

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

---

*Last Updated: July 2025*
*For user guides, see [Web Application](../Web_Application/README.md) or [Android Application](../Android_Application/README.md).*

### 1. Navigate to Backend Directory
```bash
cd src/js
```

### 2. Install Dependencies
```bash
# Install Node.js dependencies
npm install

# Verify package.json dependencies
cat package.json
```

### 3. Environment Configuration
```bash
# Create environment file
touch .env

# Add environment variables
echo "NODE_ENV=development" >> .env
echo "PORT=9000" >> .env
echo "JWT_SECRET=your-secret-key-here" >> .env
echo "MONGODB_URI=mongodb://localhost:27017/ap-email" >> .env
```

### 4. Start Backend Server
```bash
# Development mode with auto-reload
npm run dev

# Or using the start script
../start-js-server.sh

# Verify server is running
curl http://localhost:9000/api/health
```

## Web Application Setup (React)

### 1. Navigate to React Directory
```bash
cd src/react-server
```

### 2. Install Dependencies
```bash
# Install React dependencies
npm install

# Verify installation
npm list
```

### 3. Environment Configuration
```bash
# Create React environment file
touch .env

# Add API endpoint configuration
echo "REACT_APP_API_URL=http://localhost:9000/api" >> .env
echo "REACT_APP_ENV=development" >> .env
```

### 4. Start Development Server
```bash
# Start React development server
npm start

# Server will be available at http://localhost:3000
```

## Android Application Setup

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

## Docker Setup (Alternative)

### 1. Using Docker Compose
```bash
# Navigate to project root
cd AP-Email

# Build and start all services
docker-compose up --build

# Run in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 2. Individual Service Containers
```bash
# Build backend container
docker build -f src/config/DockerJs -t ap-email-backend .

# Build React container
docker build -f src/config/DockerReact -t ap-email-frontend .

# Run containers
docker run -p 9000:9000 ap-email-backend
docker run -p 3000:3000 ap-email-frontend
```

## Development Workflow

### 1. Daily Development Setup
```bash
# Start backend server
cd src/js && npm run dev &

# Start React development server
cd src/react-server && npm start &

# Open Android Studio for Android development
```

### 2. Running Tests
```bash
# Backend tests
cd src/js && npm test

# React tests
cd src/react-server && npm test

# Android tests
cd src/android && ./gradlew test
```

### 3. Code Quality
```bash
# ESLint for JavaScript/React
npm run lint

# Android lint
./gradlew lint

# Fix common issues
npm run lint:fix
```

## IDE Configuration

### Visual Studio Code
```bash
# Install recommended extensions
code --install-extension vscjava.vscode-java-pack
code --install-extension ms-vscode.vscode-android
code --install-extension bradlc.vscode-tailwindcss
code --install-extension esbenp.prettier-vscode
```

### Android Studio
1. Open Android Studio
2. Select "Open an existing Android Studio project"
3. Navigate to `src/android` folder
4. Wait for Gradle sync to complete
5. Configure emulator or connect physical device

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

## Next Steps

After completing the development setup:
1. Review [API Documentation](../Web_Application/API_Documentation.md)
2. Explore [Android Architecture](../Android_Application/Architecture.md)
3. Check [Testing Guide](Testing.md) for running tests
4. See [Deployment Guide](Deployment.md) for production setup

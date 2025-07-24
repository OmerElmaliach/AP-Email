# User Requirements

## What You Need

### To Use AP-Email Web Application
- Any modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection

### To Use AP-Email Android App
- Android studio with emulator running Android 7.0 or higher
- Android device running Android 7.0 or higher

That's it! No additional software or setup required.

#### Android Development (for Android app)
```bash
# Android Studio
https://developer.android.com/studio

# Java Development Kit (JDK 11)
https://adoptopenjdk.net/

# Android SDK (installed with Android Studio)
# Minimum SDK: API 24 (Android 7.0)
# Target SDK: API 35
```

#### Docker (Optional but Recommended)
```bash
# Docker Desktop
https://www.docker.com/products/docker-desktop

# Verify installation
docker --version
docker-compose --version
```

### Development Tools

#### Code Editors
- **Primary**: Visual Studio Code with extensions:
  - Android iOS Emulator
  - Java Extension Pack
  - Node.js Extension Pack
  - Docker
  - GitLens

#### Version Control
```bash
# Git
https://git-scm.com/

# Verify installation
git --version
```

## Environment Variables

### Required Environment Variables
Create these environment variables in your system:

#### Android Development
```bash
# Windows
JAVA_HOME=C:\Program Files\Java\jdk-11
ANDROID_HOME=C:\Users\YourName\AppData\Local\Android\Sdk
PATH=%PATH%;%ANDROID_HOME%\tools;%ANDROID_HOME%\platform-tools

# macOS/Linux
export JAVA_HOME=/usr/lib/jvm/java-11-openjdk
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
```

#### Node.js Development
```bash
# Optional but recommended
NODE_ENV=development
PORT=9000
```

## Network Configuration

### Port Requirements
Ensure these ports are available:
- **3000**: React development server
- **9000**: Node.js API server
- **27017**: MongoDB
- **8080**: Android emulator web access


## Verification Steps

### 1. Node.js Environment
```bash
# Check Node.js and npm versions
node --version  # Should be 18.x or later
npm --version   # Should be 8.x or later

# Test npm functionality
npm list -g
```

### 2. Android Environment
```bash
# Check Java installation
java -version

# Check Android SDK
adb version

# List available Android Virtual Devices
emulator -list-avds
```

### 3. Docker Environment (if using Docker)
```bash
# Test Docker functionality
docker run hello-world
docker-compose --version
```

## Common Prerequisites Issues

### Node.js Issues
```bash
# Permission issues (macOS/Linux)
sudo chown -R $(whoami) ~/.npm

# Clear npm cache
npm cache clean --force

# Update npm to latest
npm install -g npm@latest
```

### Android Issues
```bash
# SDK license acceptance
flutter doctor --android-licenses

# Gradle wrapper permissions (macOS/Linux)
chmod +x gradlew

# Clear Gradle cache
./gradlew clean
```

### Docker Issues
```bash
# Reset Docker Desktop
# Windows: Docker Desktop -> Settings -> Reset
# macOS: Docker Desktop -> Preferences -> Reset

# Restart Docker service
# Windows: restart Docker Desktop
# Linux: sudo systemctl restart docker
```

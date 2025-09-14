# User Requirements

## What You Need

### To Use AP-Email Web Application
- Any modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection

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

## Verification Steps

### 1. Node.js Environment
```bash
# Check Node.js and npm versions
node --version  # Should be 18.x or later
npm --version   # Should be 8.x or later

# Test npm functionality
npm list -g
```

### 2. Docker Environment (if using Docker)
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

### Docker Issues
```bash
# Reset Docker Desktop
# Windows: Docker Desktop -> Settings -> Reset
# macOS: Docker Desktop -> Preferences -> Reset

# Restart Docker service
# Windows: restart Docker Desktop
# Linux: sudo systemctl restart docker
```

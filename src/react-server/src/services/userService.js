// User Authentication Service
// This service handles user data retrieval from JWT tokens and API calls
// Designed to be easily adaptable for MongoDB integration

class UserService {
  constructor() {
    this.baseURL = 'http://localhost:9000/api';
    this.token = null;
    this.userId = null;
    this.initializeFromStorage();
  }

  // Initialize service with stored authentication data
  initializeFromStorage() {
    try {
      // Check for stored JWT token
      this.token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      this.userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
      
      // If we have saved user credentials, attempt auto-login
      const savedUser = localStorage.getItem('savedUser');
      if (savedUser && !this.token) {
        const credentials = JSON.parse(savedUser);
        this.loginWithCredentials(credentials.userName, credentials.password);
      }
    } catch (error) {
      console.error('Error initializing user service:', error);
      this.clearAuthData();
    }
  }

  // Extract user data from JWT token (client-side parsing for demo)
  // In production, this should be validated server-side
  parseJWT(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error parsing JWT:', error);
      return null;
    }
  }

  // Check if current token is valid and not expired
  isTokenValid() {
    if (!this.token) return false;
    
    try {
      const payload = this.parseJWT(this.token);
      if (!payload) return false;
      
      // Check if token is expired
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp && payload.exp > currentTime;
    } catch (error) {
      return false;
    }
  }

  // Login with username and password
  async loginWithCredentials(userName, password) {
    try {
      const response = await fetch(`${this.baseURL}/tokens`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'userId': this.userId || '1' // Fallback for demo
        },
        body: JSON.stringify({ userName, password })
      });

      if (response.ok) {
        const data = await response.json();
        this.token = data.token || data.accessToken;
        this.userId = data.userId || data.id;
        
        // Store authentication data
        localStorage.setItem('authToken', this.token);
        localStorage.setItem('userId', this.userId);
        
        return { success: true, token: this.token, userId: this.userId };
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get current user data from API
  async getCurrentUser() {
    // If no valid token, return mock data for development
    if (!this.isTokenValid()) {
      console.warn('No valid token, using mock data');
      return this.getMockUser();
    }

    try {
      // Try to get user ID from token
      const tokenPayload = this.parseJWT(this.token);
      const userIdToFetch = tokenPayload?.userId || this.userId || '1';

      const response = await fetch(`${this.baseURL}/users/${userIdToFetch}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`,
          'userId': userIdToFetch
        }
      });

      if (response.ok) {
        const userData = await response.json();
        return this.formatUserData(userData);
      } else if (response.status === 401) {
        // Token expired or invalid
        this.clearAuthData();
        return this.getMockUser();
      } else {
        throw new Error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Fallback to mock data in case of network issues
      return this.getMockUser();
    }
  }

  // Format user data to match expected structure
  formatUserData(rawUserData) {
    return {
      id: rawUserData.id || rawUserData._id,
      fullName: rawUserData.fullName || rawUserData.name,
      email: rawUserData.email,
      userName: rawUserData.userName || rawUserData.username,
      password: rawUserData.password, // Only for display purposes (masked)
      birthday: rawUserData.birthday,
      phoneNumber: rawUserData.phoneNumber || rawUserData.phone,
      gender: rawUserData.gender,
      picture: rawUserData.picture || rawUserData.avatar || this.generateAvatarURL(rawUserData.fullName || rawUserData.name)
    };
  }

  // Generate placeholder avatar URL based on user name
  generateAvatarURL(fullName) {
    if (!fullName) return 'https://via.placeholder.com/100/4285f4/white?text=U';
    
    const initials = fullName.split(' ').map(name => name[0]).join('').toUpperCase();
    return `https://via.placeholder.com/100/4285f4/white?text=${initials}`;
  }

  // Mock user data for development/fallback
  getMockUser() {
    return {
      id: '1',
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      userName: 'johndoe',
      password: 'MyPass123',
      birthday: '1990-05-15',
      phoneNumber: '+1-555-0123',
      gender: 'M',
      picture: 'https://via.placeholder.com/100/4285f4/white?text=JD'
    };
  }

  // Clear authentication data
  clearAuthData() {
    this.token = null;
    this.userId = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userId');
  }

  // Logout user
  logout() {
    this.clearAuthData();
    localStorage.removeItem('savedUser');
  }

  // Methods for future MongoDB integration
  
  // Connect to MongoDB (placeholder for future implementation)
  async connectToMongoDB(connectionString) {
    // TODO: Implement MongoDB connection
    // This will replace the REST API calls when MongoDB is integrated
    console.log('MongoDB connection will be implemented here');
  }

  // Fetch user from MongoDB (placeholder for future implementation)
  async getUserFromMongoDB(userId) {
    // TODO: Implement direct MongoDB user queries
    // This will replace REST API calls for better performance
    console.log('MongoDB user fetch will be implemented here');
  }

  // Update user in MongoDB (placeholder for future implementation)
  async updateUserInMongoDB(userId, userData) {
    // TODO: Implement MongoDB user updates
    console.log('MongoDB user update will be implemented here');
  }
}

// Export singleton instance
const userService = new UserService();
export default userService;

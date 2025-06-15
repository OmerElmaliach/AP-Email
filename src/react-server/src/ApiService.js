const API_BASE_URL = 'http://localhost:9000/api';

// Default user ID for demo purposes
const DEFAULT_USER_ID = '1';

class ApiService {
    // Helper method to make HTTP requests
  static async makeRequest(url, options = {}, useAuth = true) {
    const finalHeaders = {
      ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...(useAuth && localStorage.getItem('token')
        ? { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        : {}),
      ...options.headers
    };

    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers: finalHeaders
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        return await response.text();
      }
    } catch (error) {
      console.error(`API request failed: ${url}`, error);
      throw error;
    }
  }

    // Get all emails for user
    static getUserEmails() {
        return this.makeRequest('/mails');
    }

    // Get all labels
    static getAllLabels() {
        return this.makeRequest('/labels');
    }

    // Create a new email
    static createEmail(emailData) {
        return this.makeRequest('/mails', {
            method: 'POST',
            body: JSON.stringify(emailData)
        });
    }

    // Update email labels
    static updateEmail(emailId, updateData) {
        return this.makeRequest(`/mails/${emailId}`, {
            method: 'PATCH',
            body: JSON.stringify(updateData)
        });
    }

    // Delete email (move to trash)
    static deleteEmail(emailId) {
        return this.makeRequest(`/mails/${emailId}`, {
            method: 'DELETE'
        });
    }

    // Search emails
    static searchEmails(query) {
        return this.makeRequest(`/mails/search/${encodeURIComponent(query)}`);
    }

    // Create a new label
    static createLabel(labelData) {
        return this.makeRequest('/labels', {
            method: 'POST',
            body: JSON.stringify(labelData)
        });
    }

 //  user signup- no token, with FormData
  static signupUser(formData) {
    return this.makeRequest('/signup', {
      method: 'POST',
      body: formData
    }, false); // no token 
  }

  //  login returns token, no token 
  static loginUser(credentials) {
    return this.makeRequest('/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    }, false); // no token 
  }

    // get user, will show his info in inbox page
   static getCurrentUser() {
    return this.makeRequest('/signup/me'); // this is where getUser is
  }

  //to log out delete his token
  static logout() {
    localStorage.removeItem('token');
  }


}






export default ApiService;
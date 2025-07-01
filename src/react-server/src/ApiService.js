const API_BASE_URL = 'http://localhost:9000/api';

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
        headers: finalHeaders,
        credentials: 'include'
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        const jsonResponse = await response.json();
        return jsonResponse;
      } else {
        const textResponse = await response.text();
        return textResponse;
      }
    } catch (error) {
      console.error(` API request failed: ${url}`, error);
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

  // Get specific label by id
  static getLabelById(labelId) {
    return this.makeRequest(`/labels/${labelId}`, {
      method: 'GET'
  });
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

  // get a specific email
  static getEmailById(emailId) {
    return this.makeRequest(`/mails/${emailId}`, {
      method: 'GET'
    });
  }

  // Delete email (move to trash)
  static deleteEmail(emailId) {
    return this.makeRequest(`/mails/${emailId}`, {
      method: 'DELETE'
    });
  }

  // Delete a label.
  static deleteLabel(labelId) {
    return this.makeRequest(`/labels/${labelId}`, {
      method: 'DELETE'
    });
  }

  // Add a url to the blacklist
  static addToBlacklist(url) {
    return this.makeRequest('/blacklist', {
      method: 'POST',
      body: JSON.stringify(url)
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
  static async signupUser(formData) {
    const response = await this.makeRequest('/signup', {
      method: 'POST',
      body: formData
    }, false);              // no token 
    if (response.token) {
      localStorage.setItem('token', response.token);
      return true;
    } else {
      return false;
    }
  }


  //  login returns token, no token 
  static async signInUser(credentials) {

    try {
      const response = await this.makeRequest('/signin', {
        method: 'POST',
        body: JSON.stringify(credentials)
      }, false);


      if (response.token) {
        localStorage.setItem('token', response.token);
        return true;
      } else {
        localStorage.removeItem('token');
        return false;
      }
    } catch (err) {
      localStorage.removeItem('token');
      return false;
    }
  }

  // Also debug the makeRequest method


  // get user, will show his info in inbox page
  static getCurrentUser() {
    return this.makeRequest('/signup/me'); // this is where getUser is
  }

  // get user photo to show on page
  static async getUserPhotoBlob() {
    const response = await fetch(`${API_BASE_URL}/userPhoto/me`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) throw new Error('Failed to fetch photo');

    return await response.blob(); // returns the raw image data
  }




  //to log out delete his token
  static logout() {
    localStorage.removeItem('token');
  }


}






export default ApiService;
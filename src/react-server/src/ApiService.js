const API_BASE_URL = 'http://localhost:9000/api';

// Default user ID for demo purposes
const DEFAULT_USER_ID = '1';

class ApiService {
    // Helper method to make HTTP requests
    static async makeRequest(url, options = {}) {
        try {
            const response = await fetch(`${API_BASE_URL}${url}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'userid': DEFAULT_USER_ID,
                    ...options.headers
                },
                ...options
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Handle different response types
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
}

export default ApiService;
import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // Mock data for emails
  const mockEmails = [
    {
      id: 1,
      subject: "ETL",
      body: "Equipment Return Instructions",
      date: "Mar 31",
      labels: ["Inbox", "Work"]
    },
    {
      id: 2,
      subject: "Meeting Tomorrow",
      body: "Don't forget about our team meeting at 2 PM",
      date: "Apr 1",
      labels: ["Inbox", "Important", "Meetings"]
    },
    {
      id: 3,
      subject: "Newsletter",
      body: "Weekly tech updates and industry news",
      date: "Apr 2",
      labels: ["Inbox", "Newsletter"]
    },
    {
      id: 4,
      subject: "Project Update",
      body: "Status report on the current development phase",
      date: "Apr 3",
      labels: ["Inbox", "Work", "Updates", "Development"]
    }
  ];

  // Mock labels
  const mockLabels = ["Inbox", "Starred", "Sent", "Draft", "Spam", "Trash", "Work", "Important", "Meetings", "Newsletter", "Updates", "Development"];

  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [emails, setEmails] = useState(mockEmails);
  const [currentLabel, setCurrentLabel] = useState('Inbox');
  const [showLabelDropdown, setShowLabelDropdown] = useState({});
  const [showLabelSuggestions, setShowLabelSuggestions] = useState({});
  const [newLabelInput, setNewLabelInput] = useState({});

  // Search functionality
  const handleSearch = () => {
    if (searchQuery.trim()) {
      const filteredEmails = mockEmails.filter(email =>
        email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.body.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setEmails(filteredEmails);
    } else {
      setEmails(mockEmails);
    }
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Email selection functionality
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedEmails(emails.map(email => email.id));
    } else {
      setSelectedEmails([]);
    }
  };

  const handleEmailSelect = (emailId, e) => {
    e.stopPropagation();
    if (selectedEmails.includes(emailId)) {
      setSelectedEmails(selectedEmails.filter(id => id !== emailId));
    } else {
      setSelectedEmails([...selectedEmails, emailId]);
    }
  };

  // Label management
  const addLabelToEmail = (emailId, labelName) => {
    setEmails(emails.map(email => {
      if (email.id === emailId && !email.labels.includes(labelName)) {
        return { ...email, labels: [...email.labels, labelName] };
      }
      return email;
    }));
  };

  const removeLabelFromEmail = (emailId, labelName) => {
    setEmails(emails.map(email => {
      if (email.id === emailId) {
        return { ...email, labels: email.labels.filter(label => label !== labelName) };
      }
      return email;
    }));
  };

  const toggleLabelDropdown = (emailId) => {
    setShowLabelDropdown(prev => ({
      ...prev,
      [emailId]: !prev[emailId]
    }));
  };

  const toggleLabelSuggestions = (emailId) => {
    setShowLabelSuggestions(prev => ({
      ...prev,
      [emailId]: !prev[emailId]
    }));
  };

  const handleAddLabel = (emailId) => {
    const labelName = newLabelInput[emailId]?.trim();
    if (labelName) {
      addLabelToEmail(emailId, labelName);
      setNewLabelInput(prev => ({ ...prev, [emailId]: '' }));
      setShowLabelSuggestions(prev => ({ ...prev, [emailId]: false }));
    }
  };

  const handleNewLabelKeyPress = (e, emailId) => {
    if (e.key === 'Enter') {
      handleAddLabel(emailId);
    }
  };

  return (
    <>
      <div className="topbar">
        <span className="top-group">
          <img src="favicon.png" className="logo-icon" alt="AP-Email" />
          <strong>{currentLabel}</strong>
        </span>
        
        {/* Enhanced search bar */}
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Search mail..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleSearchKeyPress}
            className="search-input"
          />
          <button onClick={handleSearch} className="search-button">
            🔍
          </button>
        </div>

        {/* Select all checkbox */}
        <div className="select-all-container">
          <input
            type="checkbox"
            id="select-all"
            checked={selectedEmails.length === emails.length && emails.length > 0}
            onChange={handleSelectAll}
            className="checkbox"
          />
          <label htmlFor="select-all">Select All</label>
        </div>
      </div>

      <div className="sidebar">
        {mockLabels.map(label => (
          <p 
            key={label} 
            className={`clickable ${currentLabel === label ? 'active-label' : ''}`}
            onClick={() => setCurrentLabel(label)}
          >
            {label}
          </p>
        ))}
      </div>

      <div className="main">
        <div className="tabs">
          <div className="tab active">Primary</div>
          <div className="tab">Social</div>
          <div className="tab">Promotions</div>
        </div>

        <div className="email-list">
          {emails.map(email => (
            <div key={email.id} className="email-row">
              <input
                type="checkbox"
                checked={selectedEmails.includes(email.id)}
                onChange={(e) => handleEmailSelect(email.id, e)}
                className="email-checkbox"
              />
              
              <div className="email-content">
                <span className="subject">{email.subject}</span>
                
                {/* Label management between subject and date */}
                <div className="email-labels">
                  {email.labels.slice(0, 3).map(label => (
                    <span key={label} className="label-tag">
                      {label}
                      <button 
                        className="remove-label"
                        onClick={() => removeLabelFromEmail(email.id, label)}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  
                  {email.labels.length > 3 && (
                    <div className="label-dropdown-container">
                      <button 
                        className="more-labels"
                        onClick={() => toggleLabelDropdown(email.id)}
                      >
                        +{email.labels.length - 3} more
                      </button>
                      {showLabelDropdown[email.id] && (
                        <div className="label-dropdown">
                          {email.labels.slice(3).map(label => (
                            <div key={label} className="dropdown-label">
                              {label}
                              <button 
                                className="remove-label"
                                onClick={() => removeLabelFromEmail(email.id, label)}
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  
                  <button 
                    className="add-label-btn"
                    onClick={() => toggleLabelSuggestions(email.id)}
                  >
                    + Add Label
                  </button>
                  
                  {showLabelSuggestions[email.id] && (
                    <div className="label-suggestions">
                      <input
                        type="text"
                        placeholder="Enter label name..."
                        value={newLabelInput[email.id] || ''}
                        onChange={(e) => setNewLabelInput(prev => ({
                          ...prev,
                          [email.id]: e.target.value
                        }))}
                        onKeyPress={(e) => handleNewLabelKeyPress(e, email.id)}
                        className="label-input"
                      />
                      
                      <div className="suggestions-list">
                        {mockLabels
                          .filter(label => !email.labels.includes(label))
                          .map(label => (
                            <button
                              key={label}
                              className="suggestion-item"
                              onClick={() => addLabelToEmail(email.id, label)}
                            >
                              {label}
                            </button>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <span className="body">{email.body}</span>
              </div>
              
              <span className="email-date">{email.date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* New Email Button */}
      <button className="new-email-btn" title="New Email">
        +
      </button>
    </>
  );
}

export default App;

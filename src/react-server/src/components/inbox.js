import React, { useState, useEffect } from 'react';
import '../styles/inbox.css';
import ApiService from '../ApiService';

const Inbox = () => {
  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [emails, setEmails] = useState([]);
  const [allEmails, setAllEmails] = useState([]);
  const [labels, setLabels] = useState([]);
  const [currentLabel, setCurrentLabel] = useState('Inbox');
  const [showLabelDropdown, setShowLabelDropdown] = useState({});
  const [showLabelSuggestions, setShowLabelSuggestions] = useState({});
  const [newLabelInput, setNewLabelInput] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useDarkMode();

  // Default labels for all users.
  const defaultLabels = [
    {"name" : "Inbox", "photo_asset" : "misc/inbox_icon.png"},
    {"name" : "Starred", "photo_asset" : "misc/star_icon.png"},
    {"name" : "Sent", "photo_asset" : "misc/send_icon.png"},
    {"name" : "Draft", "photo_asset" : "misc/draft_icon.png"},
    {"name" : "Spam", "photo_asset" : "misc/spam_icon.png"},
    {"name" : "Trash", "photo_asset" : "misc/delete_icon.png"}
  ];

  // Load initial data from backend
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        // Load emails and labels from backend
        const [emailsData, labelsData] = await Promise.all([
          ApiService.getUserEmails(),
          ApiService.getAllLabels()
        ]);
        
        setAllEmails(emailsData || []);
        setEmails(emailsData || []);
        setLabels(labelsData || []);
      } catch (err) {
        console.error('Failed to load data:', err);
        setError('Failed to load data from server. Using offline mode.');
        
        // Fallback to mock data
        const mockEmails = [
          {
            id: 1,
            to: ["gabi@email.com, brodi@email.com"],
            from: "omer@email.com",
            subject: "ETL",
            body: "Equipment Return Instructions",
            date: "Mar 31",
            labels: ["Work"]
          },
          {
            id: 2,
            to: ["gabi@email.com, brodi@email.com"],
            from: "brodi@email.com",
            subject: "Meeting Tomorrow",
            body: "Don't forget about our team meeting at 2 PM",
            date: "Apr 1",
            labels: ["Important", "Meetings"]
          },
          {
            id: 3,
            to: ["gabi@email.com, brodi@email.com"],
            from: "gabi@email.com",
            subject: "Newsletter",
            body: "Weekly tech updates and industry news",
            date: "Apr 2",
            labels: ["Newsletter"]
          },
          {
            id: 4,
            to: ["gabi@email.com, brodi@email.com"],
            from: "bodek@email.com",
            subject: "Project Update",
            body: "Status report on the current development phase",
            date: "Apr 3",
            labels: ["Work", "Updates", "Development"]
          }
        ];
        
        const mockLabels = ["Work", "Important", "Meetings", "Newsletter", "Updates", "Development"];
        
        setAllEmails(mockEmails);
        setEmails(mockEmails);
        setLabels(mockLabels);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);  // Search functionality with real-time filtering

  useEffect(() => {
    if (searchQuery.trim()) {
      const filteredEmails = allEmails.filter(email =>
        email.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.body.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setEmails(filteredEmails);
    } else {
      setEmails(allEmails);
    }
  }, [searchQuery, allEmails]);

  const handleSearch = () => {
    // Search is now handled by useEffect for real-time filtering
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
  const addLabelToEmail = async (emailId, labelName) => {
    try {
      const email = emails.find(e => e.id === emailId);
      if (!email) return;

      const currentLabels = Array.isArray(email.label) ? email.label : (email.label ? [email.label] : []);
      if (!currentLabels.includes(labelName)) {
        const newLabels = [...currentLabels, labelName];
        
        // Update backend
        await ApiService.updateEmail(email.mail_id || emailId, { label: newLabels });
        
        // Update local state
        setEmails(emails.map(e => {
          if (e.id === emailId) {
            return { ...e, labels: newLabels, label: newLabels };
          }
          return e;
        }));
        
        setAllEmails(allEmails.map(e => {
          if (e.id === emailId) {
            return { ...e, labels: newLabels, label: newLabels };
          }
          return e;
        }));
      }
    } catch (error) {
      console.error('Failed to add label:', error);
      // Fallback to local update only
      setEmails(emails.map(email => {
        if (email.id === emailId && !email.label.includes(labelName)) {
          return { ...email, labels: [...email.label, labelName] };
        }
        return email;
      }));
    }
  };

  const removeLabelFromEmail = async (emailId, labelName) => {
    try {
      const email = emails.find(e => e.id === emailId);
      if (!email) return;

      const currentLabels = Array.isArray(email.label) ? email.label : (email.label ? [email.label] : []);
      const newLabels = currentLabels.filter(label => label !== labelName);
      
      // Update backend
      await ApiService.updateEmail(email.mail_id || emailId, { label: newLabels });
      
      // Update local state
      setEmails(emails.map(e => {
        if (e.id === emailId) {
          return { ...e, labels: newLabels, label: newLabels };
        }
        return e;
      }));
      
      setAllEmails(allEmails.map(e => {
        if (e.id === emailId) {
          return { ...e, labels: newLabels, label: newLabels };
        }
        return e;
      }));
    } catch (error) {
      console.error('Failed to remove label:', error);
      // Fallback to local update only
      setEmails(emails.map(email => {
        if (email.id === emailId) {
          return { ...email, labels: email.label.filter(label => label !== labelName) };
        }
        return email;
      }));
    }
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
  
  // Filter emails by current label
  const filteredEmailsByLabel = emails.filter(email => {
    if (currentLabel === 'Inbox') return true;
    
    // Handle both backend format (email.label) and frontend format (email.label)
    const emailLabels = email.label || (Array.isArray(email.label) ? email.label : (email.label ? [email.label] : []));
    return emailLabels.includes(currentLabel);
  });

  const handleLabelClick = (label) => {
    setCurrentLabel(label);
  };

  const handleNewLabelKeyPress = (e, emailId) => {
    if (e.key === 'Enter') {
      handleAddLabel(emailId);
    }
  };

  return (
    <>
      {/* Top row display */}
      <div className="topbar">
        <div className="top-group">
          <img src="favicon.png" className="logo-icon" alt="AP-Email" />
          <strong>Inbox</strong>
          <div className="new-email-btn">
            <img src="misc/new_mail_icon.png" alt="AP-Email" />
            <span>Compose</span>
          </div>
        </div>
  
        {/* Fixed search bar */}
        <div className="search-container fixed-search">
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
  
        <div className="topbar-group">
          <button onClick={() => setDarkMode(!darkMode)} className="mode-btn">
            {darkMode ? 'Light-Mode' : 'Dark-Mode'}
          </button>
          <img src="misc/temp.png" className="topbar-pfp" alt="Profile" />
        </div>
      </div>
  
      <div className="sidebar">
        {/* Add default labels and user specific labels */}
        {defaultLabels.map(label => {
          const labelName = typeof label === 'string' ? label : label.name;
          return (
            <p
              key={labelName}
              className={`sidebar-item ${currentLabel === labelName ? 'sidebar-active-label' : ''}`}
              onClick={() => handleLabelClick(labelName)}
            >
              <img src={label.photo_asset} alt={label.name} />
              {labelName}
            </p>
          );
        })}
  
        <p className="sidebar-add-label-tab">
          <strong>Labels</strong>
          <button className="sidebar-add-label-btn">
            <img src="misc/plus_sign.png" alt="Add label" />
          </button>
        </p>
  
        {labels.map(label => {
          const labelName = typeof label === 'string' ? label : label.name;
          return (
            <p
              key={labelName}
              className={`sidebar-item ${currentLabel === labelName ? 'sidebar-active-label' : ''}`}
              onClick={() => handleLabelClick(labelName)}
            >
              <img src="misc/def_label_icon.png" alt={label.name} />
              {labelName}
            </p>
          );
        })}
      </div>
  
      <div className="main">
        {error && (
          <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>
            {error}
          </div>
        )}
  
        {loading ? (
          <div className="loading" style={{ textAlign: 'center', padding: '20px' }}>
            Loading emails...
          </div>
        ) : (
          <>
            <div className="tabs">
              {/* Select all checkbox adjacent to Primary tab */}
              <div className="tab-container">
                <div className="select-all-wrapper">
                  <input
                    type="checkbox"
                    id="select-all"
                    checked={selectedEmails.length === filteredEmailsByLabel.length && filteredEmailsByLabel.length > 0}
                    onChange={handleSelectAll}
                    className="checkbox"
                  />
                  <label htmlFor="select-all" className="select-all-label">Select All</label>
                </div>
                <div className="tab active" onClick={(e) => swapTab(e.target)}>Primary</div>
              </div>
              <div className="tab" onClick={(e) => swapTab(e.target)}>Social</div>
              <div className="tab" onClick={(e) => swapTab(e.target)}>Promotions</div>
            </div>
  
            {/* Load up emails with the proper labels */}
            <div className="email-list">
              {filteredEmailsByLabel.map(email => {
                const emailLabels = email.label || (Array.isArray(email.label) ? email.label : (email.label ? [email.label] : []));
  
                return (
                  <div key={email.id} className="email-row" onClick={() => openEmail(email)}>
                    <input
                      type="checkbox"
                      checked={selectedEmails.includes(email.id)}
                      onChange={(e) => handleEmailSelect(email.id, e)}
                      className="email-checkbox"
                    />
  
                    <div className="email-content">
                      <span className="from">{email.from}</span>
                      <span className="subject">{email.subject} - {email.body}</span>
                    </div>
  
                    {/* Labels displayed on the right side near the date */}
                    <div className="email-right-section">
                      <div className="email-labels">
                        {emailLabels.slice(0, 3).map(label => (
                          <span key={label} className="label-tag" onClick={() => handleLabelClick(label)}>
                            {label}
                            <button
                              className="remove-label"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeLabelFromEmail(email.id, label);
                              }}
                            >
                              ×
                            </button>
                          </span>
                        ))}
  
                        {emailLabels.length > 3 && (
                          <div className="label-dropdown-container">
                            <button
                              className="more-labels"
                              onClick={() => toggleLabelDropdown(email.id)}
                            >
                              +{emailLabels.length - 3} more
                            </button>
                            {showLabelDropdown[email.id] && (
                              <div className="label-dropdown">
                                {emailLabels.slice(3).map(label => (
                                  <div key={label} className="dropdown-label">
                                    <span onClick={() => handleLabelClick(label)}>{label}</span>
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
                              {
                                labels.filter(label => {
                                  const labelName = typeof label === 'string' ? label : label.name;
                                  return !emailLabels.includes(labelName);
                                })
                                .map(label => {
                                  const labelName = typeof label === 'string' ? label : label.name;
                                  return (
                                    <button
                                      key={labelName}
                                      className="suggestion-item"
                                      onClick={() => addLabelToEmail(email.id, label.id)}
                                    >
                                      {labelName}
                                    </button>
                                  );
                                })}
                            </div>
                          </div>
                        )}
                      </div>
  
                      <span className="email-date">{email.date || email.date_sent}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </>
  );  
}

/**
 * @brief Dark-Mode Hook
 */
function useDarkMode() {
  const [darkMode, setDarkMode] = useState(false);

  // Define once when used.
  useEffect(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved) setDarkMode(saved === 'true');
  }, []);

  // Toggles mode effect.
  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  return [darkMode, setDarkMode];
}


/**
 * @brief Swaps mail list type in inbox menu.
 */
function swapTab(el) {
  document.querySelectorAll('.tab').forEach(tab => {
    tab.classList.remove('active');
  });

  el.classList.add('active');
}

/**
 * @brief Opens page for viewing specific email
 */
function openEmail(id) {

}

export default Inbox;
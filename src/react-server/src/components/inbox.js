import React, { useState, useEffect } from 'react';
import '../styles/inbox.css';
import ApiService from '../ApiService';
import Topbar from './topbar.js';
import Sidebar from './sidebar.js';
import InboxPanel from './inboxPanel.js';
import { useAppContext } from '../context/appContext.js';

const Inbox = () => {
  // State management
  const { labels, currentLabel, setCurrentLabel, darkMode, setDarkMode, searchQuery, setSearchQuery, setLabels, error, setError } = useAppContext();
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [emails, setEmails] = useState([]);
  const [allEmails, setAllEmails] = useState([]);
  const [showLabelDropdown, setShowLabelDropdown] = useState({});
  const [showLabelSuggestions, setShowLabelSuggestions] = useState({});
  const [newLabelInput, setNewLabelInput] = useState({});
  const [loading, setLoading] = useState(true);

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
      {/* Topbar display */}
      <Topbar/>

      {/* Sidebar display */}
      <Sidebar/>

      {/* Inbox Panel display */}
      <InboxPanel
        loading={loading}
        selectedEmails={selectedEmails}
        filteredEmailsByLabel={filteredEmailsByLabel}
        handleSelectAll={handleSelectAll}
        handleEmailSelect={handleEmailSelect}
        handleLabelClick={handleLabelClick}
        removeLabelFromEmail={removeLabelFromEmail}
        toggleLabelDropdown={toggleLabelDropdown}
        showLabelDropdown={showLabelDropdown}
        toggleLabelSuggestions={toggleLabelSuggestions}
        showLabelSuggestions={showLabelSuggestions}
        addLabelToEmail={addLabelToEmail}
      />
    </>
  );  
}

/**
 * @brief Dark-Mode Hook
 */
function useDarkMode() {
  const [darkMode, setDarkMode] = useState(true);

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

export default Inbox;
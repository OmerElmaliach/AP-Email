import React, { useEffect } from 'react';
import '../styles/inbox.css';
import ApiService from '../ApiService';
import Topbar from './topbar.js';
import Sidebar from './sidebar.js';
import InboxPanel from './inboxPanel.js';
import { useAppContext } from '../context/appContext.js';

const Inbox = () => {
  const { searchQuery, setLabels, setError, setLoading, setEmails, allEmails, setAllEmails } = useAppContext();

  // Load initial data from backend
  useEffect(() => {
    const loadData = async () => {
      const defaultLabels = ["Inbox", "Starred", "Sent", "Draft", "Spam", "Trash"];
      
      try {
        setLoading(true);
        setError(null);
        // Load emails and labels from backend
        const [emailsData, labelsData] = await Promise.all([
          ApiService.getUserEmails(),
          ApiService.getAllLabels()
        ]);

        const filteredLabels = labelsData.filter(label => !defaultLabels.includes(label.name));
        
        setAllEmails(emailsData || []);
        setEmails(emailsData || []);
        setLabels(filteredLabels || []);
      } catch (err) {
        console.error('Failed to load data:', err);
        setError('Failed to load data from server. Using offline mode.');
        
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [setLoading, setError, setAllEmails, setEmails, setLabels]);  // Search functionality with real-time filtering

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
  }, [searchQuery, allEmails, setEmails]);

  return (
    <>
      {/* Topbar display */}
      <Topbar/>

      {/* Sidebar display */}
      <Sidebar/>

      {/* Inbox Panel display */}
      <InboxPanel/>
    </>
  );  
}


export default Inbox;
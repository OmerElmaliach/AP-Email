import '../styles/inboxpanel.css'
import ApiService from '../ApiService';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/appContext.js';

const InboxPanel = () => {
    const { setShowLabelDropdown, setShowLabelSuggestions, emails, allEmails, setEmails, error, labels, loading, selectedEmails, setAllEmails, showLabelDropdown, showLabelSuggestions, currentLabel, setCurrentLabel, setSelectedEmails} = useAppContext();
    const navigate = useNavigate();

    const handleEmailSelect = (emailId, e) => {
      e.stopPropagation();
      if (selectedEmails.includes(emailId)) {
        setSelectedEmails(selectedEmails.filter(id => id !== emailId));
      } else {
        setSelectedEmails([...selectedEmails, emailId]);
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

    // Filter emails by current label
    const filteredEmailsByLabel = emails.filter(email => {
      if (currentLabel === 'Inbox') return true;
      
      // Handle both backend format (email.label) and frontend format (email.label)
      const emailLabels = email.label || (Array.isArray(email.label) ? email.label : (email.label ? [email.label] : []));
      return emailLabels.includes(currentLabel);
    });

    return (
      <>
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
                <div key={email.id} className="email-row" onClick={() => navigate('/email/' + email.mail_id)}>
                  <input
                    type="checkbox"
                    checked={selectedEmails.includes(email.id)}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => handleEmailSelect(email.id, e)}
                    className="email-checkbox"
                  />

                  <div className="email-content">
                    <span className="from">{email.from}</span>
                    <span className="subject">{email.subject} - {email.body}</span>
                  </div>

                  {/* Labels displayed on the right side near the date */}
                  <div className="email-right-section">
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
    )
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

export default InboxPanel;
import '../styles/inboxpanel.css'
import ApiService from '../ApiService';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/appContext.js';
import { useEffect } from 'react';

const InboxPanel = () => {
    const { emails, error, loading, currentLabel, emailLabels, setEmailLabels } = useAppContext();
    const navigate = useNavigate();

    // Filter emails by current label
    useEffect(() => {
      const fetchAndFilterEmails = async () => {
        try {
          let labels = await ApiService.getAllLabels();
          let currentlabelId = labels.find(label => label.name === currentLabel).id;
          let newEmails = emails.filter(email => email.label.includes(currentlabelId));
          setEmailLabels(newEmails);
        } catch (error) {
          console.error("Error fetching labels:", error);
        }
      };
    
      fetchAndFilterEmails();
    }, [currentLabel, emails, setEmailLabels] );

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
              <div className="tab active" onClick={(e) => swapTab(e.target)}>Primary</div>
              <div className="tab" onClick={(e) => swapTab(e.target)}>Social</div>
              <div className="tab" onClick={(e) => swapTab(e.target)}>Promotions</div>
            </div>
          </div>

          {/* Load up emails with the proper labels */}
          <div className="email-list">
            {emailLabels.map(email => {
              return (
                <div key={email.id} className="email-row" onClick={() => navigate('/email/' + email.mail_id)}>
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
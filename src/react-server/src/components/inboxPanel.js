import '../styles/inboxpanel.css'
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/appContext.js';

const InboxPanel = ({ loading, selectedEmails, filteredEmailsByLabel, handleSelectAll, toggleLabelSuggestions, showLabelSuggestions, 
    handleEmailSelect, handleLabelClick, removeLabelFromEmail, toggleLabelDropdown, showLabelDropdown, addLabelToEmail }) => {
      const { error, labels } = useAppContext();
      const navigate = useNavigate();
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
                        <div className="email-labels">
                          {emailLabels.slice(0, 3).map(label => (
                            <span key={label} className="label-tag" onClick={(e) => {
                              handleLabelClick(label);
                              e.stopPropagation();
                              }} >
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
                                onClick={(e) => {
                                  toggleLabelDropdown(email.id);
                                  e.stopPropagation();
                                }}
                              >
                                +{emailLabels.length - 3} more
                              </button>
                              {showLabelDropdown[email.id] && (
                                <div className="label-dropdown">
                                  {emailLabels.slice(3).map(label => (
                                    <div key={label} className="dropdown-label">
                                      <span onClick={(e) => {
                                        handleLabelClick(label);
                                        e.stopPropagation();
                                        }}>{label}</span>
                                      <button
                                        className="remove-label"
                                        onClick={(e) => {
                                          removeLabelFromEmail(email.id, label);
                                          e.stopPropagation();
                                        }}
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
                            onClick={(e) => {
                              toggleLabelSuggestions(email.id);
                              e.stopPropagation();
                            }}
                          >
                            + Add Label
                          </button>
    
                          {showLabelSuggestions[email.id] && (
                            <div className="label-suggestions">
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
                                        onClick={(e) => {
                                          addLabelToEmail(email.id, label.id);
                                          e.stopPropagation();
                                        }}
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
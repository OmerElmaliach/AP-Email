import '../styles/emailDisplay.css';
import ApiService from '../ApiService';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ErrorPage from './errorPage.js'
import Topbar from './topbar.js'
import Sidebar from './sidebar.js'
import { useAppContext } from '../context/appContext.js';
import { useNavigate } from 'react-router-dom';
const urlRegex = /(?<![a-zA-Z0-9])((https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})(\/\S*)?/g;

const EmailDisplay = () => {
    const [showToast, setShowToast] = useState(false);
    const [emailLabels, setEmailLabels] = useState([]);
    const { error, setError, darkMode, showLabelSuggestions, setShowLabelSuggestions, labels } = useAppContext();
    const [email, setEmail] = useState([]);
    const { id } = useParams(); // Get email id.
    const navigate = useNavigate();

    useEffect(() => {
        const loadData = async () => {
            try {
                const [emailData] = await Promise.all([
                    ApiService.getEmailById(id)
                ]);
                setEmail(emailData);

                const labelResponses = await Promise.all(
                    (emailData.label || []).map(labelId =>
                        ApiService.getLabelById(labelId)
                    )
                );
                setEmailLabels(labelResponses);
                
            } catch (err) {
                setError("Request Failed");
            }
        }

        loadData();
    }, [id, setError]);

    const removeLabelFromEmail = async (labelName) => {
        try {
            const newLabels = emailLabels.filter(label => label.name !== labelName);
            const newLabelIds = newLabels.map(label => label.id);
            
            // Update backend
            await ApiService.updateEmail(email.mail_id, { label: newLabelIds });
            
            // Update local state
            setEmailLabels(newLabels);
        } catch (error) {
            console.error('Failed to remove label:', error);
        }
    };
  
    // Label management
    const addLabelToEmail = async (label) => {
        try {
            const newLabels = [...emailLabels, label]
            const newLabelIds = newLabels.map(label => label.id);
            
            // Update backend
            await ApiService.updateEmail(email.mail_id, { label: newLabelIds });
            
            // Update local state
            setEmailLabels(newLabels);
        } catch (error) {
            console.error('Failed to add label:', error);
        }
    };

    // Reports an email as spam.
    const reportSpam = async () => {
        if (!emailLabels.some(label => label.id === "spam")) {
            let spamLabel = await ApiService.getLabelById("spam");
            const newLabels = [...emailLabels, spamLabel]
            const newLabelIds = newLabels.map(label => label.id);

            // Save urls appearing in the mail's subject or body.
            let urlsSubject = email.subject.match(urlRegex) || [];
            let urlsBody = email.body.match(urlRegex) || [];
            
            try {
                for (let i = 0; i < urlsSubject.length; i++) {
                    await ApiService.addToBlacklist({ "id" : urlsSubject[i] });
                }
        
                for (let i = 0; i < urlsBody.length; i++) {
                    await ApiService.addToBlacklist({ "id" : urlsBody[i] });
                }

                await ApiService.updateEmail(email.mail_id, { label : newLabelIds });
                setEmailLabels(newLabels);
            } catch (e) {
                console.log("Failed to report spam");
            }
        }
    }

    // Reports an email as spam.
    const starEmail = async () => {
        if (!emailLabels.some(label => label.id === "starred")) {
            let starLabel = await ApiService.getLabelById("starred");
            const newLabels = [...emailLabels, starLabel]
            const newLabelIds = newLabels.map(label => label.id);
            
            try {
                await ApiService.updateEmail(email.mail_id, { label : newLabelIds });
                setEmailLabels(newLabels);
            } catch (e) {
                console.log("Failed to star email");
            }
        }
    }

    // Deletes an email.
    const deleteEmail = async () => {
        try {
            // Update backend
            await ApiService.deleteEmail(email.mail_id);
            setShowLabelSuggestions(false);
        } catch (error) {
            console.error('Failed to remove email:', error);
        }
    }

    const showDeleteMessage = () => {
        setShowToast(true);
        setTimeout(() => {
            setShowToast(false);
        }, 2000);
    };



    return (
        <>
        {error ? (
            <ErrorPage/>
        ) : (
            <>
            {/* Topbar display */}
            <Topbar/>

            {/* Sidebar display */}
            <Sidebar/>

            {/* Email information display */}
            <div className="main">
            {showToast && (
                <div className="delete-toast">
                    Email deleted successfully!
                </div>
            )}
                <div className='toolbar-container'>
                    <img src={darkMode ? '../../misc/emailDisplay/arrow_back_ic.png' : '../../misc/emailDisplay/light_arrow_back_ic.png'} 
                        className='toolbar-btn' 
                        onClick={() => navigate('/')} 
                        title='Back to Inbox' 
                        alt='Go back'
                    />
                    <div className="vertical-divider"></div>
                    <img src={darkMode ? '../../misc/emailDisplay/report_spam_ic.png' : '../../misc/emailDisplay/light_report_spam_ic.png'} 
                        className='toolbar-btn' 
                        onClick={() => reportSpam()} 
                        title='Report Spam' 
                        alt='Report Spam'
                    />
                    <img src={darkMode ? '../../misc/emailDisplay/star_ic.png' : '../../misc/emailDisplay/light_star_ic.png'} 
                        className='toolbar-btn' 
                        onClick={() => starEmail()} 
                        title='Star Email' 
                        alt='Star'
                    />
                    <img src={darkMode ? '../../misc/emailDisplay/delete_ic.png' : '../../misc/emailDisplay/light_delete_ic.png'} 
                        className='toolbar-btn' 
                        onClick={() => {
                            showDeleteMessage()
                            deleteEmail();
                            setTimeout(() => {
                                navigate('/');
                            }, 750);
                        }} title='Delete Email' alt='Delete Email'/>
                    {Array.isArray(email.labels) && email.labels.includes('draft') && (
                    <img
                      src={darkMode ? '../../misc/emailDisplay/box_edit_dark.png' : '../../misc/emailDisplay/box_edit_light.png'}
                      className='toolbar-btn'
                      onClick={() => navigate('/create-mail', { state: { email } })}
                      title='Edit draft'
                      alt='Edit draft'
                    />)}
                    
                </div>
                <hr className="line-divider" />
                <div className='subject'>
                    <div className='subject-main'>
                    <h1>{email.subject}</h1>
                    <div className="email-labels">
                      {emailLabels.map(label => (
                        <span key={label.id} className="label-tag">
                          {label.name}
                          <button
                            className="remove-label"
                            onClick={() => {
                              removeLabelFromEmail(label.name);
                            }}
                          >
                            ×
                          </button>
                        </span>
                      ))}

                      <button
                        className="add-label-btn"
                        onClick={() => {
                            setShowLabelSuggestions(!showLabelSuggestions)
                        }}
                      >
                        + Add Label
                      </button>

                      {showLabelSuggestions && (
                        <div className="label-suggestions">
                            <div className="suggestions-list">
                            {
                                labels.filter(label => {
                                    return !emailLabels.some(existing => existing.id === label.id);
                                })
                                .map(label => (
                                    <button
                                    key={label.id}
                                    className="suggestion-item"
                                    onClick={() => {
                                        addLabelToEmail(label);
                                    }}
                                    >
                                    {label.name}
                                    </button>
                                ))
                            }
                            </div>
                        </div>
                        )}
                    </div>
                    </div>
                    <div className='subject-date'>
                        Date sent: {email.date_sent}
                    </div>
                </div>
                <p className='undersubject-lines'>
                    <strong>From:</strong> {email.from} <br />
                    <strong>Recipients:</strong> {Array(email.to).join(",")} <br />
                </p>
                <div className='email-body-box'>
                    {email.body}
                </div>
            </div>
            </>
        )}
        </>
    )
}

export default EmailDisplay;
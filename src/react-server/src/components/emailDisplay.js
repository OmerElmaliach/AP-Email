import '../styles/emailDisplay.css';
import ApiService from '../ApiService';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ErrorPage from './errorPage.js'
import Topbar from './topbar.js'
import Sidebar from './sidebar.js'
import { useAppContext } from '../context/appContext.js';
import { useNavigate } from 'react-router-dom';

const EmailDisplay = () => {
    const [showToast, setShowToast] = useState(false);
    const { error, setError, darkMode } = useAppContext();
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
            } catch (err) {
                setError("Request Failed");
            }
        }

        loadData();
    }, [id, setError]);

    // Reports an email as spam.
    const reportSpam = (emailId) => {
        // TODO
    }

    // Deletes an email.
    const deleteEmail = (emailId) => {
        // TODO
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
                        onClick={() => reportSpam(email.mail_id)} 
                        title='Report Spam' 
                        alt='Report Spam'
                    />
                    <img src={darkMode ? '../../misc/emailDisplay/delete_ic.png' : '../../misc/emailDisplay/light_delete_ic.png'} 
                        className='toolbar-btn' 
                        onClick={() => {
                            showDeleteMessage()
                            deleteEmail(email.id);
                            setTimeout(() => {
                                navigate('/');
                            }, 750);
                        }} title='Delete Email' alt='Delete Email'/>
                </div>
                <hr className="line-divider" />
                <div className='subject'>
                    <h1>{email.subject}</h1>
                    <div className='subject-date'>
                        Date sent: {email.date_sent}
                    </div>
                </div>
                <p className='undersubject-lines'>
                    <strong>From:</strong> {email.from} <br />
                    <strong>Recipients:</strong> {email.to} <br />
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
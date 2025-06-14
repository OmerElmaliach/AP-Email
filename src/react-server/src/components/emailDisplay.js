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
    const { error, setError } = useAppContext();
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
                    <img src='../../misc/arrow_back_icon.png' className='toolbar-btn' onClick={() => navigate('/')} title='Back to Inbox' alt='Go back'/>
                    <div className="vertical-divider"></div>
                    <img src='../../misc/report_spam_icon.png' className='toolbar-btn' onClick={() => reportSpam(email.mail_id)} title='Report Spam' alt='Report Spam'/>
                    <img src='../../misc/light_delete_icon.png' className='toolbar-btn' onClick={() => {
                        showDeleteMessage()
                        deleteEmail(email.id);
                        setTimeout(() => {
                            navigate('/');
                          }, 750);
                        }} title='Delete Email' alt='Delete Email'/>
                </div>
                <hr className="line-divider" />
                <h1>{email.subject}</h1>
                <p>
                    From: {email.from} <br />
                    Body: {email.body}
                </p>
            </div>
            </>
        )}
        </>
    )
}

export default EmailDisplay;
import '../styles/emailDisplay.css';
import ApiService from '../ApiService';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ErrorPage from './errorPage.js'

const EmailDisplay = () => {
    const [error, setError] = useState(undefined);
    const [email, setEmail] = useState([]);
    const { id } = useParams(); // Get email id.

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
    }, [id]);

    return (
        <>
        {error != undefined ? (
            <ErrorPage
                error={error}
            />
        ) : (
            <>
            <div className="topbar">
                <div className="top-group">
                    <img src="../favicon.png" className="logo-icon" alt="AP-Email" />
                    <strong>Inbox</strong>
                    <div className="new-email-btn">
                        <img src="../misc/new_mail_icon.png" alt="AP-Email" />
                        <span>Compose</span>
                    </div>
                </div>

                <div className="topbar-group">
                    
                    <img src="../misc/temp.png" className="topbar-pfp" alt="Profile" />
                </div>
            </div>
            </>
        )}
        </>
    )
}

export default EmailDisplay;
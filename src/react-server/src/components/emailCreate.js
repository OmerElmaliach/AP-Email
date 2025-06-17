import '../styles/emailCreate.css';
import ApiService from '../ApiService';
import Topbar from './topbar.js'
import Sidebar from './sidebar.js'
import { useState } from 'react';
import { useAppContext } from '../context/appContext.js';
import { useNavigate } from 'react-router-dom';

const EmailCreate = () => {
    const [toastMessage, setToastMessage] = useState('');
    const [toMails, setTo] = useState('');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [toast, setToast] = useState(false);
    const { darkMode } = useAppContext();
    const navigate = useNavigate();

    const handleSend = async () => {
        const to = toMails.split(" ");
        try {
            await ApiService.createEmail({ to, subject, body });
            setToastMessage("Email Sent")
            setToast(true);
            setTimeout(() => {
                setToast(false);
                navigate('/');
            }, 1500);
        } catch (err) {
            setToastMessage("Failed to send email")
            setToast(true);
            setTimeout(() => {
                setToast(false);
            }, 1500);
        }
    };

    const handleDraft = async () => {
        const to = toMails.split(" ");
        try {
            if (subject) {
                await ApiService.createEmail({ to, subject, body, label: ["draft"] });
                setToastMessage("Draft Saved")
                setToast(true);
                setTimeout(() => {
                    setToast(false);
                    navigate('/');
                }, 1500);
            } else {
                setToastMessage("Undefined fields")
                setToast(true);
                setTimeout(() => {
                    setToast(false);
                }, 1500);
            }
        } catch (e) {
            setToastMessage("Failed to save to draft")
            setToast(true);
            setTimeout(() => {
                setToast(false);
            }, 1500);
        }
    };

    return (
        <>
        {/* Topbar display */}
        <Topbar/>

        {/* Sidebar display */}
        <Sidebar/>

        <div className="main">
            {toast && (
                <div className="toast">
                    {toastMessage}
                </div>
            )}
            <div className='toolbar-container'>
                <img src={darkMode ? '../../misc/emailCreate/arrow_back_ic.png' : '../../misc/emailCreate/light_arrow_back_ic.png'} 
                    className='toolbar-btn' 
                    onClick={() => navigate('/')} 
                    title='Back to Inbox' 
                    alt='Go back'
                />
                <div className="vertical-divider"></div>
                <img src={darkMode ? '../../misc/emailCreate/draft_ic.png' : '../../misc/emailCreate/light_draft_ic.png'} 
                    className='toolbar-btn' 
                    onClick={() => handleDraft()} 
                    title='Save To Draft' 
                    alt='To draft'
                />
                <img src={darkMode ? '../../misc/emailCreate/arrow_forward_ic.png' : '../../misc/emailCreate/light_arrow_forward_ic.png'} 
                    className='toolbar-btn' 
                    onClick={() => handleSend()} 
                    title='Send Email' 
                    alt='Send'
                />
            </div>
            <hr className="line-divider" />
            <form className="email-compose">
                <input
                    type="email"
                    placeholder="To"
                    value={toMails}
                    onChange={(e) => setTo(e.target.value)}
                    className="compose-input"
                    required
                />
                <input
                    type="text"
                    placeholder="Subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="compose-input"
                />
                <textarea
                    placeholder="Body"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className="compose-body"
                    rows={10}
                />
            </form>
        </div>
        </>
    )
}

export default EmailCreate;
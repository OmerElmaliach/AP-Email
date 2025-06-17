import '../styles/emailCreate.css';
import ApiService from '../ApiService';
import Topbar from './topbar.js'
import Sidebar from './sidebar.js'
import { useState } from 'react';
import { useAppContext } from '../context/appContext.js';
import { useNavigate } from 'react-router-dom';

const EmailCreate = () => {
    const [toMails, setTo] = useState('');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [draftToast, setDraftToast] = useState(false);
    const [sentToast, setSentToast] = useState(false);
    const { darkMode } = useAppContext();
    const navigate = useNavigate();

    const handleSend = async () => {
        const to = toMails.split(" ");
        await ApiService.createEmail({ to, subject, body });
        setSentToast(true);
        setTimeout(() => {
            setSentToast(false);
            navigate('/');
        }, 1500);
    };

    const handleDraft = async () => {
        const to = toMails.split(" ");
        await ApiService.createEmail({ to, subject, body, draft: true });
        setDraftToast(true);
        setTimeout(() => setDraftToast(false), 1500);
    };

    return (
        <>
        {/* Topbar display */}
        <Topbar/>

        {/* Sidebar display */}
        <Sidebar/>

        <div className="main">
            {draftToast && (
                <div className="toast">
                    Email Sent to Draft
                </div>
            )}
            {sentToast && (
                <div className="toast">
                    Email Sent Successfully
                </div>
            )}
            <div className='toolbar-container'>
                <img src={darkMode ? '../../misc/emailCreate/arrow_back_ic.png' : '../../misc/emailCreate/light_arrow_back_ic.png'} className='toolbar-btn' onClick={() => navigate('/')} title='Back to Inbox' alt='Go back'/>
                <div className="vertical-divider"></div>
                <img src={darkMode ? '../../misc/emailCreate/draft_ic.png' : '../../misc/emailCreate/light_draft_ic.png'} className='toolbar-btn' onClick={() => handleDraft()} title='Save To Draft' alt='To draft'/>
                <img src={darkMode ? '../../misc/emailCreate/arrow_forward_ic.png' : '../../misc/emailCreate/light_arrow_forward_ic.png'} className='toolbar-btn' onClick={() => handleSend()} title='Send Email' alt='Send'/>
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
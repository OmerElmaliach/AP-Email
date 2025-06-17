import '../styles/emailDisplay.css';
import ApiService from '../ApiService';
import Topbar from './topbar.js'
import Sidebar from './sidebar.js'
import { useState } from 'react';
import { useAppContext } from '../context/appContext.js';
import { useNavigate } from 'react-router-dom';

const EmailCreate = () => {
    const [draftToast] = useState(false);
    const [sentToast] = useState(false);
    const { darkMode } = useAppContext();
    const navigate = useNavigate();

    return (
        <>
        {/* Topbar display */}
        <Topbar/>

        {/* Sidebar display */}
        <Sidebar/>

        <div className="main">
            {draftToast && (
                <div className="delete-toast">
                    Email Sent to Draft
                </div>
            )}
            {sentToast && (
                <div className="delete-toast">
                    Email Sent Successfully
                </div>
            )}
                <div className='toolbar-container'>
                    <img src={darkMode ? '../../misc/emailCreate/arrow_back_ic.png' : '../../misc/emailCreate/light_arrow_back_ic.png'} className='toolbar-btn' onClick={() => navigate('/')} title='Back to Inbox' alt='Go back'/>
                    <div className="vertical-divider"></div>
                    <img src={darkMode ? '../../misc/emailCreate/draft_ic.png' : '../../misc/emailCreate/light_draft_ic.png'} className='toolbar-btn' title='Save To Draft' alt='To draft'/>
                </div>
                <hr className="line-divider" />
            </div>
        </>
    )
}

export default EmailCreate;
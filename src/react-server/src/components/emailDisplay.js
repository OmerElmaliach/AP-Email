import '../styles/emailDisplay.css';
import ApiService from '../ApiService';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ErrorPage from './errorPage.js'
import Topbar from './topbar.js'
import Sidebar from './sidebar.js'
import { useAppContext } from '../context/appContext.js';

const EmailDisplay = () => {
    const { error, setError } = useAppContext();
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
            <ErrorPage/>
        ) : (
            <>
            {/* Topbar display */}
            <Topbar/>

            {/* Sidebar display */}
            <Sidebar/>
            </>
        )}
        </>
    )
}

export default EmailDisplay;
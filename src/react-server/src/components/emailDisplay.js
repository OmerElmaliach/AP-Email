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
                {email.from}
            </>
        )}
        </>
    )
}

export default EmailDisplay;
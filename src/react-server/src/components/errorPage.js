import '../styles/errorPage.css'
import { useAppContext } from '../context/appContext.js';

const ErrorPage = () => {
    const { error } = useAppContext();
    return (
        <>
        <div className="center-text">
            <h1>404</h1>
            <h2>{error == undefined ? "Page Not Found" : error}</h2>
        </div>
        </>
    )
}

export default ErrorPage;
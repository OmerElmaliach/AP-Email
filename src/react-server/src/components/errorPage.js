import '../styles/errorPage.css'

const ErrorPage = ({ error }) => {
    
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
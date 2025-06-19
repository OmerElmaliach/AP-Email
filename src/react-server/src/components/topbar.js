import '../styles/topbar.css';
import { useAppContext } from '../context/appContext.js';
import { useNavigate, useLocation, useMatch } from 'react-router-dom';
import { useEffect, useState } from 'react';
import UserProfile from './UserProfile';

const Topbar = () => {
    const { searchQuery, setSearchQuery, darkMode, setDarkMode } = useAppContext();
    const [showSearch, setShowSearch] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();

    const isEmailPage = useMatch('/email/:id');
    const isCreateMailPage = location.pathname === '/create-mail';

    useEffect(() => {
        if (isEmailPage || isCreateMailPage)
          setShowSearch(false);
      }, [isEmailPage, isCreateMailPage]);

    return (
        <>
        <div className="topbar">
            <div className="top-group">
                <img src="../../favicon.png" className="logo-icon" alt="AP-Email" />
                <strong>Inbox</strong>
                <div className="new-email-btn" onClick={() => navigate('/create-mail')}>
                    <img src="../../misc/new_mail_icon.png" alt="AP-Email" />
                    <span>Compose</span>
                </div>
            </div>
            {showSearch ? (
                <>
                {/* Fixed search bar */}
                <div className="search-container fixed-search">
                    <input
                        type="text"
                        placeholder="Search mail..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                    <button className="search-button">
                        🔍
                    </button>
                </div>
                </>
            ) : null}
            <div className="topbar-group">
                <button onClick={() => setDarkMode(!darkMode)} className="mode-btn">
                    {darkMode ? 'Light-Mode' : 'Dark-Mode'}
                </button>
                <UserProfile />
            </div>
        </div>
        </>
    )
}

export default Topbar;
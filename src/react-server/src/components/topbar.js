import '../styles/topbar.css';

const Topbar = ({ searchQuery, setSearchQuery, darkMode, setDarkMode }) => {
    return (
        <>
        <div className="topbar">
            <div className="top-group">
                <img src="favicon.png" className="logo-icon" alt="AP-Email" />
                <strong>Inbox</strong>
                <div className="new-email-btn">
                    <img src="misc/new_mail_icon.png" alt="AP-Email" />
                    <span>Compose</span>
                </div>
            </div>

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
            <div className="topbar-group">
                <button onClick={() => setDarkMode(!darkMode)} className="mode-btn">
                    {darkMode ? 'Light-Mode' : 'Dark-Mode'}
                </button>
                <img src="misc/temp.png" className="topbar-pfp" alt="Profile" />
            </div>
        </div>
        </>
    )
}

export default Topbar;
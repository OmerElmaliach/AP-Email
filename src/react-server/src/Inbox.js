import { useEffect, useState } from 'react';
import './App.css';

function Inbox() {
  // DarkMode Toggle
  const [darkMode, setDarkMode] = useDarkMode();

  return (
    <>
      <div className="topbar">
        <div className="topbar-group">
          <img src="favicon.png" className="logo top" alt="AP-Email" />
          <strong>Inbox</strong>
          <input type="text" placeholder="Search mail..." />
          <div className="create-button">
            <img src="misc/createmail_icon.png" alt="AP-Email" />
            <span>Compose</span>
          </div>
        </div>
        <div className="topbar-group">
          <button onClick={() => setDarkMode(!darkMode)} className="mode-button">
              {darkMode ? 'Light-Mode' : 'Dark-Mode'}
          </button>
          <img src="misc/temp.png" className="topbar-pfp" alt="Profile" />
        </div>
      </div>

      <div className="sidebar">
        <div className="sidebar-item">
          <img src="misc/inbox_icon.png" alt="Show Inbox" />
          <span>Inbox</span>
        </div>
        
        <div className="sidebar-item">
          <img src="misc/star_icon.png" alt="Show Starred" />
          <span>Starred</span>
        </div>

        <div className="sidebar-item">
          <img src="misc/send_icon.png" alt="Show Sent" />
          <span>Sent</span>
        </div>

        <div className="sidebar-item">
          <img src="misc/draft_icon.png" alt="Show Draft" />
          <span>Draft</span>
        </div>

        <div className="sidebar-item">
          <img src="misc/spam_icon.png" alt="Show Spam" />
          <span>Spam</span>
        </div>

        <div className="sidebar-item">
          <img src="misc/delete_icon.png" alt="Show Deleted" />
          <span>Trash</span>
        </div>
      </div>

      <div className="main">
        <div className="tabs">
          <div className="tab active" onClick={(e) => swapTab(e.target)}>Primary</div>
          <div className="tab" onClick={(e) => swapTab(e.target)}>Social</div>
          <div className="tab" onClick={(e) => swapTab(e.target)}>Promotions</div>
        </div>

        <div className="email-list">
          <button className="email-row">
            <span className="from">ETL</span>
            <span className="title">Equipment Return Instructions</span>
            <span>Mar 31</span>
          </button>
        </div>
      </div>
    </>
  );
}

/**
 * @brief Swaps mail list type in inbox menu.
 */
function swapTab(el) {
  document.querySelectorAll('.tab').forEach(tab => {
    tab.classList.remove('active');
  });

  el.classList.add('active');
}

/**
 * @brief Dark-Mode Hook
 */
function useDarkMode() {
  const [darkMode, setDarkMode] = useState(false);

  // Define once when used.
  useEffect(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved) setDarkMode(saved === 'true');
  }, []);

  // Toggles mode effect.
  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  return [darkMode, setDarkMode];
}


export default Inbox;

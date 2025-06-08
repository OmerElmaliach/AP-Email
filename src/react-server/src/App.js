import './App.css';

function App() {
  return (
    <>
      <div className="topbar">
        <div className="topbar-left">
          <img src="favicon.png" className="logo top" alt="AP-Email" />
          <strong>Inbox</strong>
          <input type="text" placeholder="Search mail..." />
          <button className="create-button">+ Create</button>
        </div>
        <img src="misc/temp.png" className="topbar-pfp" alt="Profile" />
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
          <img src="misc/draft_icon.png" alt="Show Sent" />
          <span>Draft</span>
        </div>

        <div className="sidebar-item">
          <img src="misc/spam_icon.png" alt="Show Sent" />
          <span>Spam</span>
        </div>

        <div className="sidebar-item">
          <img src="misc/delete_icon.png" alt="Show Sent" />
          <span>Trash</span>
        </div>
      </div>

      <div className="main">
        <div className="tabs">
          <div className="tab active" onClick={(e) => swapMenu(e.target)}>Primary</div>
          <div className="tab" onClick={(e) => swapMenu(e.target)}>Social</div>
          <div className="tab" onClick={(e) => swapMenu(e.target)}>Promotions</div>
        </div>

        <div className="email-list">
          <button className="email-row">
            <span className="subject">ETL</span>
            <span className="body">Equipment Return Instructions</span>
            <span>Mar 31</span>
          </button>
        </div>
      </div>
    </>
  );
}

function swapMenu(el) {
  document.querySelectorAll('.tab').forEach(tab => {
    tab.classList.remove('active');
  });

  el.classList.add('active');
}

export default App;

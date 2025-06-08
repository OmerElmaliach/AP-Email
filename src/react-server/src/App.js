import './App.css';

function App() {
  const handleLogoClick = () => {
    // Navigate to homepage/inbox - refresh to show main inbox view
    window.location.href = '/';
  };

  return (
    <>
      <div className="topbar">
        <span className="top-group">
          <img 
            src="favicon.png" 
            className="logo-icon clickable" 
            alt="AP-Email" 
            onClick={handleLogoClick}
            title="Go to Homepage"
          />
          <strong>Inbox</strong>
        </span>
        <input type="text" placeholder="Search mail..." />
      </div>

      <div className="sidebar">
        <p className="clickable">Primary</p>
        <p className="clickable">Social</p>
        <p className="clickable">Promotions</p>
      </div>

      <div className="main">
        <div className="tabs">
          <div className="tab active">Primary</div>
          <div className="tab">Social</div>
          <div className="tab">Promotions</div>
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

export default App;

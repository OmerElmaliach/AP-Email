import './App.css';
import UserProfile from './UserProfile';

function App() {
  return (
    <>
      <div className="topbar">
        <div className="topbar-left">
          <span className="top-group">
            <img src="favicon.png" className="logo-icon" alt="AP-Email" />
            <strong>Inbox</strong>
          </span>
          <input type="text" placeholder="Search mail..." />
        </div>
        <UserProfile />
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

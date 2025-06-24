
import React, { useState, useEffect, useRef } from 'react';
import '../styles/UserProfile.css';
import ReadmePage from './ReadmePage';
import ApiService from '../ApiService';
import backupPhoto from '../styles/backup_photo.jpg'

const UserProfile = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);
  const settingsRef = useRef(null);  // Fetch user data from authentication service
  useEffect(() => {
    const fetchUserData = async () => {

      try {
        setLoading(true);
        const userData = await ApiService.getCurrentUser();
        let photoUrl = null;

        try {
          const photoBlob = await ApiService.getUserPhotoBlob();
          photoUrl = URL.createObjectURL(photoBlob);
        } catch (photoErr) {
          console.warn('No profile photo found, using fallback.', photoErr);
          // optionally set a fallback image like:
          // photoUrl = '/default-user-icon.png';
        }
        setUser({ ...userData, picture: photoUrl });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setIsSettingsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleProfileClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
    setIsSettingsOpen(false);
  };
  const handleSettingsClick = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };
  const handleHelp = () => {
    // Show help modal instead of opening new tab
    setIsHelpOpen(true);
    setIsDropdownOpen(false);
  };
  const handleSwitchAccount = () => {
    // Save current user data as cookie for auto-login
    localStorage.setItem('savedUser', JSON.stringify({
      userName: user.userName,
      password: user.password
    }));
    // Navigate to login page (handled by teammate)
    window.location.href = '/login';
  }; const handleLogout = () => {

    // Clear any saved user data
    localStorage.removeItem('savedUser');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');

    window.location.href = '/SignIn';
  };


  if (loading) {
    return <div className="profile-loading">Loading...</div>;
  }

  if (!user) {
    return null;
  } return (
    <>
      <div className="user-profile" ref={dropdownRef}>
        <button className="profile-button" onClick={handleProfileClick}>
          <img
            src={user.picture || backupPhoto}
            onError={(e) => { e.target.onerror = null; e.target.src = backupPhoto; }}
            alt={user.fullName}
            className="profile-picture"
          />
        </button>

        {isDropdownOpen && (
          <div className="profile-dropdown">
            <button
              className="dropdown-close"
              onClick={() => setIsDropdownOpen(false)}
            >
              ×
            </button>

            {/* User Info Section */}
            <div className="user-info-section">
              <div className="user-email">{user.email}</div>
              <img
                src={user.picture || backupPhoto}
                onError={(e) => { e.target.onerror = null; e.target.src = backupPhoto; }}
                alt={user.fullName}
                className="dropdown-picture"
              />
              <div className="user-greeting">Hi, {user.fullName}!</div>
            </div>

            {/* Menu Items */}
            <div className="menu-items">
              <button className="menu-item" onClick={handleHelp}>
                <span className="menu-icon">❓</span>
                Help
              </button>

              <div className="menu-item-container" ref={settingsRef}>
                <button className="menu-item" onClick={handleSettingsClick}>
                  {/* gabi is something spused to go here?*/}
                  <span className="menu-icon">⚙️</span>
                  User info
                  <span className="menu-arrow">◀</span>
                </button>

                {isSettingsOpen && (
                  <div className="settings-popup">
                    <button
                      className="settings-close"
                      onClick={() => setIsSettingsOpen(false)}
                    >
                      ×
                    </button>
                    <div className="settings-content">
                      <div className="setting-item">
                        <label>Full Name:</label>
                        <span>{user.fullName}</span>
                      </div>
                      <div className="setting-item">
                        <label>Email:</label>
                        <span>{user.email}</span>
                      </div>
                      <div className="setting-item">
                        <label>Birthday:</label>
                        <span>{user.birthday}</span>
                      </div>
                      <div className="setting-item">
                        <label>Gender:</label>
                        <span>{user.gender === 'male'
                          ? 'Male'
                          : user.gender === 'female'
                            ? 'Female'
                            : 'Prefer not to say'}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/*<button className="menu-item" onClick={handleSwitchAccount}>
                <span className="menu-icon">🔄</span>
                Switch Account
              </button>*/}

              <button className="menu-item logout" onClick={handleLogout}>
                <span className="menu-icon">🚪</span>
                Log Out
              </button>
            </div>          </div>
        )}
      </div>

      {/* Help Modal */}
      {isHelpOpen && (
        <div className="help-modal-overlay" onClick={() => setIsHelpOpen(false)}>
          <div className="help-modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="help-modal-close"
              onClick={() => setIsHelpOpen(false)}
            >
              ×
            </button>
            <ReadmePage />
          </div>
        </div>
      )}
    </>
  );
};

export default UserProfile;

import './UserPasswordInput.css';

function UserPasswordInput({ mailAdress, setEmailAdress, password, setPassword, handleUserSignIn }) {
  return (
    <div className="signin-container">
      <div className="signin-box">
        <div className="signin-left">
          <img src="/favicon.png" alt="Logo" className="logo-img" />
        </div>
        <div className="signin-right">
          <h2>Sign in</h2>
          <p className="subtext">to continue to AP-Mail</p>

          <div className="form-floating mb-3 full-width">
            <input
              type="email"
              className="form-control"
              id="floatingSigninEmail"
              placeholder="Email Address"
              value={mailAdress}
              onChange={e => setEmailAdress(e.target.value)}
            />
            <label htmlFor="floatingSigninEmail">Email Address</label>
          </div>

          <div className="form-floating mb-3 full-width">
            <input
              type="password"
              className="form-control"
              id="floatingSigninPassword"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <label htmlFor="floatingSigninPassword">Password</label>
          </div>

          <div className="button-row">
            <button
              className="btn btn-primary rounded-pill"
              onClick={handleUserSignIn}
              disabled={!mailAdress || !password}
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default UserPasswordInput;

import { useState } from 'react';
import '../SignUpStepsStyle/EmailPasswordStep.css';

function EmailPasswordStep({
  mailAdress,
  setEmailAdress,
  password,
  setPassword,
  handleCreateUser,
  onBack,
  loading,
  setLoading
}) {
  const [confirmPassword, setConfirmPassword] = useState('');
  //makes sure password check is the same ass original password
  const isMatch = () => password && confirmPassword && password === confirmPassword;

  //password check. why do it in backend..
  const validatePassword = (password) => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long.';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter.';
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter.';
    }
    if (!/\d/.test(password)) {
      return 'Password must contain at least one number.';
    }
    if (!/^[a-zA-Z\d]+$/.test(password)) {
      return 'Password can only contain letters and numbers.';
    }
    return null;
  };

  const passwordError = validatePassword(password);
  return (
    <div className="input-container">
      {/* Email input */}
      <div className="form-floating mb-3 full-width">
        <input
          type="email"
          className="form-control"
          id="floatingEmail"
          placeholder="Email Address"
          value={mailAdress}
          onChange={e => setEmailAdress(e.target.value)}
        />
        <label htmlFor="floatingEmail">Email Address</label>
      </div>

      {/* Password input */}
      <div className="form-floating mb-3 full-width">
        <input
          type="password"
          className="form-control"
          id="floatingPassword"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <label htmlFor="floatingPassword">Password</label>
      </div>

      {/* Confirm password input */}
      <div className="form-floating mb-3 full-width">
        <input
          type="password"
          className="form-control"
          id="floatingConfirmPassword"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
        />
        <label htmlFor="floatingConfirmPassword">Confirm Password</label>
      </div>

      {/* Error message */}
      {password && passwordError && (
        <p className="text-danger">{passwordError}</p>
      )}

      {!passwordError && confirmPassword && !isMatch() && (
        <p className="text-danger">Passwords don't match</p>
      )}
      {/* Buttons */}
      <div className="button-row">
        <button className="btn btn-primary rounded-pill" onClick={onBack}>
          Back
        </button>
        <button
          className="btn btn-primary rounded-pill"
          onClick={handleCreateUser}
          disabled={!isMatch() || !mailAdress || loading}
        >
          {loading ? 'Creating Account...' : 'Create Email!'}
        </button>
      </div>
    </div>
  );
}

export default EmailPasswordStep;

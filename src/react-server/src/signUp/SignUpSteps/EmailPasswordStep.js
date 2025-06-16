
import {  useState } from 'react';


function EmailPasswordStep({ mailAdress, setEmailAdress, password, setPassword, handleCreateUser, onBack, loading, setLoading }) {
  
    const [confirmPassword, setConfirmPassword] = useState('');

  const isMatch = () => password && confirmPassword && (password === confirmPassword);

  return (
    <div className="form-floating">
      <input
        type="email"
        value={mailAdress}
        onChange={e => setEmailAdress(e.target.value)}
        placeholder="Choose your email"
        className="text-input"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="text-input"
      />

      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={e => setConfirmPassword(e.target.value)}
        className="text-input"
      />

      {!isMatch() && confirmPassword && <p>Passwords don't match</p>}

      <button onClick={onBack}>Back</button>
      <button onClick={handleCreateUser} disabled={!isMatch() || !mailAdress|| loading}>
         {loading ? 'Creating Account' : 'Create Email!'}
      </button>
    </div>
  );
}
export default EmailPasswordStep
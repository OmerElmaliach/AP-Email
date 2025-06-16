
function UserPasswordInput({ mailAdress, setEmailAdress, password, setPassword, handleUserSignIn}) {
  
console.log("[UserPasswordInput] Rendered with:", { mailAdress, password });
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

      <button
    id="next-button"
    className="btn btn-primary rounded-pill align-right"
    onClick={handleUserSignIn}
    disabled={!mailAdress || !password}
  >
    signin
  </button>
    </div>
  );
}
export default UserPasswordInput
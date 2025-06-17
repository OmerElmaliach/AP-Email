import '../SignUpStepsStyle/NameStep.css'

function NameStep({ firstName, setFirstName, lastName, setLastName, onNext }) {
  return (
    <div className="input-container">
      <div className="form-floating mb-3 full-width">
        <input
          type="text"
          className="form-control"
          id="floatingFirstName"
          placeholder="First Name"
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
        />
        <label htmlFor="floatingFirstName">First Name</label>
      </div>

      <div className="form-floating mb-3 full-width">
        <input
          type="text"
          className="form-control"
          id="floatingLastName"
          placeholder="Last Name"
          value={lastName}
          onChange={e => setLastName(e.target.value)}
        />
        <label htmlFor="floatingLastName">Last Name</label>
      </div>

      <div className="next-button-container">
        <button
          id="next-button"
          className="btn btn-primary rounded-pill"
          onClick={onNext}
          disabled={!firstName || !lastName}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default NameStep;

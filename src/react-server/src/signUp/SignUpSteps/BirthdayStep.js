import '../SignUpStepsStyle/BirthdayStep.css'

function BirthdayStep({ gender, setGender, birthday, setBirthDay, onNext, onBack }) {
    const handleNext = () => {
    const birthDate = new Date(birthday);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    const isUnder13 = m < 0 || (m === 0 && today.getDate() < birthDate.getDate())
      ? age - 1 < 13
      : age < 13;

    if (isUnder13) {
      alert('You must be at least 13 years old to create an account.');
      return;
    }

    onNext(); // proceed if valid
  };
  
  return (
    <div className="input-container">
      {/* Gender dropdown */}
      <div className="form-floating mb-3 full-width">
        <select
          className="form-select"
          id="floatingGender"
          value={gender}
          onChange={e => setGender(e.target.value)}
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="preferNotToSay">Prefer not to say</option>
        </select>
        <label htmlFor="floatingGender">Gender</label>
      </div>

      {/* Birthday input */}
      <div className="form-floating mb-3 full-width">
        <input
          type="date"
          className="form-control"
          id="floatingBirthday"
          value={birthday}
          onChange={e => setBirthDay(e.target.value)}
        />
        <label htmlFor="floatingBirthday">Birthday</label>
      </div>

      {/* Buttons */}
      <div className="button-row">
        <button className="btn btn-primary rounded-pill" onClick={onBack}>
          Back
        </button>
        <button
          className="btn btn-primary rounded-pill"
          onClick={handleNext}
          disabled={!gender || !birthday}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default BirthdayStep;

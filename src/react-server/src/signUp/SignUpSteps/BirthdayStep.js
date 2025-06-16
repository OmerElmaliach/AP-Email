function BirthdayStep({ gender, setGender, birthday, setBirthDay, onNext, onBack }) {
  return (
    <div >
      {/* Gender selector as a popup/dropdown */}
      <label>
        Gender:
        <select value={gender} onChange={e => setGender(e.target.value)}>
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="preferNotToSay">Prefer not to say</option>
        </select>
      </label>
        
      <label>
        Birthday:
        <input
          type="date"
          value={birthday}
          onChange={e => setBirthDay(e.target.value)}
        />
      </label>

      <button onClick={onBack}>Back</button>
      <button onClick={onNext} disabled={!gender || !birthday}>
        Next
      </button>
    </div>
  );
}
export default BirthdayStep

import { useNavigate } from 'react-router-dom';
import ApiService from '../ApiService'
import { useEffect, useState } from 'react';
import './SignUp.css';
//import db from './database';


// Step 1: Name input window
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

  <button
    id="next-button"
    className="btn btn-primary rounded-pill align-right"
    onClick={onNext}
    disabled={!firstName || !lastName}
  >
    Next
  </button>
</div>

  );
}

// Step 2: Picture upload window
function PictureStep({ picture, setPicture, onNext, onBack }) {
  return (
    <div>
      <h2>Upload your picture</h2>
      <input 
        type="file" 
        accept="image/*" 
        onChange={e => setPicture(e.target.files[0])} 
      />
      <button onClick={onBack}>Back</button>
      <button onClick={onNext} disabled={!picture}>Next</button>
    </div>
  );
}

//step 3: gender and birthday
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

// step 4- email and password 
function EmailPasswordStep({ mailAdress, setEmailAdress, password, setPassword, handleCreateUser, onBack }) {
  
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
      <button onClick={handleCreateUser} disabled={!isMatch() || !mailAdress}>
        Create Email!
      </button>
    </div>
  );
}





// Main signup flow component
function SignUp() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState(''); // get first name
  const [lastName, setLastName] = useState(''); // get last name
  const [picture, setPicture] = useState(null); // get pic
  const [gender , setGender] = useState(''); // get gender
  const [birthday, setBirthDay] = useState(''); // get birthday
  const [mailAdress, setEmailAdress] = useState(''); // get email
  const [password, setPassword]  = useState(''); // get password

  function nextStep() {
    setStep(step + 1);
  }

  function prevStep() {
    setStep(step - 1);
  }

 function handleCreateUser() {
  const formData = new FormData();
  formData.append('firstName', firstName);
  formData.append('lastName', lastName);
  formData.append('gender', gender);
  formData.append('birthday', birthday);
  formData.append('userName', mailAdress); // backend expects userName = email
  formData.append('email', mailAdress);
  formData.append('password', password);
  if (picture) {
    formData.append('picture', picture);
  }

  ApiService.signupUser(formData)
    .then(() => {
      navigate('/inbox');
    })
    .catch(err => {
  console.error('Signup failed:', err.message);
  alert(err.message); // now this shows the backend's error
});
 }
{/*
    fetch('http://localhost:5000/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    })
      .then(res => {
        if (!res.ok) throw new Error('Signup failed');
        return res.json();
      })
      .then(data => {
         navigate('/inbox'); 
        // Optionally move to a success step or login page
      })
      .catch(err => {
        console.error('Error:', err);
        // Show error to user maybe
      });
  }

*/}
  return (
    <div>
      {step === 1 && (
        <NameStep firstName={firstName} setFirstName={setFirstName} 
            lastName={lastName} setLastName={setLastName} onNext={nextStep}/>  )}

      {step === 2 && <PictureStep picture={picture} setPicture={setPicture} onNext={nextStep} onBack={prevStep} />}

      {step === 3 &&  <BirthdayStep  gender={gender} setGender={setGender} birthday={birthday}
         setBirthDay={setBirthDay} onNext={nextStep} onBack={prevStep} /> }

      {step === 4 &&  <EmailPasswordStep mailAdress = {mailAdress} setEmailAdress={setEmailAdress}  password = {password}
         setPassword = {setPassword} handleCreateUser={handleCreateUser} onBack={prevStep} />}



    </div>
  );
}

export default SignUp;
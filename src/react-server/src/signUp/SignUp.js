
import { useNavigate } from 'react-router-dom';
import ApiService from '../ApiService'
import { useEffect, useState } from 'react';
import './SignUp.css';
//import 'bootstrap/dist/css/bootstrap.min.css';

import NameStep from './SignUpSteps/NameStep';
import PictureStep from './SignUpSteps/PictureStep';
import BirthdayStep from './SignUpSteps/BirthdayStep';
import EmailPasswordStep from './SignUpSteps/EmailPasswordStep';




// Main signup flow component
function SignUp() {
  // Dynamically add Bootstrap CSS only when SignUp is mounted. note to self- DONT USE BOOT STRAP AGAIN!!!!!
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css';
    link.onload = () => setBootstrapReady(true);
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);



  const navigate = useNavigate();

  const handleGoToSignIn = () => {
    navigate('/signin');
  };

  const [bootstrapReady, setBootstrapReady] = useState(false);

  //helper functions for page navigation 
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const [firstName, setFirstName] = useState(''); // get first name
  const [lastName, setLastName] = useState(''); // get last name
  const [picture, setPicture] = useState(null); // get pic
  const [gender, setGender] = useState(''); // get gender
  const [birthday, setBirthDay] = useState(''); // get birthday
  const [mailAdress, setEmailAdress] = useState(''); // get email
  const [password, setPassword] = useState(''); // get password

  if (!bootstrapReady) {
    return null; // white screen during Bootstrap load
  }

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);


  const handleCreateUser = async () => {
    setLoading(true);
    const formData = new FormData();

    const fullEmail = `${mailAdress}@AP-Email`;

    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('gender', gender);
    formData.append('birthday', birthday);
    formData.append('userName', fullEmail); // backend expects userName = email
    formData.append('email', fullEmail);
    formData.append('password', password);
    if (picture) {
      formData.append('picture', picture);
    }

    try {
      const success = await ApiService.signupUser(formData);
      if (success) navigate('/inbox');
      else {
        alert('Signup failed');
      }
    } catch (err) {

      console.error('Error:', err);

      let errorMessage = 'Something went wrong';

      // try parsing the error message if it looks like a JSON string inside
      try {
        const parsed = JSON.parse(err?.message?.match(/{.*}/)?.[0]);
        if (parsed?.error) {
          errorMessage = parsed.error;
        }
      } catch (parseErr) {
        errorMessage = err.message; // fallback if parsing fails
      }

      alert(errorMessage || 'Something went wrong' );
    } finally {
      setLoading(false);
    }
  }

  return (

    <div className="signup-container">
      <div className="signup-box">

        {/* Left side with logo */}
        <div className="signup-left">
          <img src="/favicon.png" alt="Logo" className="logo-img" />
        </div>

        {/* Right side with form step */}
        <div className="signup-right">

          <h2>Welcome!</h2>
          <p className="subtext">Create your AP-Email account</p>

          {step === 1 && (
            <NameStep
              firstName={firstName}
              setFirstName={setFirstName}
              lastName={lastName}
              setLastName={setLastName}
              onNext={nextStep}
              goToSignIn={handleGoToSignIn}
            />
          )}

          {step === 2 && (
            <PictureStep
              picture={picture}
              setPicture={setPicture}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}

          {step === 3 && (
            <BirthdayStep
              gender={gender}
              setGender={setGender}
              birthday={birthday}
              setBirthDay={setBirthDay}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}

          {step === 4 && (
            <EmailPasswordStep
              mailAdress={mailAdress}
              setEmailAdress={setEmailAdress}
              password={password}
              setPassword={setPassword}
              handleCreateUser={handleCreateUser}
              loading={loading}
              setLoading={setLoading}
              onBack={prevStep}
            />
          )}
        </div>

      </div>
    </div>
  );
}

export default SignUp;
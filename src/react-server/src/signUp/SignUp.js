
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
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const navigate = useNavigate();
  //helper functions for page navigation 
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const [firstName, setFirstName] = useState(''); // get first name
  const [lastName, setLastName] = useState(''); // get last name
  const [picture, setPicture] = useState(null); // get pic
  const [gender , setGender] = useState(''); // get gender
  const [birthday, setBirthDay] = useState(''); // get birthday
  const [mailAdress, setEmailAdress] = useState(''); // get email
  const [password, setPassword]  = useState(''); // get password

  
  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);


  const handleCreateUser =async ()=> {
    setLoading(true);
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

     try {
    const success = await ApiService.signupUser(formData);
    if (success) navigate('/inbox');
    else{
     alert('Signup failed');
    }
  } catch (err) {

    alert(err.message || 'Something went wrong');

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
        {step === 1 && (
          <NameStep 
            firstName={firstName} 
            setFirstName={setFirstName} 
            lastName={lastName} 
            setLastName={setLastName} 
            onNext={nextStep}
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
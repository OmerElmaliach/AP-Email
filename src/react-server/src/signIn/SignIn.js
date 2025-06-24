import { useNavigate } from 'react-router-dom';
import ApiService from '../ApiService'
import { useEffect, useState } from 'react';
import './SignIn.css';

import UserPasswordInput from '../components/Auth/SignIn/UserPasswordInput'

function SignIn() {
   const [bootstrapReady, setBootstrapReady] = useState(false);
   const navigate = useNavigate();
  const [mailAdress, setEmailAdress] = useState(''); // get email
  const [password, setPassword]  = useState(''); // get password
  
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
  
  if (!bootstrapReady) {
  return null; // white screen during Bootstrap load
}
  
  const handleGoToSignUp = () => {
    navigate('/signup');
  };
  const handleUserSignIn =async ()=> {

      const credentials = {
      email: mailAdress,
      password: password
      };
      try {
          const success = await ApiService.signInUser(credentials);
          if (success) {
            navigate('/inbox');
          } else {
            alert('Wrong email or password');
          }
        } catch (err) {
            console.error('Signin failed:', err.message);
            alert('Something went wrong. Please try again.');
        }
  };

 return(
      
        <UserPasswordInput 
            mailAdress = {mailAdress}
            setEmailAdress = {setEmailAdress}
            password = {password}
            setPassword = {setPassword}
            handleUserSignIn = {handleUserSignIn}
            onGoToSignUp={handleGoToSignUp}
          />  
 )

}

export default SignIn
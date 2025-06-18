import { useNavigate } from 'react-router-dom';
import ApiService from '../ApiService'
import { useEffect, useState } from 'react';
import './SignIn.css';

import UserPasswordInput from '../components/Auth/SignIn/UserPasswordInput'

function SignIn() {
  const navigate = useNavigate();
  const [mailAdress, setEmailAdress] = useState(''); // get email
  const [password, setPassword]  = useState(''); // get password

  const handleUserSignIn =async ()=> {

      const credentials = {
      email: mailAdress,
      password: password
      };
    console.log("from signin function sending to apiservice credentials",{credentials})
      try {
          const success = await ApiService.signInUser(credentials);
          if (success) {
            console.log("in signIn with token should redirect now")
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
          />  
 )

}

export default SignIn
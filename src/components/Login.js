
import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;
    try {
      const response = await fetch('https://sheltered-ridge-78289-a13a89c3e346.herokuapp.com/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('accessToken', data.access);
        localStorage.setItem('refreshToken', data.refresh);
        navigate('/dashboard');
      } else {
        const errorData = await response.json();
        console.error('Login failed:', errorData);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const handleError = () => {
    console.log('Login Failed');
  };

  return (
    <div>
      <h2>Login with Google</h2>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </div>
  );
};

export default Login;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [meters, setMeters] = useState('');
  const [feet, setFeet] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        navigate('/');
        return;
      }
      try {
        const response = await fetch('https://sheltered-ridge-78289-a13a89c3e346.herokuapp.com/api/user/', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUserName(data.name);
          setUserEmail(data.email);
        } else if (response.status === 401) {
          navigate('/'); // Redirect to login if not authenticated
        } else {
          console.error('Failed to fetch user info');
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };
    fetchUserInfo();
  }, [navigate]);

  const handleConvert = async () => {
    setError('');
    setFeet('');
    if (isNaN(meters) || meters === '') {
      setError('Please enter a valid number for meters.');
      return;
    }
    if (parseFloat(meters) < 0) {
      setError('Meters cannot be negative.');
      return;
    }

    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      navigate('/');
      return;
    }

    try {
      const response = await fetch(`https://sheltered-ridge-78289-a13a89c3e346.herokuapp.com/api/convert/?meters=${meters}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setFeet(data.feet);
      } else if (response.status === 401) {
        navigate('/');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Conversion failed');
      }
    } catch (error) {
      console.error('Error during conversion:', error);
      setError('An error occurred during conversion.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/');
  };

  return (
    <div>
      <h2>Welcome, {userName || 'Guest'}!</h2>
      {userEmail && <p>Email: {userEmail}</p>}

      <h3>Meters to Feet Converter</h3>
      <input
        type="number"
        value={meters}
        onChange={(e) => setMeters(e.target.value)}
        placeholder="Enter meters"
      />
      <button onClick={handleConvert}>Convert</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {feet && <p>{meters} meters is {feet} feet.</p>}

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;

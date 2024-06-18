import React, { useState } from 'react';
import axios from 'axios';
import './OTP_page.css';

import { useNavigate } from 'react-router-dom';

const OtpPage = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [showOtpInput, setShowOtpInput] = useState(false);

  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleOtpChange = (element, index) => {
        if(isNaN(element.value)) return false;

        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
        
        if(element.nextSibling){
            element.nextSibling.focus();
        }
    };

  const handleGenerateOtp = async () => {
    try {
      axios.post('http://localhost:5000/send-otp', { email }).then((response)=>{
        setShowOtpInput(true);
      });
    }
    catch(error){
        console.error('Error sending OTP:', error);
        alert('Failed to send OTP. Please try again.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    
    axios.post('http://localhost:5000/verify-otp', { email, otp: enteredOtp }).then((response) => {
      if(response.status === 200){
        navigate('/');
      }
      else{
        alert('OTP verification failed. Please try again.');
      }
    }).catch((error) => {
      console.error('Error verifying OTP:', error);
      alert('An error occurred during OTP verification. Please try again.');
    });

  };

  return (
    <>
      <h2>Please Authenticate  </h2>
    <div className="OTP_page">
      <h2>{showOtpInput ? 'Enter OTP' : 'Enter your email'}</h2>
      <form onSubmit={handleSubmit}>
        {!showOtpInput ? (
          <>
            <div className="email-input-container">
              <label htmlFor="email">Email:</label>
              <div>
                <input
                  className="email-input"
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={handleEmailChange}
                  required
                />
              </div>
            </div>
              <button className="generate-otp-btn" onClick={handleGenerateOtp}> Generate OTP </button>
          </>

          

        ) : (
          <>
          <div className="otp-inputs">
            {otp.map((data, index) => (
              
              <div>
                  <input
                    className="otp-input"
                    name="otp"
                    maxLength="1"
                    key={index}
                    value={data}
                    onChange={(e) => handleOtpChange(e.target, index)}
                    onFocus={(e) => e.target.select()}
                    required
                  />
              </div>

            ))}
          </div>
            <button className="submit-btn" type="submit">Verify OTP</button>

          </>
        )}
      </form>
    </div>
    </>
  );
};

export default OtpPage;

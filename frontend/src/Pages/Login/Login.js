import React from 'react';
import Image from '../../assets/images/Login_page_img.png';
import {useState} from 'react';
import auth from '../../firebase.init';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth'; 
import './Login.css'; 
import GoogleButton from 'react-google-button';
import { Link, useNavigate } from 'react-router-dom';
import { useSignInWithGoogle } from 'react-firebase-hooks/auth';
import LoadingPage from '../LoadingPage';
import axios from 'axios';
import { useEffect } from 'react';

import deviceInfo from '../../Utils/deviceInfo';

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [deviceDetails, setDeviceDetails] = useState(null);

    const navigate = useNavigate();

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    }

    const [signInWithEmailAndPassword, emailPasswordUser, loading, emailPasswordError] = useSignInWithEmailAndPassword(auth);
    const [signInWithGoogle, userGoogle, loadingGoogle, signInErrorGoogle] = useSignInWithGoogle(auth);

    if(loading || loadingGoogle){
        <LoadingPage/>
    }

    if(emailPasswordError){
        alert('Error: ' + emailPasswordError.message);
        
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!email || !password) {
            alert('Please enter email and password.');
            return;
        }
        
        // console.log(email, password);
        
        try {
            await signInWithEmailAndPassword(email, password);
            
            // console.log(email, password);
            
            const response = await axios.get(`http://localhost:5000/register?email=${encodeURIComponent(email)}`);
            
            if (response.data.length === 0) {
                alert('No user found. Please sign up');
                navigate('/signup');

            } else {
                
                
                const loggedInUserDeviceInfo = deviceDetails;
                console.log('Logged in user device info:', loggedInUserDeviceInfo);
                
                axios.post('http://localhost:5000/LoginTrack', {
                    email: email,
                    deviceInfo: loggedInUserDeviceInfo
                }).then((response) => {
                    console.log('Device info saved successfully:', response);
                }).catch((error) => {
                    console.error('Error saving device info:', error);
                });

                if(deviceDetails.isMobile){
                    const currentTime = new Date();
                    const currentHour = currentTime.getHours();

                    const allowedStartHour = 8; 
                    const allowedEndHour = 20; 

                    if (currentHour >= allowedStartHour && currentHour <= allowedEndHour) {
                        setEmail('');
                        setPassword('');
                        navigate('/');
                    } else {
                        alert('Access restricted to mobile devices between 8 AM and 8 PM.');
                    }
                }
                else if(deviceDetails.isDesktop && deviceDetails.browserName === 'Firefox'){
                    setEmail('');
                    setPassword('');
                    navigate('/OTPVerification');
                }
                else{
                    setEmail('');
                    setPassword('');
                    navigate('/');
                }
                  
            }
        } catch (error) {
            console.error('Error during sign-in or user verification:', error);
            alert('An error occurred. Please try again.');
        }
    };
    
    

    const handleGoogleLogin = async() => {
        console.log('Google button clicked');
        try{
           await signInWithGoogle();
            
           


        }catch(signInErrorGoogle){
            console.log(signInErrorGoogle);
            alert('Error: ' + signInErrorGoogle.message);
        }
    }

    useEffect(() => {
        if (userGoogle) {

            console.log(userGoogle._tokenResponse.email);
            const userEmail = userGoogle._tokenResponse.email;

            axios.get(`http://localhost:5000/subscriptions/user/${userEmail}`).then((response) => {
                if (response.data.length === 1) {
                    // userDefaultSubscription already exists !!!
                }
                else{

                    axios.post("http://localhost:5000/subscriptions/user", {
                        email: userEmail,
                        postLimit: 5
                    }).then((res) => {
                        console.log(res);

                        console.log('User logged in with Google:', userGoogle);
                        navigate('/');

                    }).catch((err) => {
                        console.error("Error:", err);
                    });
                    
                }
            }).catch((error) => {
                console.error('Error in get request:', error);
                alert('Error adding subscription2');
            });
            

            
        }
    }, [userGoogle, navigate]);


    useEffect(() => {
        const fetchDeviceInfo = async () => {
            const info = await deviceInfo();
            setDeviceDetails(info);
        };

        fetchDeviceInfo();
    }, []);

    

    return (
        <div className='loginContainer' >
        

            <div className='imgContainer'>
                <img src={Image} alt='login Image' />
            </div>
            <div className='formContainer'>
            
                <form onSubmit={handleSubmit}>
                    <div className='form-group'>

                    <h1 className='loginHeading'>Login</h1>

                        <input type='email' className='form-control' 
                            id='email' 
                            placeholder='Enter email' 
                            onChange={handleEmailChange}
                        />

                        
                        <input type='password' className='form-control' 
                            id='password' 
                            placeholder='Password' 
                            onChange={handlePasswordChange}
                        />

                    </div>
                    <button type='submit' className='btn'>Login</button>

                    
                    
                    
                    <div >
                        <p>Don't have an account? <Link to='/signup' className='signupLink'>Sign up</Link></p>
                    </div>
                    <div 
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: '20px'
                        }}
                    >
                        <hr 
                            style = {{
                                color: 'black',
                                backgroundColor: 'black',
                                height: 1,
                                width: '40%',
                                marginTop: '20px'
                            }}
                        />

                        
                        <h3 className='or'>OR</h3>
                        
                        <hr 
                            style = {{
                                color: 'black',
                                backgroundColor: 'black',
                                height: 1,
                                width: '40%',
                                marginTop: '20px'
                            }}
                        />

                    </div>


                    <div className='googleButton'>
                    <GoogleButton 
                        style={{
                            borderRadius: '5px', 
                            backgroundColor: 'white', 
                            color: 'white',
                            fontFamily: 'Roboto',
                            fontSize: '18px', 
                            fontStyle: 'bold',
                            width: '100%', 
                            height: '50px',
                            backgroundColor: '#f8d06d',
                            marginLeft: '20px',
                        
                        }}
                        onClick={() => { handleGoogleLogin()}}
                    />
                    </div>
                    
                </form>

                

            </div>
        </div>
    );
    }

export default Login;
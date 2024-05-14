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

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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
    else if(signInErrorGoogle){
        alert('Error: ' + signInErrorGoogle.message);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            alert('Please enter email and password.');
            return;
        }
        console.log(email, password);
        try {
            await signInWithEmailAndPassword(email, password);
            if (emailPasswordUser) {
                navigate('/');
                console.log('User logged in');

                setEmail('');
                setPassword('');
            }
            else{
                alert('Invalid email or password');
                console.log(emailPasswordError.message);
            }
        } catch (emailPasswordError) {
            console.log(emailPasswordError);
            alert('Error: ' + emailPasswordError.message);
        }
    }

    

    const handleGoogleLogin = async() => {
        console.log('Google button clicked');
        try{
            await signInWithGoogle();
            if(userGoogle){
                navigate('/');
                console.log('User logged in with Google');
            }

        }catch(signInErrorGoogle){
            console.log(signInErrorGoogle);
            alert('Error: ' + signInErrorGoogle.message);
        }
    }

    

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
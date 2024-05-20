import React from 'react'
import { useState } from 'react';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import Image from '../../assets/images/Login_page_img.png';
import auth from '../../firebase.init';
import './SignUp.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
// import { GoogleAuthProvider } from 'firebase/auth';



const SignUp = () => {

    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    }   

    const handleFullNameChange = (e) => {
        setFullName(e.target.value);
    }

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    }

    const [createUserWithEmailAndPassword, user, loading, error] = useCreateUserWithEmailAndPassword(auth);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username || !fullName || !email || !password) {
            alert('Please fill in all fields.');
            return;
        }
        else if(password.length < 6){
            alert('Password must be at least 6 characters long');
            return;
        }
        createUserWithEmailAndPassword(email, password);
        
        const User = {
            username: username,
            fullName: fullName,
            email: email,
        };

        axios.post("http://localhost:5000/register", User).then((response) => {
            console.log(response);
            auth.SignUpWithEmailAndPassword(email, password);
            navigate('/');
        }).catch((error) => {
            console.error("Error:", error);
        });

    }
    

    

  return (
    <div className='SignUpContainer'>
            

            <div className='imgContainer'>
                <img src={Image} alt='placeholder' />
            </div>

            <div className='formContainer'>
                <form onSubmit={handleSubmit}>

                <h1 className='signUpHeading'>SignUp</h1>

                    <div className='form-group'>

                        <input type='text' className='form-control'
                            id='username'
                            placeholder='Enter username'
                            onChange={handleUsernameChange}
                        />

                        <input type='text' className='form-control'
                            id='FullName'
                            placeholder='Enter Full Name'
                            onChange={handleFullNameChange}
                        />

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

                    <button type='submit' className='btn'>Sign up</button>


                    <div className='loginLink' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <p 
                            style={{
                                color: 'black',
                                fontSize: '16px',
                                fontFamily: 'Roboto',
                            }}
                        >
                            Already have an account?
                        </p>

                        <Link to='/login' 
                            style = {{
                                textDecoration: 'none',
                                color: '#fdb603',
                                fontSize: '20px',
                                marginLeft: '5px',
                                fontFamily: 'Roboto',
                            }}
                        >
                            Login
                        </Link>
                    </div>
                    

                    

                </form>

                


            </div>
                
        </div>
  );
}

export default SignUp;

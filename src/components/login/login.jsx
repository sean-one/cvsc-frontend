import React, { useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';

import AxiosInstance from '../../helpers/axios';
import './login.css';

import UserContext from '../../context/userContext';

const Login = () => {
    const { setUserProfile } = useContext(UserContext);
    const [ passwordError, setPasswordError ] = useState(false); 
    const [ userError, setUserError ] = useState(false);
    const [ netError, setNetError ] = useState(false);
    let history = useHistory();

    const sendLogin = (e) => {
        e.preventDefault();
        setPasswordError(false)
        setUserError(false)
        setNetError(false)
        const userDetails = {
            username: e.target.username.value,
            password: e.target.password.value
        }
        AxiosInstance.post('/users/login', userDetails)
            .then(response => {
                console.log(response)
                if(response.status === 200) {
                    setUserProfile(response.data)
                    localStorage.setItem('token', response.data.token);
                    localStorage.setItem('userId', response.data.id)
                    localStorage.setItem('user', JSON.stringify(response.data))
                    localStorage.setItem('isLoggedIn', true)
                    history.push('/profile');
                } else {
                    console.log('inside else')
                    throw new Error('invalid stuffs');
                }
            })
            .catch(err => {
                if(!err.respopnse) {
                    setNetError(true)
                    console.log('network error')
                } else if(err.response.status === 401) {
                    setPasswordError(true)
                    console.log('invalid credentials')
                } else if(err.response.status === 404) {
                    setUserError(true)
                    console.log('user not found')
                } else {
                    console.log(err.name + ': ' + err.message)
                }
            })
    }
    return (
        <div className='formWrapper'>
            <h2>Please Login</h2>
            <form className='loginform' onSubmit={sendLogin}>
                <label htmlFor='username'>Username:</label>
                <input type='text' id='username' name='username' required/>
                {userError && <p className='errormessage'>user not found!</p>}
                <label htmlFor='password'>Password:</label>
                <input type='password' id='password' name='password' required />
                {netError && <p className='errormessage'>network error, please wait a moment then try again</p>}
                {passwordError && <p className='errormessage'>wrong password!</p>}
                <input type='submit' value='submit' />
            </form>
            <div className='registernew'>
                <h3>No account yet?</h3>
                <Link to={{
                    pathname: '/register'
                }}>
                    <button>Register New Account</button>
                </Link>
            </div>
        </div>
    )
}

export default Login;
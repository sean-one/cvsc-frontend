import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';

import AxiosInstance from '../../helpers/axios';
import './login.css';

import UserContext from '../../context/userContext';

const Login = () => {
    const { setUserProfile } = useContext(UserContext);
    let history = useHistory();

    const sendLogin = (e) => {
        e.preventDefault();
        const userDetails = {
            username: e.target.username.value,
            password: e.target.password.value
        }
        AxiosInstance.post('/users/login', userDetails)
            .then(response => {
                if(response.status === 200) {
                    localStorage.setItem('token', response.data.token);
                    localStorage.setItem('userId', response.data.id)
                    localStorage.setItem('user', JSON.stringify(response.data))
                    setUserProfile(response.data)
                    localStorage.setItem('isLoggedIn', true)
                    history.push('/profile');
                } else {
                    throw new Error('invalid stuffs');
                }
            })
            .catch(err => {
                console.log(err.name + ': ' + err.message)
            })
    }
    return (
        <div className='formWrapper'>
            <h2>Please Login</h2>
            <form className='loginform' onSubmit={sendLogin}>
                <label htmlFor='username'>Username:</label>
                <input type='text' id='username' name='username' required/>
                <label htmlFor='password'>Password:</label>
                <input type='password' id='password' name='password' required/>
                <input type='submit' value='submit' />
            </form>
        </div>
    )
}

export default Login;
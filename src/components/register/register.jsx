import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import AxiosInstance from '../../helpers/axios';

import './register.css';

import UserContext from '../../context/userContext';

const Register = () => {
    const { setUserProfile } = useContext(UserContext);
    let history = useHistory();

    const createUser =(e) =>{
        e.preventDefault();
        const userDetails = {
            username: e.target.username.value,
            email: e.target.email.value,
            avatar: e.target.avatar.value,
            password: e.target.password.value
        }
        AxiosInstance.post('/users/register', userDetails)
            .then(response => {
                if(response.status === 200) {
                    localStorage.setItem('token', response.data.token);
                    setUserProfile(response.data)
                    localStorage.setItem('isLoggedIn', true)
                    history.push('/calendar');
                } else {
                    throw new Error()
                }
            })
            .catch(err => {
                console.log(err)
            })
    }
    return (
        <div className='formWrapper'>
            <h2>Registration</h2>
            <form className='registerForm' onSubmit={createUser}>
                <label htmlFor='username'>Username:</label>
                <input type='text' id='username' name='username' />
                <label htmlFor='email'>Email:</label>
                <input type='email' id='email' name='email' />
                <label htmlFor='avatar'>Profile Image:</label>
                <input type='url' id='avatar' name='avatar' />
                <label htmlFor='password'>Password:</label>
                <input type='password' id='password' name='password' />
                <label htmlFor='confirmaiton'>Confirm Password:</label>
                <input type='password' id='confirmaiton' name='confirmaiton' />
                <input type='submit' value='submit' />
            </form>
        </div>
    )
}

export default Register;
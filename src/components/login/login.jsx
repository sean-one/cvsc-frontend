import React from 'react';

// import AxiosInstance from '../../helpers/axios';
import './login.css';

const Login = () => {
    const sendLogin = (e) => {
        e.preventDefault();
        if(!e.target.username.value || !e.target.password.value) {
            // need to put together and error that can be displayed on screen
            console.log('fill in inputs!')
        } else {
            const userDetails = {
                name: e.target.username.value,
                password: e.target.password.value
            }
            console.log(userDetails)
        }
    }
    return (
        <div className='loginWrapper'>
            <h2>Please Login</h2>
            <form className='loginform' onSubmit={sendLogin}>
                <label htmlFor='username'>Username:</label>
                <input type='text' id='username' name='username' />
                <label htmlFor='password'>Password:</label>
                <input type='password' id='password' name='password' />
                <input type='submit' value='submit' />
            </form>
        </div>
    )
}

export default Login;
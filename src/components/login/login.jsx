import React, { useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { loginSchema } from '../../helpers/validationSchemas';
import { yupResolver } from '@hookform/resolvers/yup';

import AxiosInstance from '../../helpers/axios';
import './login.css';

import { UsersContext } from '../../context/users/users.provider';

const Login = (props) => {
    const { register, handleSubmit, setError, formState:{ errors } } = useForm({
        mode: "onBlur",
        resolver: yupResolver(loginSchema)
    });
    const { setUser } = useContext(UsersContext);
    const [ serverError, setServerError ] = useState(false);
    let history = useHistory();

    
    const sendLogin = (data) => {
        AxiosInstance.post('/users/login', data)
            .then(response => {
                if(response.status === 200) {
                    console.log(response.data)
                    setUser(response.data)
                    history.push('/profile');
                } else {
                    console.log('inside else')
                    throw new Error('invalid stuffs');
                }
            })
            .catch(err => {
                if (!err.response) {
                    setServerError(true)

                } else if (err.response.status === 401) {
                    setError('password', {
                        type: 'server',
                        message: 'password or username is incorrect'
                    })
                } else if (err.response.status === 404) {
                    setError('username', {
                        type: 'server',
                        message: 'username is incorrect'
                    })
                } else {
                    console.log(err.name + ': ' + err.message)
                }
            })
    }

    return (
        <div className='componentWrapper'>
            <h2>Please Login</h2>
            <form className='loginform' onSubmit={handleSubmit(sendLogin)}>
                <label htmlFor='username'>Username:</label>
                <input
                    autoFocus
                    {...register('username')}
                    type='text'
                    id='username'
                    name='username'
                    required
                />
                <p className='errormessage'>{errors.username?.message}</p>
                <label htmlFor='password'>Password:</label>
                <input
                    {...register('password')}
                    type='password'
                    id='password'
                    name='password'
                    required
                />
                <p className='errormessage'>{errors.password?.message}</p>
                { serverError && <p className='errormessage'>network error, please wait a moment and try again</p> }
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
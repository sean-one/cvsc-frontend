import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';

import useAuth from '../hooks/useAuth';
import useNotification from '../hooks/useNotification';
import AxiosInstance from '../helpers/axios';
import { validatePassword, validateUsername } from './forms/form.validations';

const LoginStyles = styled.div`
    .loginWrap {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        max-width: var(--max-page-width);
        margin: 0 auto;
        padding: 1.5rem 0.5rem;
    }

    .loginHeader {
        width: 100%;
        font-size: 1.8rem;
        font-weight: bold;
        align-self: flex-start;
    }

    .loginForm {
        width: 100%;
        margin-top: 0.5rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .registerLinkWrapper {
        display: flex;
        justify-content: center;
        margin-top: 2rem;
    }


`;

const Login = () => {
    const { setAuth } = useAuth()
    const { dispatch } = useNotification()

    const { register, handleSubmit, setError, clearErrors, formState:{ errors } } = useForm({
        mode: "onBlur",
    });
    let navigate = useNavigate();

    
    const sendLogin = (data) => {
        AxiosInstance.post('/auth/login', data)
            .then(response => {
                if(response.status === 200) {
                    setAuth({ user: response.data.user, roles: response.data.roles })

                    dispatch({
                        type: "ADD_NOTIFICATION",
                        payload: {
                            notification_type: 'SUCCESS',
                            message: `logged in as: ${data.username}`
                        }
                    })

                    // forward to profile page
                    navigate('/profile');

                } else {
                    dispatch({
                        type: "ADD_NOTIFICATION",
                        payload: {
                            notification_type: 'ERROR',
                            message: 'something went wrong, please try again'
                        }
                    })
                    throw new Error('invalid stuffs');
                }
            })
            .catch(err => {
                console.log(err)
                if (err.response.status === 400 ) {
                    setError(`${err.response.data.error.type}`, {
                        type: 'server',
                        message: err.response.data.error.message
                    })

                } else {
                    console.log(err.name + ': ' + err.message)
                    
                }
            })
    }

    const googleAuthButton = (e) => {
        e.preventDefault()
        window.open(`${process.env.REACT_APP_BACKEND_URL}/auth/google`, "_self")
    }


    return (
        <LoginStyles>
            <div className='loginWrap'>
                
                <div className='loginHeader'>Login</div>

                <form onSubmit={handleSubmit(sendLogin)} className='loginForm' onClick={() => clearErrors('credentials')}>
                    
                    <div className='inputWrapper'>
                        <input {...register('username', {
                            required: 'username is required',
                            minLength: {
                                value: 4,
                                message: 'must be at least 4 letters'
                            },
                            maxLength: {
                                value: 20,
                                message: 'too long, must be 20 characters or less'
                            },
                            validate: validateUsername,
                        })} className='formInput' type='text' onFocus={() => clearErrors('username')} placeholder='Username' />
                        {errors.username ? <div className='errormessage'>{errors.username?.message}</div> : null}
                    </div>
                    
                    <div className='inputWrapper'>
                        <input {...register('password', {
                            required: 'password is required',
                            validate: validatePassword
                        })} className='formInput' type='password' onFocus={() => clearErrors('password')} placeholder='Password' />
                        {errors.password ? <div className='errormessage'>{errors.password?.message}</div> : null}
                    </div>
                    
                    {errors.credentials ? <div className='errormessage'>{errors?.credentials?.message}</div> : null}

                    <div className='formButtonWrapper'>
                        <button className='formButton' type='submit'>submit</button>
                        <button className='formButton' onClick={googleAuthButton}>google</button>
                    </div>
                </form>
                
                <div className='registerLinkWrapper'>
                    <p onClick={() => navigate('/register')}>New to the club? Register here</p>
                </div>
            </div>
        </LoginStyles>
    )
}

export default Login;
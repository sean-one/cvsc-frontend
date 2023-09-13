import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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

    const location = useLocation()
    let navigate = useNavigate();
    
    const navigateTo = location.state?.from || '/profile'
    
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

                    navigate(navigateTo)

                    return

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

                } else if (err.response.status === 500) {
                    dispatch({
                        type: "ADD_NOTIFICATION",
                        payload: {
                            notification_type: 'ERROR',
                            message: 'server error, please try again later'
                        }
                    })
                }
            })
    }

    const googleAuthButton = (e) => {
        e.preventDefault()
        window.open(`${process.env.REACT_APP_BACKEND_URL}/auth/google`, "_self")
    }

    console.log(location)
    return (
        <LoginStyles>
            <div className='loginWrap'>
                
                <div className='loginHeader'>Login</div>

                <form onSubmit={handleSubmit(sendLogin)} className='standardForm' onClick={() => clearErrors('credentials')}>
                    
                    {/* USERNAME */}
                    <div className='inputWrapper'>
                        <input {...register('username', {
                            required: 'username is required',
                            minLength: {
                                value: 3,
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
                    
                    {/* PASSWORD */}
                    <div className='inputWrapper'>
                        <input {...register('password', {
                            validate: value => validatePassword(value, true)
                        })} className='formInput' type='password' onFocus={() => clearErrors('password')} placeholder='Password' />
                        {errors.password ? <div className='errormessage'>{errors.password?.message}</div> : null}
                    </div>
                    
                    {errors.credentials ? <div className='errormessage'>{errors?.credentials?.message}</div> : null}
                    {errors.server ? <div className='errormessage'>{errors?.server?.message}</div> : null}

                    <div className='formButtonWrapper'>
                        <button type='submit'>submit</button>
                        <button onClick={googleAuthButton}>google</button>
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
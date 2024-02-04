import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';

import useAuth from '../hooks/useAuth';
import useNotification from '../hooks/useNotification';
import AxiosInstance from '../helpers/axios';
import { validatePassword, validateUsername } from './forms/utils/form.validations';

const LoginStyles = styled.div`
    .loginWrap {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        max-width: var(--max-page-width);
        margin: 0 auto;
        padding: 2.25rem 0.75rem;
    }

    .loginHeader {
        padding-left: 0.75rem;
        align-self: flex-start;
    }

    .registerLinkWrapper {
        display: flex;
        justify-content: center;
        margin-top: 3rem;
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
    
    const sendLogin = async (data) => {
        try {
            const login_response = await AxiosInstance.post('/auth/login', data)

            if (login_response?.status === 200) {
                setAuth({ user: login_response?.data })
        
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'SUCCESS',
                        message: `logged in as: ${data.username}`
                    }
                })
        
                navigate(navigateTo)
            } else {
                throw new Error('unexpected status code at sendLogin')
            }
        } catch (error) {
            console.log(error)
            if (error?.response?.status === 400 ) {
                setError(`${error.response.data.error.type}`, {
                    type: 'server',
                    message: error.response.data.error.message
                })
    
            } else {
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'ERROR',
                        message: 'unexpected error, please try again later'
                    }
                })
            }
        }
    }

    const googleAuthButton = (e) => {
        e.preventDefault()
        window.open(`http://localhost:3333/auth/google`, "_self")
    }

    
    return (
        <LoginStyles>
            <div className='loginWrap'>
                
                <div className='headerText loginHeader'>Login</div>

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
                        })} type='text' onFocus={() => clearErrors('username')} placeholder='Username' />
                        {errors.username ? <div className='errormessage'>{errors.username?.message}</div> : null}
                    </div>
                    
                    {/* PASSWORD */}
                    <div className='inputWrapper passwordInput'>
                        <input {...register('password', {
                            validate: value => validatePassword(value, true)
                        })} type='password' onFocus={() => clearErrors('password')} placeholder='Password' />
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
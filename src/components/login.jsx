import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';

import useAuth from '../hooks/useAuth';
import useNotification from '../hooks/useNotification';
import AxiosInstance from '../helpers/axios';
import { validateUsername } from './forms/utils/form.validations';
import PasswordInputToggle from './forms/password.input.view.toggle';

const LoginStyles = styled.div`
    .loginWrap {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        max-width: var(--max-section-width);
        margin: 0 auto;
        padding: 2.25rem 0.75rem;
    }

    .loginHeader {
        width: 100%;
        color: var(--main-highlight-color);
        padding-left: 0.75rem;
        text-align: center;
    }

    .registerLinkWrapper {
        color: var(--text-color);
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 1rem;
        text-align: center;
        margin-top: 3rem;
    }

    .logintimestamp {
        display: none;
    }

    #registerLink {
        cursor: pointer;
        color: var(--main-highlight-color);
    }

    .forgotPasswordLink {
        font-size: var(--small-font);
        color: var(--main-color);
    }


`;

const Login = () => {
    const { setAuth } = useAuth()
    const { dispatch } = useNotification()

    const location = useLocation()
    
    let navigate = useNavigate();
    
    useEffect(() => {
        const params = new URLSearchParams(location.search)
        const errorMessage = params.get('error')
        if (errorMessage) {
            if (errorMessage === 'google_email_duplicate') {
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'ERROR',
                        message: 'that google email is already verified'
                    }
                })
            } else {
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'ERROR',
                        message: 'an error sent you to the login'
                    }
                })
            }
        }

        // Remove the search parameters from the URL
        const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);

    }, [location, dispatch])

    const { register, handleSubmit, setError, clearErrors, control, formState:{ errors } } = useForm({
        mode: "onBlur",
        defaultValues: {
            username: location?.state?.username || '',
            password: '',
        }
    });
    
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
            }
            
        } catch (error) {
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
        window.open(`${process.env.REACT_APP_BACKEND_URL}/auth/google`, "_self")
    }

    console.log(location)
    return (
        <LoginStyles>
            <div className='loginWrap'>
                
                <div className='headerText loginHeader'>Login</div>

                <form onSubmit={handleSubmit(sendLogin)} className='standardForm' onClick={() => clearErrors(['credentials', 'server'])}>
                    
                    {/* USERNAME */}
                    <div className='inputWrapper'>
                        <input {...register('username', {
                            required: 'username is required',
                            minLength: {
                                value: 4,
                                message: 'must be at least 4 letters'
                            },
                            maxLength: {
                                value: 50,
                                message: 'too long, must be 20 characters or less'
                            },
                            validate: validateUsername,
                        })} type='text' onFocus={() => clearErrors(['username', 'server'])} placeholder='Username' />
                        {errors.username ? <div className='errormessage'>{errors.username?.message}</div> : null}
                    </div>
                    
                    {/* PASSWORD */}
                    <PasswordInputToggle
                        control={control}
                        inputName='password'
                        errors={errors}
                        clearErrors={clearErrors}
                    />

                    <div className='inputWrapper logintimestamp'>
                        <input {...register('logintimestamp')} type='text' autoComplete='off' />
                    </div>
                    
                    {errors.server ? <div className='errormessage'>{errors?.server?.message}</div> : null}

                    <div className='formButtonWrapper'>
                        <button type='submit'>submit</button>
                        <button onClick={googleAuthButton}>google</button>
                    </div>
                </form>
                
                <div className='registerLinkWrapper'>
                    <div onClick={() => navigate('/register')}>
                        New to the club? <span id='registerLink'>Register here</span>
                    </div>
                    <div className='forgotPasswordLink' onClick={() => navigate('/forgot-password')}>Forgot password?</div>
                </div>
            </div>
        </LoginStyles>
    )
}

export default Login;
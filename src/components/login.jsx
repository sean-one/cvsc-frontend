import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { loginSchema } from '../helpers/validationSchemas';
import { yupResolver } from '@hookform/resolvers/yup';
import styled from 'styled-components';

import useAuth from '../hooks/useAuth';
import useNotification from '../hooks/useNotification';
import AxiosInstance from '../helpers/axios';
import { FormInput } from './forms/formInput';

const Styles = styled.div`
    .loginHeader {
        padding-left: 1.5rem;
        padding-bottom: 1.5rem;
        align-self: flex-start;
    }

    .loginForm {
        width: 100%;
        max-width: 425px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 10px;
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
        resolver: yupResolver(loginSchema)
    });
    let navigate = useNavigate();

    
    const sendLogin = (data) => {
        AxiosInstance.post('/auth/local', data)
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
        <Styles>
            <div className='pageWrapper'>
                <div className='loginHeader'>
                    <h2>Login</h2>
                </div>
                <form onSubmit={handleSubmit(sendLogin)} className='loginForm' onClick={() => clearErrors('credentials')}>
                    
                    <FormInput id='username'
                        register={register}
                        onfocus={clearErrors}
                        placeholder='Username'
                        error={errors.username}
                    />

                    <FormInput id='password'
                        register={register}
                        onfocus={clearErrors}
                        placeholder='Password'
                        type='password'
                        error={errors.password}
                    />

                    <div className='errormessage'>{errors?.credentials?.message}</div>

                    <div className='formButtonWrapper'>
                        <button className='formButton' type='submit'>submit</button>
                        <button className='formButton' onClick={googleAuthButton}>google</button>
                    </div>

                </form>
                {/* <div onClick={() => clearErrors('credentials')}>
                </div> */}
                
                <div className='registerLinkWrapper'>
                    <p onClick={() => navigate('/register')}>New to the club? Register here</p>
                </div>
            </div>
        </Styles>
    )
}

export default Login;
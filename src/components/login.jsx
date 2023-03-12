import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { loginSchema } from '../helpers/validationSchemas';
import { yupResolver } from '@hookform/resolvers/yup';
import styled from 'styled-components';

import useAuth from '../hooks/useAuth';
import useNotification from '../hooks/useNotification';
import AxiosInstance from '../helpers/axios';

const Styles = styled.div`
    .loginWrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        max-width: 500px;
        padding: 1.5rem 0.5rem;
        box-shadow: 5px 5px 5px #0D2B12;
        border-radius: 5px;
        background-color: rgba(75,111,81,0.3);

        @media(min-width: 500px) {
            /* border: 1px solid red; */
        }
    }

    .loginHeader {
        padding-left: 1.5rem;
        padding-bottom: 1.5rem;
        align-self: flex-start;
    }

    .loginForm {
        align-content: center;
        max-width: 325px;
        margin-bottom: 2rem;
    }

    .buttonWrapper {
        margin-top: 1.5rem;
        width: 100%;
        display: flex;
        justify-content: center;
    }

    .loginInputs {
        box-shadow: 5px 5px 5px #0D2B12;
    }

    .loginButtons {
        margin: 0 1rem;
    }

    .registerLinkWrapper {
        display: flex;
        justify-content: center;
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
            <div className='loginWrapper'>
                <div className='loginHeader'>
                    <h2>Login</h2>
                </div>
                <div>
                    <form onSubmit={handleSubmit(sendLogin)} className='loginForm'>
                        <input
                            className={`loginInputs ${errors.username ? 'inputError' : ''}`}
                            {...register('username')}
                            // autoFocus
                            onFocus={() => clearErrors('username')}
                            type='text'
                            name='username'
                            placeholder='Username'
                            required
                        />
                        <div className='errormessage'>{errors.username?.message}</div>

                        <input
                            className={`loginInputs ${errors.password ? 'inputError' : ''}`}
                            {...register('password')}
                            onFocus={() => clearErrors('password')}
                            name='password'
                            type='password'
                            placeholder='Password'
                            required
                        />
                        <div className='errormessage'>{errors.password?.message}</div>
                        <div className='errormessage'>{errors.credentials?.message}</div>

                        <div className='buttonWrapper'>
                            <button className='loginButtons' type='submit'>submit</button>
                            <button className='loginButtons' onClick={googleAuthButton}>google</button>
                        </div>

                    </form>
                </div>
                
                <div className='registerLinkWrapper'>
                    <p onClick={() => navigate('/register')}>New to the club? Register here</p>
                </div>
            </div>
        </Styles>
    )
}

export default Login;
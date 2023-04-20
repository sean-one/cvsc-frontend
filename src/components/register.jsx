import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import styled from 'styled-components';

import { registrationSchema } from '../helpers/validationSchemas.js';
import AxiosInstance from '../helpers/axios';
import useNotification from '../hooks/useNotification.js';
import { FormInput } from './forms/formInput.js';
import useAuth from '../hooks/useAuth.js';


const Styles = styled.div`
    .registerWrap {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        max-width: var(--max-page-width);
        margin: 0 auto;
        padding: 1.5rem 0.5rem;
        box-shadow: 5px 5px 5px var(--box-shadow-color);
        border-radius: 5px;
        background-color: var(--page-wrapper-background-color);
    }

    .registerHeader {
        padding-left: 1.5rem;
        padding-bottom: 1.5rem;
        align-self: flex-start;
    }

    .registerForm {
        width: 100%;
        max-width: 425px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 10px;
    }

    .loginLinkWrapper {
        display: flex;
        justify-content: center;
        margin-top: 2rem;
    }
`;

const Register = () => {
    const { setAuth } = useAuth();
    const { dispatch } = useNotification();

    const { register, handleSubmit, setError, clearErrors, formState:{ errors } } = useForm({
        mode: "onBlur",
        resolver: yupResolver(registrationSchema)
    })
    
    let navigate = useNavigate();

    const createUser = async (data) =>{
        // remove password confirmation
        delete data['confirmation']
        
        AxiosInstance.post('/auth/local', data)
            .then(response => {
                if (response.status === 200) {
                    setAuth({ user: response.data.user, roles: response.data.roles })
                    
                    dispatch({
                        type: "ADD_NOTIFICATION",
                        payload: {
                            notification_type: 'SUCCESS',
                            message: `${data.username} has been created and logged in`
                        }
                    })

                    // forward to profile page
                    navigate('/profile');
                }
            })
            .catch(error => {
                // console.log(error)
                if(error.response.status === 400) {
                    setError(`${error.response.data.error.type}`, {
                        type: 'server',
                        message: error.response.data.error.message
                    })
                }
            })
    }

    const googleAuthButton = (e) => {
        e.preventDefault()
        window.open(`${process.env.REACT_APP_BACKEND_URL}/auth/google`, '_self')
    }
    
    return (
        <Styles>
            <div className='registerWrap'>
                
                <div className='registerHeader'>
                    <h2>Register</h2>
                </div>
                
                <form onSubmit={handleSubmit(createUser)} className='registerForm'>

                    <FormInput id='username'
                        register={register}
                        onfocus={clearErrors}
                        placeholder='Username'
                        error={errors.username}
                    />

                    <FormInput id='email'
                        register={register}
                        onfocus={clearErrors}
                        placeholder='Email'
                        error={errors.email}
                    />

                    <FormInput id='password'
                        register={register}
                        onfocus={clearErrors}
                        placeholder='Password'
                        type='password'
                        error={errors.password}
                        />
                    
                    <FormInput id='confirmation'
                        register={register}
                        onfocus={clearErrors}
                        placeholder='Confirm Password'
                        type='password'
                        error={errors.confirmation}
                    />
                    
                    <div className='errormessage'>{errors.invalid_input?.message}</div>
                    
                    <div className='formButtonWrapper'>
                        <button className='formButton' type='submit'>submit</button>
                        <button className='formButton' onClick={googleAuthButton} disabled={true} >google</button>
                    </div>
                
                </form>

                <div className='loginLinkWrapper'>
                    <p onClick={() => navigate('/login')}>Already have a login? Login here.</p>
                </div>
                
            </div>
        </Styles>
    )
}

export default Register;
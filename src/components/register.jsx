import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import styled from 'styled-components';

import { registrationSchema } from '../helpers/validationSchemas.js';
import AxiosInstance from '../helpers/axios';
import useNotification from '../hooks/useNotification.js';
import { FormInput } from './forms/formInput.js';

const Styles = styled.div`
    .registerHeader {
        padding-left: 1.5rem;
        padding-bottom: 1.5rem;
        align-self: flex-start;
    }

    .loginLinkWrapper {
        display: flex;
        justify-content: center;
        margin-top: 2rem;
    }
`;

const Register = () => {
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
            <div className='pageWrapper'>
                
                <div className='registerHeader'>
                    <h2>Register</h2>
                </div>
                
                <div>
                    <form onSubmit={handleSubmit(createUser)}>

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
                            error={errors.password}
                        />
                        
                        <FormInput id='confirmation'
                            register={register}
                            onfocus={clearErrors}
                            placeholder='Confirm Password'
                            error={errors.confirmation}
                        />
                        
                        <div className='errormessage'>{errors.invalid_input?.message}</div>
                        
                        <div className='formButtonWrapper'>
                            <button className='formButton' type='submit'>submit</button>
                            <button className='formButton' onClick={googleAuthButton}>google</button>
                        </div>
                    
                    </form>
                </div>

                <div className='loginLinkWrapper'>
                    <p onClick={() => navigate('/login')}>Already have a login? Login here.</p>
                </div>
                
            </div>
        </Styles>
    )
}

export default Register;
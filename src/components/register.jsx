import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import styled from 'styled-components';

import { registrationSchema } from '../helpers/validationSchemas.js';
import AxiosInstance from '../helpers/axios';
import useNotification from '../hooks/useNotification.js';

const Styles = styled.div`
    .registerForm {
        margin-bottom: 2rem;
    }

    .buttonWrapper {
        margin-top: 1.5rem;
        width: 100%;
        display: flex;
        justify-content: center;
    }

    .registerInputs {
        box-shadow: 5px 5px 5px #0D2B12;
    }

    .registerButtons {
        margin: 0 1rem;
    }

    .loginLinkWrapper {
        display: flex;
        justify-content: center;
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
            <div>
                <h2>Register</h2>
                <form onSubmit={handleSubmit(createUser)} className='registerForm'>

                    <input
                        className={`registerInputs ${errors.username ? 'inputError' : ''}`}
                        onFocus={() => clearErrors('username')}
                        {...register('username')}
                        type="text"
                        placeholder="Username"
                        name='username'
                        required
                    />
                    <div className='errormessage'>{errors.username?.message}</div>

                    <input
                        className={`registerInputs ${errors.password ? 'inputError' : ''}`}
                        onFocus={() => clearErrors('password')}
                        {...register('password')}
                        type="password"
                        placeholder="Password"
                        name='password'
                        required
                    />
                    <div className='errormessage'>{errors.password?.message}</div>

                    <input
                        className={`registerInputs ${errors.confirmation ? 'inputError' : ''}`}
                        onFocus={() => clearErrors('confirmation')}
                        {...register('confirmation')}
                        type="password"
                        placeholder="Confirm Password"
                        name='confirmation'
                        required
                    />
                    <div className='errormessage'>{errors.confirmation?.message}</div>
                    
                    <div className='errormessage'>{errors.invalid_input?.message}</div>
                    
                    <div className='buttonWrapper'>
                        <button className='registerButtons' type='submit'>submit</button>
                        <button className='registerButtons' onClick={googleAuthButton}>google</button>
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
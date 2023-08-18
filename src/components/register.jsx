import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';

import AxiosInstance from '../helpers/axios';
import useNotification from '../hooks/useNotification.js';
import useAuth from '../hooks/useAuth.js';
import { emailformat, validatePassword, validateUsername } from './forms/form.validations.js';
import useImagePreview from '../hooks/useImagePreview';
import { AddImageIcon } from './icons/siteIcons';
import { setImageForForm } from '../helpers/setImageForForm';
import LoadingSpinner from './loadingSpinner';


const RegisterStyles = styled.div`
    .registerWrap {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        max-width: var(--max-page-width);
        margin: 0 auto;
        padding: 1.5rem 0.5rem;
    }

    .registerHeader {
        width: 100%;
        text-align: center;
        margin-bottom: 1rem;
        font-size: 1.8rem;
        font-weight: bold;
        align-self: flex-start;
    }

    .registerImagePreview {
        width: 100%;
        max-width: 350px;
        margin: 1rem auto;

        @media (min-width: 500px) {
            width: 100%;
        }

        canvas {
            max-width: 100%;
            border: 1px solid #DCDBC4;
            border-radius: 50%;
            display: block;
            box-shadow: 5px 5px 5px #010A00;
        }
    }

    .loginLinkWrapper {
        display: flex;
        justify-content: center;
        margin-top: 2rem;
    }
`;

const Register = () => {
    const { setAuth } = useAuth();
    const { editImage, imagePreview, canvas, setEditImage, imageIsLoading } = useImagePreview()
    const { dispatch } = useNotification();

    const { register, handleSubmit, setError, clearErrors, formState:{ errors } } = useForm({
        mode: "onBlur",
    })
    
    let navigate = useNavigate();

    const createUser = async (data) =>{
        try {
            const formData = new FormData()

            if(canvas.current !== null) {
                try {
                    let avatar = setImageForForm(canvas)
                    formData.set('avatar', avatar)
    
                    canvas.current.getContext('2d').clearRect(0, 0, canvas.current.width, canvas.current.height);
                    setEditImage(false)

                } catch (error) {
                    setError('avatar', { message: 'image upload error' })
                }
            }

            // confirm password and delete extra confirmation field
            if(data.password !== data.confirmation) {
                setError('credentials', { message: 'password and confirmation must match' })
            } else {
                delete data['confirmation']
            }

            // add data fields to formData object for post request
            Object.keys(data).forEach(key => {
                formData.append(key, data[key])
            })
            
            const response = await AxiosInstance.post('/auth/register', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            
            // if successful add newly loggen in user to auth and forward to profile
            if (response.status === 201) {
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
        } catch (error) {
            
            if(error?.response?.status === 400) {
                setError(error.response.data.error.type, { message: error.response.data.error.message })
            }
            
            else if(error?.response?.status === 409) {
                setError(error.response.data.error.type, { message: error.response.data.error.message })

            }
            
            else {
                dispatch({
                    type: "ADD_NOTIFICATION",
                    notification_type: 'ERROR',
                    message: 'something went wrong - uncaught error'
                })
            }
        }
        
    }

    const googleAuthButton = (e) => {
        e.preventDefault()
        window.open(`${process.env.REACT_APP_BACKEND_URL}/auth/google`, '_self')
    }
    
    return (
        <RegisterStyles>
            <div className='registerWrap'>
                
                <div className='registerHeader'>Register new Account</div>
                
                <form onSubmit={handleSubmit(createUser)} className='standardForm'>

                    {/* USERNAME */}
                    <div className='inputWrapper'>
                        <input {...register('username', {
                            required: 'username is required',
                            minLength: {
                                value: 4,
                                message: 'must be at least 4 characters'
                            },
                            maxLength: {
                                value: 50,
                                message: 'username too long'
                            },
                            validate: validateUsername
                        })} className='formInput' type='text' onFocus={() => clearErrors('username')} placeholder='Username' />
                        {errors.username ? <div className='errormessage'>{errors.username?.message}</div> : null}
                    </div>

                    { imageIsLoading && <LoadingSpinner /> }
                    {
                        editImage &&
                            <div className='registerImagePreview'>
                                <canvas id={'userAvatarPreview'} ref={canvas} />
                            </div>
                    }

                    <div className='formRowInputIcon'>
                        {/* EMAIL */}
                        <div className='inputWrapper'>
                            <input {...register('email', {
                                required: 'valid email is required',
                                pattern: {
                                    value: emailformat,
                                    message: 'invalid email format'
                                }
                            })} className='formInput' type='text' onFocus={() => clearErrors('email')} placeholder='Email' />
                        </div>
                        
                        {/* AVATAR IMAGE UPLOAD */}
                        <label htmlFor='avatar' className='formInput inputLabel'>
                            <AddImageIcon />
                            <input {...register('avatar')} id='avatar' className='inputLabelInput' type='file' accept='image/*' onChange={(e) => imagePreview(e)} />
                        </label>
                    </div>
                    {errors.email ? <div className='errormessage'>{errors.email?.message}</div> : null}

                    {/* PASSWORD */}
                    <div className='inputWrapper'>
                        <input {...register('password', {
                            required: 'password is required',
                            validate: validatePassword
                        })} className='formInput' type='password' onFocus={() => clearErrors(['password', 'credentials'])} placeholder='Password' />
                        {errors.password ? <div className='errormessage'>{errors.password?.message}</div> : null}
                    </div>
                    
                    {/* CONFIRMATION */}
                    <div className='inputWrapper'>
                        <input {...register('confirmation', {
                            required: 'password confirmation is required',
                            validate: validatePassword
                        })} className='formInput' type='password' onFocus={() => clearErrors(['confirmation', 'credentials'])} placeholder='Confirm Password' />
                        {errors.confirmation ? <div className='errormessage'>{errors.confirmation?.message}</div> : null}
                    </div>
                    
                    {errors.credentials ? <div className='errormessage'>{errors.credentials?.message}</div> : null}
                    
                    <div className='formButtonWrapper'>
                        <button type='submit'>submit</button>
                        <button onClick={googleAuthButton}>google</button>
                    </div>
                
                </form>

                <div className='loginLinkWrapper'>
                    <p onClick={() => navigate('/login')}>Already have a login? Login here.</p>
                </div>
                
            </div>
        </RegisterStyles>
    )
}

export default Register;
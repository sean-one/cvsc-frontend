import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';

import AxiosInstance from '../helpers/axios';
import useNotification from '../hooks/useNotification.js';
import useAuth from '../hooks/useAuth.js';
import { emailformat, validatePassword, validateUsername } from './forms/utils/form.validations.js';
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
        padding: 2.25rem 0.75rem;
    }

    .registerHeader {
        padding-left: 0.75rem
        align-self: flex-start;
    }

    .registerImagePreview {
        width: 100%;
        max-width: 350px;
        margin: 1.5rem auto;

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

    .passwordContraintText {
        font-size: var(--small-font);
    }

    .loginLinkWrapper {
        display: flex;
        justify-content: center;
        margin-top: 3rem;
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
                    setError('avatar', { message: 'image upload error, please try again' })
                }
            }

            // confirm password and delete extra confirmation field
            if(data.password !== data.confirmation) {
                throw new Error('non_matching_password')
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
                setAuth({ user: response?.data })
                
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
            if (error?.message === 'non_matching_password') {
                setError('credentials', { message: 'password and confirmation must match' })
            }
            else if(error?.response?.status === 400) {
                setError(error?.response?.data?.error?.type, { message: error?.response?.data?.error?.message })
            }

            else if(error?.response?.status === 500) {
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'ERROR',
                        message: 'server error, please try again later'
                    }
                })
            }
            
            else {
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'ERROR',
                        message: 'something went wrong - uncaught error'
                    }
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
                
                <div className='headerText registerHeader'>Register new Account</div>
                
                <form onSubmit={handleSubmit(createUser)} className='standardForm'>

                    {/* USERNAME */}
                    <div className='inputWrapper'>
                        <input {...register('username', {
                            required: 'username is required',
                            minLength: {
                                value: 4,
                                message: 'username must be at least 4 characters'
                            },
                            maxLength: {
                                value: 50,
                                message: 'username is too long'
                            },
                            validate: validateUsername
                        })} type='text' onFocus={() => clearErrors('username')} placeholder='Username' />
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
                            })} type='text' onFocus={() => clearErrors('email')} placeholder='Email' />
                        </div>
                        
                        {/* AVATAR IMAGE UPLOAD */}
                        <label htmlFor='avatar' className='inputLabel'>
                            <AddImageIcon />
                            <input {...register('avatar')} id='avatar' className='inputLabelInput' type='file' accept='image/*' onChange={(e) => imagePreview(e)} />
                        </label>
                    </div>
                    {errors.email ? <div className='errormessage'>{errors.email?.message}</div> : null}

                    {/* PASSWORD */}
                    <div className='inputWrapper'>
                        <input {...register('password', {
                            validate: validatePassword
                        })} type='password' onFocus={() => clearErrors(['password', 'credentials'])} placeholder='Password' />
                        {errors.password ? <div className='errormessage'>{errors.password?.message}</div> : null}
                        {/* <div className='passwordContraintText'>must be 8+ characters with a mix of upper, lower, numbers</div> */}
                    </div>
                    
                    {/* CONFIRMATION */}
                    <div className='inputWrapper'>
                        <input {...register('confirmation', {
                            required: 'password confirmation is required',
                            validate: validatePassword
                        })} type='password' onFocus={() => clearErrors(['confirmation', 'credentials'])} placeholder='Confirm Password' />
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
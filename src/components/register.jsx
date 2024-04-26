import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';

import AxiosInstance from '../helpers/axios';
import useNotification from '../hooks/useNotification.js';
import useAuth from '../hooks/useAuth.js';
import { emailformat, validateUsername } from './forms/utils/form.validations.js';
import ImageUploadAndCrop from '../helpers/imageUploadAndCrop.js';
import { TbCameraPlus } from 'react-icons/tb';
import PasswordInputToggle from './forms/password.input.view.toggle.js';


const RegisterStyles = styled.div`
    .registerWrap {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        max-width: var(--max-section-width);
        margin: 0 auto;
        padding: 2.25rem 0.75rem;
    }

    .registerHeader {
        width: 100%;
        color: var(--main-highlight-color);
        padding-left: 0.75rem;
        text-align: center;
    }

    .loginLinkWrapper {
        color: var(--text-color);
        display: flex;
        justify-content: center;
        margin-top: 3rem;
    }

    .userwebsite {
        display: none;
    }

    #loginLink {
        cursor: pointer;
        color: var(--main-highlight-color);
    }
`;

const Register = () => {
    const [ croppedImage, setCroppedImage ] = useState(null);
    const [ previewImageUrl, setPreviewImageUrl ] = useState('');
    const { setAuth } = useAuth();
    const { dispatch } = useNotification();

    const { register, handleSubmit, setError, clearErrors, setValue, control, formState:{ errors } } = useForm({
        mode: "onBlur",
        defaultValues: {
            password: '',
            confirmation: '',
        }
    })

    const onImageCropped = useCallback((croppedBlob) => {
        setCroppedImage(croppedBlob);

        const previewImageURL = URL.createObjectURL(croppedBlob)
        setPreviewImageUrl(previewImageURL)

        let avatar = new File([croppedBlob], 'avatar.jpeg', { type: croppedBlob.type })
        // React Hook Form for handling cropped image
        setValue('avatar', avatar); // This allows you to include the cropped image in the form data
    }, [setValue]);
    
    let navigate = useNavigate();

    const createUser = async (data) =>{
        console.log(data)
        try {
            const formData = new FormData()

            if (croppedImage) {
                formData.set('avatar', data.avatar[0]);
            }

            // confirm password and delete extra confirmation field
            if(data.password !== data.confirmation) {
                throw new Error('non_matching_password')
            } else {
                delete data['confirmation']
            }
            
            // add data fields to formData object for post request
            Object.keys(data).forEach(key => {
                if (key !== 'userwebsite') {
                    formData.append(key, data[key])
                }
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
                        })} type='text' onChange={() => clearErrors('username')} placeholder='Username' autoComplete='off'/>
                        {errors.username ? <div className='errormessage'>{errors.username?.message}</div> : null}
                    </div>

                    <div className='inputWrapper userwebsite'>
                        <input {...register('userwebsite')} type='text' placeholder='Website' autoComplete='off' />
                    </div>

                    {
                        previewImageUrl && (
                            <div className='imagePreview profileImage'>
                                <img src={previewImageUrl} alt='user profile avatar' />
                            </div>
                        )
                    }
                    <ImageUploadAndCrop
                        onImageCropped={onImageCropped}
                        registerInput={register}
                        imageShape='round'
                        registerName='avatar'
                    />

                    <div className='formRowInputIcon'>
                        {/* EMAIL */}
                        <div className='inputWrapper'>
                            <input {...register('email', {
                                required: 'valid email is required',
                                pattern: {
                                    value: emailformat,
                                    message: 'invalid email format'
                                }
                            })} type='text' onChange={() => clearErrors('email')} placeholder='Email' autoComplete='off'/>
                        </div>
                        
                        {/* AVATAR IMAGE UPLOAD */}
                        <label htmlFor='avatar' className='inputLabel'>
                            <TbCameraPlus className='siteIcons' />
                        </label>
                    </div>
                    {errors.email ? <div className='errormessage'>{errors.email?.message}</div> : null}

                    {/* PASSWORD */}
                    <PasswordInputToggle
                        control={control}
                        inputName='password'
                        errors={errors}
                        clearErrors={clearErrors}
                    />
                    
                    {/* CONFIRMATION */}
                    <PasswordInputToggle
                        control={control}
                        inputName='confirmation'
                        errors={errors}
                        clearErrors={clearErrors}
                    />                    
                    {errors.credentials ? <div className='errormessage'>{errors.credentials?.message}</div> : null}
                    
                    <div className='formButtonWrapper'>
                        <button type='submit'>submit</button>
                        <button onClick={googleAuthButton}>google</button>
                    </div>
                
                </form>

                <div className='loginLinkWrapper'>
                    <p onClick={() => navigate('/login')}>Already have a login? <span id='loginLink'>Login here</span></p>
                </div>
                
            </div>
        </RegisterStyles>
    )
}

export default Register;
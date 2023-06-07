import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';

import AxiosInstance from '../helpers/axios';
import useNotification from '../hooks/useNotification.js';
import useAuth from '../hooks/useAuth.js';
import { validateEmail, validatePassword, validateUsername } from './forms/form.validations.js';
import useImagePreview from '../hooks/useImagePreview';
import { AddImageIcon } from './icons/siteIcons';
import { setImageForForm } from '../helpers/setImageForForm';


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
        font-size: 1.8rem;
        font-weight: bold;
        align-self: flex-start;
    }

    .registerForm {
        width: 100%;
        margin-top: 0.5rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .emailImageRow {
        display: flex;
        justify-content: space-between;

        div {
            flex-grow: 1;
            margin-right: 0.5rem;
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
    const { editImage, imagePreview, canvas, setEditImage } = useImagePreview()
    const { dispatch } = useNotification();

    const { register, handleSubmit, setError, clearErrors, formState:{ errors } } = useForm({
        mode: "onBlur",
    })
    
    let navigate = useNavigate();

    const createUser = async (data) =>{
        console.log(data)
        try {
            const formData = new FormData()

            if(canvas.current !== null) {
                let avatar = setImageForForm(canvas)

                formData.set('avatar', avatar)
            }

            if(data.password !== data.confirmation) {
                setError('credentials', { message: 'password and confirmation must match' })
            } else {
                // remove password confirmation
                delete data['confirmation']
            }

            Object.keys(data).forEach(key => {
                formData.append(key, data[key])
            })
            
            const response = await AxiosInstance.post('/auth/local', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            
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
        } catch (error) {
            console.log(error)
        }
        
    }

    const googleAuthButton = (e) => {
        e.preventDefault()
        window.open(`${process.env.REACT_APP_BACKEND_URL}/auth/google`, '_self')
    }
    
    return (
        <RegisterStyles>
            <div className='registerWrap'>
                
                <div className='registerHeader'>Register</div>
                
                <form onSubmit={handleSubmit(createUser)} className='registerForm'>

                    {/* USERNAME */}
                    <div className='inputWrapper'>
                        <input {...register('username', {
                            required: 'username is required',
                            minLength: {
                                value: 4,
                                message: 'must be at least 4 characters'
                            },
                            maxLength: {
                                value: 20,
                                message: 'username too long'
                            },
                            validate: validateUsername
                        })} className='formInput' type='text' onFocus={() => clearErrors('username')} placeholder='Username' />
                        {errors.username ? <div className='errormessage'>{errors.username?.message}</div> : null}
                    </div>

                    {
                        editImage &&
                            <div className='formImage formCirclePreview'>
                                <canvas id={'userAvatarPreview'} ref={canvas} />
                            </div>
                    }

                    <div className='emailImageRow'>
                        {/* EMAIL */}
                        <div className='inputWrapper'>
                            <input {...register('email', {
                                required: 'valid email is required',
                                validate: validateEmail,
                            })} className='formInput' type='text' onFocus={() => clearErrors('email')} placeholder='Email' />
                            {errors.email ? <div className='errormessage'>{errors.email?.message}</div> : null}
                        </div>
                        
                        {/* AVATAR IMAGE UPLOAD */}
                        <label htmlFor='avatar' className='formInput imageLabel'>
                            <AddImageIcon />
                            <input {...register('avatar')} id='avatar' className='imageLabelInput' type='file' accept='image/*' onChange={(e) => imagePreview(e)} />
                        </label>
                    </div>

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
        </RegisterStyles>
    )
}

export default Register;
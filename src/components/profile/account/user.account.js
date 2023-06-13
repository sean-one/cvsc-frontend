import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrashAlt, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';

import useAuth from '../../../hooks/useAuth';
import useNotification from '../../../hooks/useNotification'
import { useEventsQuery } from '../../../hooks/useEventsApi';
import default_profile from '../../../assets/default_user.png'
import useImagePreview from '../../../hooks/useImagePreview';
import { role_types } from '../../../helpers/dataCleanUp';
import AxiosInstance from '../../../helpers/axios';
import { setImageForForm } from '../../../helpers/setImageForForm';
import { validateEmail, validatePassword } from '../../forms/form.validations';
import { AddImageIcon } from '../../icons/siteIcons';

const UserAccountStyles = styled.div`

    .userAccountPage {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        margin: 0 auto;
        padding: 1.5rem 0.5rem;
        box-shadow: 5px 5px 5px var(--box-shadow-color);
        border-radius: 5px;
        background-color: var(--page-wrapper-background-color);
        
        @media (min-width: 500px) {
            flex-direction: row;
            justify-content: space-between;
            padding: 1.5rem;
        }}

    .profileImage {
        max-width: 275px;
        
        @media (min-width: 500px) {
            margin: 0.5rem;
            width: 40%;
        }

        canvas {
            max-width: 100%;
            border: 1px solid #dcdbc4;
            display: block;
            box-shadow: 5px 5px 5px #010a00;
            border-radius: 50%;
        }
        
        img {
            width: 100%;
            border: 1px solid #dcdbc4;
            display: block;
            box-shadow: 5px 5px 5px #010a00;
            border-radius: 50%;
        }}
    
    .accountDetails {
        width: 100%;
        align-self: start;
        padding-top: 1rem;
        
        @media (min-width: 500px) {
            display: flex;
            flex-direction: column;
            width: 60%;
            padding-top: 0;
            padding-left: 1rem;
            align-self: stretch;
        }}
    
    .profileHeader {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;}
    
    .usernameHeader {
        font-weight: bold;
        font-size: 1.5rem;
        align-self: flex-end;}
    
    .accountTypeHeader {
        align-self: flex-end;}

    .userDetails {
        height: 100%;}

    .accountButtons {
        display: flex;
        justify-content: flex-end;
        gap: 10px;}

    .updateWrapper {
        display: flex;
        justify-content: space-between;
        align-content: center;}
`

const UserAccount = () => {
    const { dispatch } = useNotification()
    const [ editView, setEditView ] = useState(false)
    const { refetch } = useEventsQuery()
    const { auth, logout_user, setAuth } = useAuth()
    const { editImage, imagePreview, canvas, setEditImage } = useImagePreview()

    let navigate = useNavigate()

    const { register, handleSubmit, clearErrors, setError, reset, formState: { errors } } = useForm({
        mode: 'onBlur',
        defaultValues: {
            email: auth.user?.email,
            avatar: '',
        }
    })

    const update_user = async (data) => {
        try {
            const formData = new FormData()
            
            // remove avatar field, if image is attached will be taken from canvas
            delete data['avatar']

            // confirm changes made to email
            if(auth.user?.email === data.email) { delete data['email'] }

            // confirm password and confirmation match - EMPTY STRING WILL MATCH
            if(data.password !== data.confirmation) {
                setError('credentials', { message: 'password and confirmation must match' })
            } else { delete data['confirmation'] }
            
            // delete password if it is only an empty string
            if(data.password === '') { delete data['password'] }
            
            if((Object.keys(data).length === 0) && (canvas.current === null)) {
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'ERROR',
                        message: `error - no changes were found`
                    }
                })

                setEditImage(false)
                reset()

                return
            } else {

                Object.keys(data).forEach(key => {
                    formData.append(key, data[key])
                })
            }
            
            if(canvas.current !== null) {
                // get the image ready and set it to formData
                let user_avatar = setImageForForm(canvas)
                formData.set('avatar', user_avatar)

                // clear the canvas
                canvas.current.getContext('2d').clearRect(0, 0, canvas.current.width, canvas.current.height);
                setEditImage(false)
            }

            const updated_user_response = await AxiosInstance.post('/users/update', formData)

            if(updated_user_response.status === 201) {
                
                setAuth({ user: updated_user_response.data.user, roles: updated_user_response.data.roles })
                
                setEditView(false)
                // setImagePreview(updated_user_response.data.user?.avatar)

                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'SUCCESS',
                        message: 'account has been updated'
                    }
                })
                
                reset()
            }

            return

        } catch (error) {

            if(error?.response.status === 400) {
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'ERROR',
                        message: `error - no changes were made`
                    }
                })
            } else {
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'ERROR',
                        message: 'user update server error'
                    }
                })
            }

        }
    }

    const close_edit_view = () => {
        // setImagePreview(auth?.user?.avatar)
        setEditView(false)
        setEditImage(false)
        reset()
    }

    const delete_account = async () => {
        try {
            const deleted_user_response = await AxiosInstance.delete('/users/delete')
            
            if(deleted_user_response.status === 204) {
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'SUCCESS',
                        message: 'user account has been deleted'
                    }
                })
    
                logout_user()
                refetch()
    
                navigate('/')
            }
        } catch (error) {
            if(error?.response?.status === 401) {
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'ERROR',
                        message: 'credentials not found - please login'
                    }
                })
                
                logout_user()
                refetch()
                
                navigate('/login')
            } else {
                console.log(error)
            }
        }
        
    }


    return (
        <UserAccountStyles>
            <div className='userAccountPage'>
                
                <div className='profileImage'>
                    {
                        editImage
                            ? <canvas
                                id={'avatarImagePreview'}
                                ref={canvas}
                            />
                            : <img
                                src={
                                    (auth?.user?.avatar === null)
                                        ? default_profile
                                        : `${process.env.REACT_APP_BACKEND_IMAGE_URL}${auth?.user?.avatar}`
                                }
                                alt={`user avatar`}
                            />
                    }
                </div>
                
                <div className='accountDetails'>

                    <div className='profileHeader'>
                        <div className='usernameHeader'>{auth?.user.username}</div>
                        <div className='accountTypeHeader'>{role_types[auth.user.account_type].type}</div>
                    </div>

                    <div className='userDetails'>
                        {
                            (!editView)
                                ? <div className={`m-0 ${(auth?.user?.email === null) ? 'd-none' : ''}`}>
                                    {auth?.user.email}
                                </div>
                                : <form encType='multipart/form-data' className='standardForm'>
                                    
                                    <div className='formRowInputIcon'>
                                        {/* EMAIL */}
                                        <div className='inputWrapper'>
                                            <input {...register('email', {
                                                validate: validateEmail
                                            })} className='formInput' type='text' onFocus={() => clearErrors('email')} placeholder='Email' />
                                            {errors.email ? <div className='errormessage'>{errors.email?.message}</div> : null}
                                        </div>

                                        {/* AVATAR UPLOAD */}
                                        <label htmlFor='avatar' className='formInput inputLabel'>
                                            <AddImageIcon />
                                            <input {...register('avatar')} id='avatar' className='inputLabelInput' type='file' accept='image/*' onChange={(e) => imagePreview(e)} />
                                        </label>
                                    </div>
                                    
                                    {/* PASSWORD */}
                                    <div className='inputWrapper'>
                                        <input {...register('password', {
                                            validate: validatePassword
                                        })} className='formInput' type='password' onFocus={() => clearErrors(['password', 'credentials'])} placeholder='New Password' />
                                        {errors.password ? <div className='errormessage'>{errors.password?.message}</div> : null}
                                    </div>

                                    {/* CONFIRMATION */}
                                    <div className='inputWrapper'>
                                        <input {...register('confirmation', {
                                            validate: validatePassword
                                        })} className='formInput' type='password' onFocus={() => clearErrors(['confirmation', 'credentials'])} placeholder='Confirm New Password' />
                                        {errors.confirmation ? <div className='errormessage'>{errors.confirmation?.message}</div> : null}
                                    </div>

                                    {errors.credentials ? <div className='errormessage'>{errors.credentials?.message}</div> : null}

                                </form>
                        }
                    </div>

                    <div className='accountButtons'>
                        {
                            (editView) &&
                                <button onClick={() => delete_account()}>
                                    <FontAwesomeIcon icon={faTrashAlt}/>
                                </button>
                        }
                        {
                            (editView) &&
                                <button onClick={() => close_edit_view()}>
                                    <FontAwesomeIcon icon={faTimes}/>
                                </button>
                        }
                        {
                            (editView) &&
                                <button onClick={handleSubmit(update_user)}>
                                    <FontAwesomeIcon icon={faSave}/>
                                </button>
                        }
                        {
                            (!editView) &&
                                <button onClick={() => setEditView(true)}>
                                    <FontAwesomeIcon icon={faPencilAlt}/>
                                </button>
                        }
                    </div>
                    
                </div>
            </div>
        </UserAccountStyles>
    )
}

export default UserAccount;
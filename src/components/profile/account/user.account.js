import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrashAlt, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import { yupResolver } from '@hookform/resolvers/yup';
import styled from 'styled-components';

import useAuth from '../../../hooks/useAuth';
import { FormInput, CheckBox, ImageInput } from '../../forms/formInput';
import useNotification from '../../../hooks/useNotification'
import { useEventsQuery } from '../../../hooks/useEventsApi';
import default_profile from '../../../assets/default_user.png'
import useImagePreview from '../../../hooks/useImagePreview';
import { role_types } from '../../../helpers/dataCleanUp';
import AxiosInstance from '../../../helpers/axios';
import { editUserSchema } from '../../../helpers/validationSchemas';
import { setImageForForm } from '../../../helpers/setImageForForm';

const Styles = styled.div`

    .userAccountPage {
        width: 100%;
        
        @media (min-width: 500px) {
            flex-direction: row;
            justify-content: space-between;
            padding: 1.5rem;
        }
    }

    .profileImage {
        max-width: 275px;
        
        @media (min-width: 500px) {
            margin: 0.5rem;
            width: 40%;
        }
    }
    
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
        }
    }
    
    .profileHeader {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
    }
    
    .usernameHeader {
        font-weight: bold;
        font-size: 1.5rem;
        align-self: flex-end;
    }
    
    .accountTypeHeader {
        align-self: flex-end;
    }

    .userDetails {
        height: 100%;
    }

    .accountButtons {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
    }

    .updateWrapper {
        display: flex;
        justify-content: space-between;
        align-content: center;
    }
`


const UserAccount = () => {
    const { dispatch } = useNotification()
    const [ editView, setEditView ] = useState(false)
    const { refetch } = useEventsQuery()
    const { auth, logout_user, setAuth } = useAuth()
    const { editImage, imagePreview, canvas, setEditImage } = useImagePreview()

    let navigate = useNavigate()

    const { register, handleSubmit, clearErrors, watch, reset, formState: { isDirty, dirtyFields, errors } } = useForm({
        mode: 'onBlur',
        resolver: yupResolver(editUserSchema),
        defaultValues: {
            email: auth.user?.email,
            avatar: '',
            password: '',
            confirmation: '',
            update_password: false,
            update_image: false,
        }
    })

    const update_password = watch('update_password', false)
    const update_image = watch('update_image', false)

    const update_user = async (data) => {
        try {
            const formData = new FormData()
            
            if(update_image) {
                let user_avatar = setImageForForm(canvas)
                
                formData.set('avatar', user_avatar)
            }

            delete data['update_image']

            if(data?.update_password) {
                formData.append('password', data['password'])
                delete data['password']
                delete data['confirmation']
            }

            delete data['update_password']

            // remove entries unchaged
            for (const [key] of Object.entries(data)) {
                if (!Object.keys(dirtyFields).includes(key)) {
                    delete data[key]
                }
            }

            // append everything left changed from the form
            Object.keys(data).forEach(key => {
                formData.append(key, data[key])
            })

            const updated_user_response = await AxiosInstance.post('/users/update_user', formData)

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
            }

        } finally {

            setEditView(false)
            reset()
            
        }
    }

    const close_edit_view = () => {
        // setImagePreview(auth?.user?.avatar)
        setEditView(false)
        setEditImage(false)
        reset()
    }

    const delete_account = async () => {

        const deleted_user_response = await AxiosInstance.delete('/users/remove_user')
        
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
        
    }


    return (
        <Styles>
            <div className='pageWrapper userAccountPage'>
                
                <div className='formImage formCirclePreview profileImage'>
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
                                : <form encType='multipart/form-data'>
                                    <FormInput id='email'
                                        register={register}
                                        onfocus={clearErrors}
                                        type='email'
                                        error={errors.email}
                                    />
                                    {
                                        (update_image) &&
                                            <ImageInput id='avatar'
                                                register={register}
                                                onfocus={clearErrors}
                                                error={errors.avatar}
                                                change={imagePreview}
                                            />
                                    }
                                    {/* update image and password checkboxes */}
                                    <div className='updateWrapper'>
                                        <CheckBox id='update_password'
                                            register={register}
                                            boxlabel='Update Password'
                                        />
                                        {
                                            (!update_image) &&
                                                <CheckBox id='update_image'
                                                    register={register}
                                                    boxlabel='Update Image'
                                                />
                                        }
                                    </div>
                                    {/* update password and confirm password fields */}
                                    {
                                        (update_password) &&
                                            <div>
                                                <FormInput id='password'
                                                    register={register}
                                                    onfocus={clearErrors}
                                                    type='password'
                                                    placeholder='Password'
                                                    error={errors.password}
                                                />

                                                <FormInput id='confirmation'
                                                    register={register}
                                                    onfocus={clearErrors}
                                                    type='password'
                                                    placeholder='Confirm Password'
                                                    error={errors.confirmation}
                                                />
                                            </div>
                                    }
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
                            (editView && isDirty) &&
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
        </Styles>
    )
}

export default UserAccount;
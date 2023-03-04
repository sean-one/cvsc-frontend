import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrashAlt, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Button, FloatingLabel, Form, Image } from 'react-bootstrap';
import { yupResolver } from '@hookform/resolvers/yup';
import styled from 'styled-components';

import useAuth from '../../../hooks/useAuth';
import useNotification from '../../../hooks/useNotification'
import { useEventsQuery } from '../../../hooks/useEventsApi';
import default_profile from '../../../assets/default_user_icon.png'
import useAvatarPreview from '../../../hooks/useAvatarPreview';
import { role_types } from '../../../helpers/dataCleanUp';
import AxiosInstance from '../../../helpers/axios';
import { editUserSchema } from '../../../helpers/validationSchemas';

const Styles = styled.div`

    .userAccount {
        display: flex;
        flex-direction: column;
        padding: 3rem 0.5rem;
        box-shadow: 5px 5px 5px #0D2B12;
        border-radius: 5px;
        
        @media (min-width: 500px) {
            flex-direction: row;
        }
    }

    .userAvatar {
        width: 100%;
        max-width: 275px;
        margin: auto;
        border: 1px solid red;
        
        @media (min-width: 500px) {
            width: 40%;
        }
    }
    
    .userCanvas {
        border-radius: 50%;
        max-width: 100%;
    }
    
    .userDetails {
        border: 1px solid red;
        width: 100%;
        align-self: start;
        padding-top: 1rem;
        
        @media (min-width: 500px) {
            width: 60%;
            padding-top: 0;
            padding-left: 1rem;
            align-self: center;
        }
    }

`


const UserAccount = () => {
    const { dispatch } = useNotification()
    const [ editView, setEditView ] = useState(false)
    const { refetch } = useEventsQuery()
    const { auth, logout_user, setAuth } = useAuth()
    const { editImage, imagePreview, canvas, setEditImage } = useAvatarPreview()

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
                let canvas_image = canvas.current.toDataURL("image/webp", 1.0)
                
                let [mime, image_data] = canvas_image.split(',')
                mime = mime.match(/:(.*?);/)[1]

                let data_string = atob(image_data)
                let data_length = data_string.length
                let image_array = new Uint8Array(data_length)

                while(data_length--) { image_array[data_length] = data_string.charCodeAt(data_length) }

                let user_avatar = new File([image_array], 'user_avatar.jpeg', { type: mime })
                
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
            <div className='userAccount'>
                
                <div className='userAvatar'>
                    {
                        editImage
                            ? <canvas
                                className='userCanvas'
                                id={'avatarImagePreview'}
                                ref={canvas}
                            />
                            : <Image
                                fluid
                                thumbnail
                                roundedCircle
                                src={(auth?.user?.avatar === null) ? default_profile : `${process.env.REACT_APP_BACKEND_IMAGE_URL}${auth?.user?.avatar}`}
                                alt={`user avatar`}
                            />
                    }
                </div>
                
                <div className='userDetails'>
                    <h2>{auth?.user.username}</h2>
                    <div>{`Account Type: ${role_types[auth.user.account_type].type}`}</div>

                    {
                        (editView)
                            ? <form encType='multipart/form-data'>

                                <input
                                    className={errors.email ? 'inputError' : ''}
                                    {...register('email')}
                                    onFocus={() => clearErrors('email')}
                                    type='email'
                                    name='email'
                                />
                                <div className='errormessage'>{errors.email?.message}</div>

                                {
                                    (update_image) &&
                                        <div>
                                            <input
                                                className={errors.avatar ? 'inputError' : ''}
                                                {...register('avatar')}
                                                onFocus={() => clearErrors('avatar')}
                                                type='file'
                                                name='avatar'
                                                accept='image/*'
                                                onChange={(e) => imagePreview(e)}
                                            />
                                            <div className='errormessage'>{errors.profile_image?.message}</div>
                                        </div>
                                }

                                <div className='centerElement'>
                                    <input
                                        {...register('update_password')}
                                        type='checkbox'
                                        label='Update Password'
                                    />
                                    <label>Update Password</label>

                                    {
                                        (!update_image) &&
                                            <input
                                                {...register('update_image')}
                                                type='checkbox'
                                                label='Update Image'
                                            />
                                    }
                                </div>

                                {
                                    (update_password) &&
                                        <div>
                                            <input
                                                className={errors.password ? 'inputError' : ''}
                                                onFocus={() => clearErrors('password')}
                                                {...register('password')}
                                                type='password'
                                                name='password'
                                            />
                                            <div className='errormessage'>{errors.password?.message}</div>

                                            <input
                                                className={errors.confirmation ? 'inputError' : ''}
                                                onFocus={() => clearErrors('confirmation')}
                                                {...register('confirmation')}
                                                type='password'
                                                name='confirmation'
                                            />
                                            <div className='errormessage'>{errors.confirmation?.message}</div>
                                        </div>
                                }

                            </form>
                            : <div className={`m-0 ${(auth?.user?.email === null) ? 'd-none' : ''}`}>{auth?.user.email}</div>
                    }
                    
                    <div>
                        {
                            (editView) &&
                                <button onClick={() => delete_account()}><FontAwesomeIcon icon={faTrashAlt}/></button>
                        }
                        {
                            (editView) &&
                                <button onClick={() => close_edit_view()}><FontAwesomeIcon icon={faTimes}/></button>
                        }
                        {
                            (editView && isDirty) &&
                                <button onClick={handleSubmit(update_user)}><FontAwesomeIcon icon={faSave}/></button>
                        }
                        {
                            (!editView) &&
                                <button onClick={() => setEditView(true)}><FontAwesomeIcon icon={faPencilAlt}/></button>
                        }
                    </div>
                </div>
            </div>
        </Styles>
    )
}

export default UserAccount;
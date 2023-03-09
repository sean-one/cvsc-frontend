import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrashAlt, faSave, faTimes, faCamera } from '@fortawesome/free-solid-svg-icons';
import { yupResolver } from '@hookform/resolvers/yup';
import styled from 'styled-components';

import useAuth from '../../../hooks/useAuth';
import useNotification from '../../../hooks/useNotification'
import { useEventsQuery } from '../../../hooks/useEventsApi';
import default_profile from '../../../assets/default_user.png'
import useAvatarPreview from '../../../hooks/useAvatarPreview';
import { role_types } from '../../../helpers/dataCleanUp';
import AxiosInstance from '../../../helpers/axios';
import { editUserSchema } from '../../../helpers/validationSchemas';

const Styles = styled.div`

    .userProfileWrapper {
        display: flex;
        flex-direction: column;
        padding: 1.5rem 0.5rem;
        box-shadow: 5px 5px 5px #0D2B12;
        border-radius: 5px;
        background-color: rgba(75,111,81,0.3);
        
        @media (min-width: 500px) {
            flex-direction: row;
        }
    }

    .profileImage {
        width: 100%;
        max-width: 275px;
        margin: auto;
        
        @media (min-width: 500px) {
            width: 40%;
        }

        canvas {
            border-radius: 50%;
            max-width: 100%;
        }

        img {
            width: 100%;
            border-radius: 50%;
            border: 1px solid #dcdbc4;
            display: block;
            box-shadow: 5px 5px 5px #010a00;
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

    .imageUpdateInput {
        cursor: pointer;
        height: 3rem;
        width: 100%;
        padding: 0.5rem;
        border: none;
        color: #DAD7CD;
        border-radius: 5px;
        border-bottom: 1px solid black;
        background-color: #4B6F51;
        outline: none;
        text-align: center;

        .cameraIcon {
            color: #DAD7CD;
            margin-left: 0.25rem;
        }

        input {
            display: none;
        }
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
            <div className='userProfileWrapper'>
                
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
                                ? <div className={`m-0 ${(auth?.user?.email === null) ? 'd-none' : ''}`}>{auth?.user.email}</div>
                                : <form encType='multipart/form-data'>

                                    <input
                                        {...register('email')}
                                        className={errors.email ? 'inputError' : ''}
                                        onFocus={() => clearErrors('email')}
                                        type='email'
                                        name='email'
                                    />
                                    <div className='errormessage'>{errors.email?.message}</div>

                                    {
                                        (update_image) &&
                                            <label for='avatar' className='imageUpdateInput'>
                                                Select Image
                                                <FontAwesomeIcon icon={faCamera} className='cameraIcon' />
                                                <input
                                                    {...register('avatar')}
                                                    className={errors.avatar ? 'inputError' : ''}
                                                    onFocus={() => clearErrors('avatar')}
                                                    type='file'
                                                    id='avatar'
                                                    name='avatar'
                                                    accept='image/*'
                                                    onChange={(e) => imagePreview(e)}
                                                />
                                            </label>
                                    }
                                    <div className='errormessage'>{errors.profile_image?.message}</div>

                                    {/* update image and password checkboxes */}
                                    <div className='updateWrapper'>

                                        <label for='update_password' className='updateCheckbox'>
                                            <input
                                                {...register('update_password')}
                                                type='checkbox'
                                                name='update_password'
                                            />
                                            Update Password
                                        </label>

                                        {
                                            (!update_image) &&
                                                <label for='update_image' className='updateCheckbox'>
                                                    <input
                                                        {...register('update_image')}
                                                        type='checkbox'
                                                        name='update_image'
                                                    />
                                                    Update Image
                                                </label>
                                        }

                                    </div>

                                    {/* update password and confirm password fields */}
                                    {
                                        (update_password) &&
                                            <div>
                                                <input
                                                    className={errors.password ? 'inputError' : ''}
                                                    onFocus={() => clearErrors('password')}
                                                    {...register('password')}
                                                    type='password'
                                                    name='password'
                                                    placeholder='Password'
                                                />
                                                <div className='errormessage'>{errors.password?.message}</div>

                                                <input
                                                    className={errors.confirmation ? 'inputError' : ''}
                                                    onFocus={() => clearErrors('confirmation')}
                                                    {...register('confirmation')}
                                                    type='password'
                                                    name='confirmation'
                                                    placeholder='Confirm Password'
                                                />
                                                <div className='errormessage'>{errors.confirmation?.message}</div>
                                            </div>
                                    }

                                </form>
                        }
                    </div>

                    <div className='accountButtons'>
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
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button, FloatingLabel, Form, Image } from 'react-bootstrap';
import { yupResolver } from '@hookform/resolvers/yup'

import useAuth from '../../../hooks/useAuth';
import useNotification from '../../../hooks/useNotification'
import useWindowSize from '../../../hooks/useWindowSize';
import { useEventsQuery } from '../../../hooks/useEventsApi';
import default_profile from '../../../assets/default_user_icon.png'
import useAvatarPreview from '../../../hooks/useAvatarPreview';
import { role_types } from '../../../helpers/dataCleanUp';
import AxiosInstance from '../../../helpers/axios';
import { editUserSchema } from '../../../helpers/validationSchemas';


const UserAccount = () => {
    const { dispatch } = useNotification()
    const [ editView, setEditView ] = useState(false)
    const { refetch } = useEventsQuery()
    const { auth, logout_user, setAuth } = useAuth()
    const { editImage, imagePreview, canvas, setEditImage } = useAvatarPreview()

    let navigate = useNavigate()
    const [width] = useWindowSize()

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
        // <div className={`d-flex ${(width < 830) ? 'justify-content-between' : 'flex-column'} border mb-3`}>
        <div className={`d-flex flex-column border mb-3`}>
            
            <div className='mt-2 p-2 text-center'>
                {
                    editImage
                        ? <canvas
                            className='rounded-circle'
                            id={'avatarImagePreview'}
                            ref={canvas}
                        />
                        : <Image
                            className='userAvatar'
                            thumbnail
                            roundedCircle
                            src={(auth?.user?.avatar === null) ? default_profile : `${process.env.REACT_APP_BACKEND_IMAGE_URL}${auth?.user?.avatar}`}
                            alt={`user avatar`}
                        /> 
                }
            </div>
            
            <div className='d-flex justify-content-between w-75'>
                <div className={`d-flex flex-column ${width > 830 ? 'justify-content-center' : ''} w-100 px-2`}>
                    <h2>{auth?.user.username}</h2>
                    {
                        (editView)
                            ? <Form encType='multipart/form-data'>

                                <Form.Group controlId='email' className='mb-2'>
                                    <FloatingLabel controlId='email' label='Update Email'>
                                        <Form.Control
                                            className={errors.email ? 'inputError' : ''}
                                            {...register('email')}
                                            onFocus={() => clearErrors('email')}
                                            type='email'
                                            name='email'
                                        />
                                    </FloatingLabel>
                                    <div className='errormessage'>{errors.email?.message}</div>
                                </Form.Group>

                                {
                                    (update_image) &&
                                        <Form.Group controlId='avatar' className='mb-2'>
                                            <Form.Control
                                                className={errors.avatar ? 'inputError' : ''}
                                                {...register('avatar')}
                                                onFocus={() => clearErrors('avatar')}
                                                type='file'
                                                name='avatar'
                                                accept='image/*'
                                                onChange={(e) => imagePreview(e)}
                                            />
                                            <div className='errormessage'>{errors.profile_image?.message}</div>
                                        </Form.Group>
                                }

                                <div className='d-flex justify-content-between align-items-center'>
                                    <Form.Group controlId='update_password'>
                                        <Form.Check
                                            className='mb-2'
                                            {...register('update_password')}
                                            type='checkbox'
                                            label='Update Password'
                                        />
                                    </Form.Group>

                                    {
                                        (!update_image) &&
                                            <Form.Group controlId='update_image'>
                                                <Form.Check
                                                    className='mb-2'
                                                    {...register('update_image')}
                                                    type='checkbox'
                                                    label='Update Image'
                                                />
                                            </Form.Group>
                                    }
                                </div>

                                {
                                    (update_password) &&
                                        <div>
                                            <Form.Group controlId='password' className='mb-2'>
                                                <FloatingLabel controlId='password' label='Update Password'>
                                                    <Form.Control
                                                        className={errors.password ? 'inputError' : ''}
                                                        onFocus={() => clearErrors('password')}
                                                        {...register('password')}
                                                        type='password'
                                                        name='password'
                                                    />
                                                </FloatingLabel>
                                                <div className='errormessage'>{errors.password?.message}</div>
                                            </Form.Group>

                                            <Form.Group controlId='confirmation' className='mb-2'>
                                                <FloatingLabel controlId='confirmation' label='Confirm New Password'>
                                                    <Form.Control
                                                        className={errors.confirmation ? 'inputError' : ''}
                                                        onFocus={() => clearErrors('confirmation')}
                                                        {...register('confirmation')}
                                                        type='password'
                                                        name='confirmation'
                                                    />
                                                </FloatingLabel>
                                                <div className='errormessage'>{errors.confirmation?.message}</div>
                                            </Form.Group>
                                        </div>
                                }

                            </Form>
                            : <div className={`m-0 ${(auth?.user?.email === null) ? 'd-none' : ''}`}>{auth?.user.email}</div>
                    }
                    <div className='m-0'>{`Account Type: ${role_types[auth.user.account_type]}`}</div>
                    <div className='d-flex justify-content-between align-items-center my-2'>
                        {
                            (editView) &&
                                <Button variant='outline-danger' className={`text-danger ${(!editView) ? 'd-none' : 'w-50'}`} onClick={() => delete_account()}>
                                    delete account
                                </Button>
                        }
                        <div className='d-flex justify-content-end text-end align-self-end m-0'>
                            {
                                (editView && isDirty) &&
                                    <Button variant='outline-dark' className='ms-1' onClick={handleSubmit(update_user)}>
                                        save
                                    </Button>
                            }
                            {
                                (!editView) &&
                                    <Button variant='outline-dark' onClick={() => setEditView(true)}>
                                        edit account
                                    </Button>
                            }
                            {
                                (editView) &&
                                    <Button variant='outline-dark' className='ms-1' onClick={() => close_edit_view()}>
                                        close
                                    </Button>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserAccount;
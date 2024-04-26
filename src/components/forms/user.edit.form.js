import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { useQueryClient } from '@tanstack/react-query';
import { TbCameraPlus } from 'react-icons/tb';

import useAuth from '../../hooks/useAuth';
import useNotification from '../../hooks/useNotification';
import { validatePassword, emailformat, validateUsername } from './utils/form.validations';
import AxiosInstance from '../../helpers/axios';
import ImageUploadAndCrop from '../../helpers/imageUploadAndCrop';
import { eventKeys, businessKeys, roleKeys } from '../../helpers/queryKeyFactories';

const UserEditFormStyles = styled.div`
    .userEditFormWrapper {
        width: 100%;
        max-width: var(--max-section-width);
        margin: 0 auto;
    }
`;


const UserEditForm =({ setEditView }) => {
    const { auth, setAuth } = useAuth()
    const [ croppedImage, setCroppedImage ] = useState(null);
    const [ previewImageUrl, setPreviewImageUrl ] = useState('');
    const { dispatch } = useNotification()
    const queryClient = useQueryClient();

    const { register, handleSubmit, clearErrors, setError, setValue, reset, formState: { dirtyFields, errors } } = useForm({
        mode: 'onBlur',
        defaultValues: {
            username: auth?.user?.username,
            email: auth?.user?.email,
            avatar: null,
            password: '',
            confirmation: ''
        }
    })

    const onImageCropped = useCallback((croppedBlob) => {
        setCroppedImage(croppedBlob);

        const previewImageURL = URL.createObjectURL(croppedBlob)
        setPreviewImageUrl(previewImageURL)

        let avatar = new File([croppedBlob], 'avatar.jpeg', { type: croppedBlob.type })
        // React Hook Form for handling cropped image
        setValue('avatar', avatar, { shouldDirty: true }); // This allows you to include the cropped image in the form data
    }, [setValue]);

    let navigate = useNavigate()

    const sendUpdate = async (data) => {
        try {
            // no changes registered - send notificate and do not hit api
            if(Object.keys(data).length === 0) {
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'ERROR',
                        message: `error - no changes were found`
                    }
                })
    
                reset()
    
                return
            }
            const formData = new FormData()
    
            // if image is attached set as avatar or else remove 'avatar' from data
            if (croppedImage) {
                formData.set('avatar', data.avatar[0]);
            } else {
                delete data['avatar']
            }
    
            // delete unchanged data
            for (const [key] of Object.entries(data)) {
                if(!Object.keys(dirtyFields).includes(key)) {
                    delete data[key]
                }
            }
    
            // if passwords dont match throw error else delete confirmation
            if(data.password !== data.confirmation) {
                setError('credentials', { message: 'password and confirmation must match' })

                return
            } else {
                delete data['confirmation']
            }

            // append any remaining updated fields to formData
            Object.keys(data).forEach(key => {
                formData.append(key, data[key])
            })
    
            const userUpdateResponse = await AxiosInstance.post('/users/update', formData)
    
            if(userUpdateResponse.status === 201) {
                setAuth({ user: userUpdateResponse?.data })
    
                setEditView(false)
    
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'SUCCESS',
                        message: 'your account has been successfully updated'
                    }
                })
    
                reset()
            }
    
            return
            
        } catch (error) {
            console.log(error)
            if(error?.response?.status === 404) {
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'ERROR',
                        message: error?.response?.data?.error?.message
                    }
                })
            } else if(error?.response?.status === 401 || error?.response?.status === 403) {
                // removed expired token and remove auth
                localStorage.removeItem('jwt')
                setAuth(null)
                
                dispatch({
                    type:"ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'ERROR',
                        message: `${error.response.data.error.message}`
                    }
                })

                return navigate('/login')

            } else if(error?.response?.status === 400) {
                if (error?.response?.data?.error?.type === 'server') {
                    dispatch({
                        type: "ADD_NOTIFICATION",
                        payload: {
                            notification_type: 'ERROR',
                            message: error?.response?.data?.error?.message
                        }
                    })
                } else {
                    setError(`${error?.response?.data?.error?.type}`, {
                        message: `${error?.response?.data?.error?.message}`
                    })
                }
            } else {

                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'ERROR',
                        message: 'unhandled user edit error'
                    }
                })
            }
        }
    }

    const cancelEdit = () => {
        setEditView(false)
        reset()
    }

    const deleteUser = async () => {
        try {
            const deleteUserResponse = await AxiosInstance.delete('/users/delete')

            console.log(deleteUserResponse)
            if(deleteUserResponse.status === 204) {
                localStorage.removeItem('jwt')
                setAuth(null)
                
                await Promise.all([
                    queryClient.invalidateQueries({ queryKey: eventKeys.all }),
                    queryClient.invalidateQueries({ queryKey: roleKeys.all }),
                    queryClient.invalidateQueries({ queryKey: businessKeys.all }),

                ])

                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'SUCCESS',
                        message: 'user account has been delete'
                    }
                })
            }

            //! logout_user() - useing refetch from useEventsQuery need to look at something different or uncomment
            // refetch()
            
            navigate('/')
            
        } catch (error) {
            console.log('return error')
            console.log(error)
            
            if(error?.response?.status === 401) {
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'ERROR',
                        message: 'credentials not found - please login'
                    }
                })
                
                //! logout_user() - useing refetch from useEventsQuery need to look at something different or uncomment
                // refetch()

                navigate('/login')
            } else {
                console.log(error)
            }
        }
    }


    return (
        <UserEditFormStyles>
            <div className='userEditFormWrapper standardFormBackground'>
                {
                    previewImageUrl &&
                        <div className='imagePreview profileImage'>
                            <img src={previewImageUrl} alt='user profile avatar' />
                        </div>
                }
                <ImageUploadAndCrop
                    onImageCropped={onImageCropped}
                    registerInput={register}
                    imageShape='round'
                    registerName='avatar'
                />
                <form onSubmit={handleSubmit(sendUpdate)} encType='multipart/form-data' className='standardForm'>
                    {/* USERNAME */}
                    <div className='inputWrapper'>
                        <input {...register('username', {
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

                    {/* EVENT AND PROFILE IMAGE UPDATE */}
                    <div className='formRowInputIcon'>

                        {/* EMAIL */}
                        <div className='inputWrapper'>
                            <input {...register('email', {
                                pattern: {
                                    value: emailformat,
                                    message: 'invalid email format'
                                }
                            })} type='text' onFocus={() => clearErrors('email')} placeholder='Email' />
                        </div>

                        {/* AVATAR / PROFILE IMAGE UPDATE */}
                        <label htmlFor='avatar' className='inputLabel' onClick={() => clearErrors('avatar')}>
                            <TbCameraPlus className='siteIcons' />
                        </label>
                    </div>
                    {errors.email ? <div className='errormessage'>{errors?.email?.message}</div> : null}

                    {/* PASSWORD */}
                    <div className='inputWrapper'>
                        <input {...register('password', {
                            validate: value => validatePassword(value, false)
                        })} type='password' onFocus={() => clearErrors(['password', 'credentials'])} placeholder='New Password' />
                        {errors.password ? <div className='errormessage'>{errors.password?.message}</div> : null}
                    </div>

                    {/* CONFIRM PASSWORD */}
                    <div className='inputWrapper'>
                        <input {...register('confirmation', {
                            validate: value => validatePassword(value, false)
                        })} type='password' onFocus={() => clearErrors(['confirmation', 'credentials'])} placeholder='Confirm New Password' />
                        {errors.confirmation ? <div className='errormessage'>{errors.confirmation?.message}</div> : null}
                    </div>
                    {errors.credentials ? <div className='errormessage'>{errors.credentials?.message}</div> : null}
                
                    <div className='formButtonWrapper'>
                        <button type='submit'>Update</button>
                        <div className='buttonLike' onClick={cancelEdit}>Close</div>
                        <div className='buttonLike' onClick={deleteUser}>Delete</div>
                    </div>

                </form>
            </div>
        </UserEditFormStyles>
    )
}

export default UserEditForm;
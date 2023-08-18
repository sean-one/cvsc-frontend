import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import useAuth from '../../hooks/useAuth';
import useImagePreview from '../../hooks/useImagePreview';
import useNotification from '../../hooks/useNotification';
import { useEventsQuery } from '../../hooks/useEventsApi';
import { AddImageIcon } from '../icons/siteIcons';
import { validatePassword, emailformat, validateUsername } from './form.validations';
import { setImageForForm } from '../../helpers/setImageForForm';
import AxiosInstance from '../../helpers/axios';

const UserEditForm =({ setEditView }) => {
    const { auth, setAuth, logout_user } = useAuth()
    const { dispatch } = useNotification()
    const { refetch } = useEventsQuery()
    const { editImage, canvas, imagePreview, setEditImage } = useImagePreview()
    const { register, handleSubmit, clearErrors, setError, reset, formState: { dirtyFields, errors } } = useForm({
        mode: 'onBlur',
        defaultValues: {
            username: auth?.user?.username,
            email: auth?.user?.email,
            avatar: null,
            password: '',
            confirmation: ''
        }
    })

    let navigate = useNavigate()

    const sendUpdate = async (data) => {
        try {
            const formData = new FormData()
    
            // remove avatar field, if image is attached it will be taken from canvas
            delete data['avatar']
    
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
            
            // no changes registered - send notificate and do not hit api
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
            }

            // check for the canvas element and set image to formData
            if(canvas.current !== null) {
                // get the image ready and set it to formData
                let user_avatar = setImageForForm(canvas)
                formData.set('avatar', user_avatar)
    
                // clear the canvas
                // canvas.current.getContext('2d').clearRect(0, 0, canvas.current.width, canvas.current.height);
                // setEditImage(false)
            }

            // append any remaining updated fields to formData
            Object.keys(data).forEach(key => {
                formData.append(key, data[key])
            })
    
            const userUpdateResponse = await AxiosInstance.post('/users/update', formData)
    
            if(userUpdateResponse.status === 201) {
                setAuth({ user: userUpdateResponse.data.user, roles: userUpdateResponse.data.roles })
    
                setEditView(false)
    
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
            if(error?.response?.status === 401) {
                logout_user()
                
                dispatch({
                    type:"ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'ERROR',
                        message: `${error.response.data.error.message}`
                    }
                })

                return

            } else if(error?.response?.status === 400) {
                
                setError(`${error.response.data.error.type}`, {
                    message: `${error.response.data.error.message}`
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

    const cancelEdit = () => {
        setEditView(false)
        setEditImage(false)
        reset()
    }

    const deleteUser = async () => {
        try {
            const deleteUserResponse = await AxiosInstance.delete('/users/delete')

            if(deleteUserResponse.status === 204) {
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'SUCCESS',
                        message: 'user account has been delete'
                    }
                })
            }

            logout_user()
            refetch()

            navigate('/')

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
        <div>
            {
                editImage &&
                    <div className='formImage formCirclePreview'>
                        <canvas id={'avatarImagePreview'} ref={canvas} />
                    </div>
            }
            <form onSubmit={handleSubmit(sendUpdate)} encType='multipart/form-data' className='standardForm'>
                {/* USERNAME */}
                <div className='inputWrapper'>
                    <input {...register('username', {
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
                        })} className='formInput' type='text' onClick={() => clearErrors('email')} placeholder='Email' />
                    </div>

                    {/* AVATAR / PROFILE IMAGE UPDATE */}
                    <label htmlFor='avatar' className='formInput inputLabel' onClick={() => clearErrors('avatar')}>
                        <AddImageIcon />
                        <input {...register('avatar')} id='avatar' className='inputLabelInput' type='file' accept='image/*' onChange={(e) => imagePreview(e)} />
                    </label>
                </div>
                {errors.email ? <div className='errormessage'>{errors.email?.message}</div> : null}

                {/* PASSWORD */}
                <div className='inputWrapper'>
                    <input {...register('password', {
                        validate: value => validatePassword(value, false)
                    })} className='formInput' type='password' onClick={() => clearErrors(['password', 'credentials'])} placeholder='New Password' />
                    {errors.password ? <div className='errormessage'>{errors.password?.message}</div> : null}
                </div>

                {/* CONFIRM PASSWORD */}
                <div className='inputWrapper'>
                    <input {...register('confirmation', {
                        validate: value => validatePassword(value, false)
                    })} className='formInput' type='password' onClick={() => clearErrors(['confirmation', 'credentials'])} placeholder='Confirm New Password' />
                    {errors.confirmation ? <div className='errormessage'>{errors.confirmation?.message}</div> : null}
                </div>
                {errors.credentials ? <div className='errormessage'>{errors.credentials?.message}</div> : null}
            
                <div className='formButtonWrapper'>
                    <button type='submit'>Update</button>
                    <button onClick={cancelEdit}>Close</button>
                    <button onClick={deleteUser}>Delete</button>
                </div>

            </form>
        </div>
    )
}

export default UserEditForm;
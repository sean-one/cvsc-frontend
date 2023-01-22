import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FloatingLabel, Form, Image } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faPen, faWindowClose } from '@fortawesome/free-solid-svg-icons';

import useAuth from '../../../hooks/useAuth';
import default_profile from '../../../assets/default_user_icon.png'
import { image_link, role_types } from '../../../helpers/dataCleanUp';
import AxiosInstance from '../../../helpers/axios';


const UserAccount = () => {
    const [ editView, setEditView ] = useState(false)
    const { auth, setAuth } = useAuth()
    const [ imageFile, setImageFile ] = useState(auth?.user?.avatar)

    const { register, handleSubmit, clearErrors, watch, reset, formState: { isDirty, dirtyFields, errors } } = useForm({
        mode: 'onBlur',
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

    const image_preview = (e) => {
        console.log(e.target.files)
        if(e.target.files.length !== 0){
            setImageFile(URL.createObjectURL(e.target.files[0]))
        } else {
            setImageFile(auth?.user?.avatar)
        }
    }

    const update_user = async (data) => {
        try {
            const formData = new FormData()

            if(data?.avatar[0] && update_image) {
                formData.set('avatar', data['avatar'][0])
            }

            delete data['update_image']

            if(data?.update_password) {
                formData.append('password', data['password'])
                delete data['password']
                delete data['confimation']
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
                setImageFile(updated_user_response.data.user?.avatar)
                
                reset()
                // setValue('avatar', '')
                // setValue('update_image', false)
                // setValue('update_password', false)
            }

            return

        } catch (error) {
            console.log('error inside update_user in UserAccount')
            console.log(error)
        }
    }

    const close_edit_view = () => {
        setImageFile(auth?.user?.avatar)
        setEditView(false)
        reset()
    }


    return (
        <div className='d-flex flex-column border mb-3'>
            
            <div className='p-5 text-center'>
                <Image thumbnail roundedCircle src={(imageFile === null) ? default_profile : image_link(imageFile)} alt={`user avatar`} />
            </div>
            
            <div className='d-flex justify-content-between'>
                <div className='d-flex flex-column w-100 px-2'>
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
                                                onChange={(e) => image_preview(e)}
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

                                    <Form.Group controlId='update_image'>
                                        <Form.Check
                                            className='mb-2'
                                            {...register('update_image')}
                                            type='checkbox'
                                            label='Update Image'
                                        />
                                    </Form.Group>
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
                    <div className='d-flex justify-content-between align-items-center'>
                        <div className='m-0'>{`Account Type: ${role_types[auth.user.account_type]}`}</div>
                        <div className='text-end align-self-end p-2'>
                            {
                                (editView && isDirty) &&
                                    <FontAwesomeIcon className='ms-1' onClick={handleSubmit(update_user)} icon={faCheck} />
                            }
                            {
                                (!editView) &&
                                    <FontAwesomeIcon className='ms-1' onClick={() => setEditView(true)} icon={faPen} />
                            }
                            {
                                (editView) &&
                                    <FontAwesomeIcon className='ms-1' onClick={() => close_edit_view()} icon={faWindowClose} />
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserAccount;
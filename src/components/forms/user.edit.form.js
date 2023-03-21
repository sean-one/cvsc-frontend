import React from 'react';
import { useForm } from 'react-hook-form';
import { FormInput, ImageInput, CheckBox } from './formInput';
import { yupResolver } from '@hookform/resolvers/yup';
import { editUserSchema } from '../../helpers/validationSchemas';

import useAuth from '../../hooks/useAuth';


const UserEditForm = ({ imagepreview }) => {
    const { auth } = useAuth()

    const { register, clearErrors, watch, formState: { errors } } = useForm({
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

    return (
        <form encType='multipart/form-data'>
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
                    change={imagepreview}
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
    )
}

export default UserEditForm;
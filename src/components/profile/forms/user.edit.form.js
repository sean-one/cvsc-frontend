import React from 'react';
import { useForm } from 'react-hook-form';
import { Button, FloatingLabel, Form } from 'react-bootstrap';

const UserEditForm = () => {
    const { register, handleSubmit, clearErrors, watch, formState: { errors } } = useForm({
        mode: 'onBlur'
    })

    const image_attached = watch('image_attached', false)

    const updateProfile = async (data) => {
        console.log('click click')
        console.log(data)
    }

    return (
        <Form onSubmit={handleSubmit(updateProfile)} className='my-2'>

            <Form.Group controlId='image_attached' className='mb-2'>
                <Form.Check
                    {...register('image_attached')}
                    type='checkbox'
                    label='Update Profile Image'
                />
            </Form.Group>

            {
                (image_attached) &&
                <Form.Group controlId='avatar' className='mb-2'>
                    <Form.Control
                        className={errors.avatar ? 'inputError' : ''}
                        {...register('avatar')}
                        onFocus={() => clearErrors('avatar')}
                        type='file'
                        name='avatar'
                        accept='image/*'
                    />
                    <div className='errormessage'>{errors.avatar?.message}</div>
                </Form.Group>
            }

            <Form.Group controlId='email' className='mb-2'>
                <FloatingLabel controlId='email' label='Update Email'>
                    <Form.Control
                        className={errors.email ? 'inputError' : ''}
                        onFocus={() => clearErrors('email')}
                        type='email'
                        name='email'
                    />
                </FloatingLabel>
            </Form.Group>

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

            <Button type='submit'>Save</Button>

        </Form>
    )
}

export default UserEditForm;
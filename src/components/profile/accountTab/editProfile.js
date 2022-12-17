import React from 'react';
import { useForm } from 'react-hook-form';
import { Button, Form } from 'react-bootstrap';

const EditProfile = () => {
    const { register, handleSubmit, clearErrors, formState:{ errors } } = useForm({
        mode: 'onBlur'
    })

    const updateProfile = async (data) => {
        console.log('click click')
        console.log(data)
    }
    
    return (
        <Form onSubmit={handleSubmit(updateProfile)}>

            <Form.Group controlId='username'>
                <Form.Label>Username</Form.Label>
                <Form.Control
                    className={errors.username ? 'inputError' : ''}
                    onFocus={() => clearErrors('username')}
                    {...register('username')}
                    type='text'
                    placeholder='username'
                    name='username'
                />
                <div className='errormessage'>{errors.username?.message}</div>
            </Form.Group>

            <Form.Group controlId='password'>
                <Form.Label>Password</Form.Label>
                <Form.Control
                    className={errors.password ? 'inputError' : ''}
                    onFocus={() => clearErrors('password')}
                    {...register('password')}
                    type='password'
                    placehold='Password'
                    name='password'
                />
                <div className='errormessage'>{errors.password?.message}</div>
            </Form.Group>

            <Form.Group controlId='avatar'>
                <Form.Label>Profile Image</Form.Label>
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

            <Button type='submit'>Save</Button>
            
        </Form>
    )
}

export default EditProfile;
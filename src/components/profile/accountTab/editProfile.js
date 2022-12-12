import React from 'react';
import { useForm } from 'react-hook-form';
import { Form } from 'react-bootstrap';

const EditProfile = () => {
    const { register, handleSubmit, setError, clearErrors, formState:{ errors } } = useForm({
        mode: 'onBlur'
    })
    
    return (
        <Form>

            <Form.Group controlId='username'>
                <Form.Label>Username</Form.Label>
                <Form.Control
                    className={errors.username ? 'inputError' : ''}
                    onFocus={() => clearErrors('username')}
                    {...register('username')}
                    type='text'
                    placeholder='username'
                    name='username'
                    required
                />
            </Form.Group>
            <div className='errormessage'>{errors.username?.message}</div>

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
            </Form.Group>
            <div className='errormessage'>{errors.password?.message}</div>
            
        </Form>
    )
}

export default EditProfile;
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { loginSchema } from '../helpers/validationSchemas';
import { yupResolver } from '@hookform/resolvers/yup';
import { Form, Button, FloatingLabel } from 'react-bootstrap';
import styled from 'styled-components';

import useAuth from '../hooks/useAuth';
import useNotification from '../hooks/useNotification';
import AxiosInstance from '../helpers/axios';

const Styles = styled.div`
    input {
        background-color: transparent;
    }
`;

const Login = () => {
    const { setAuth } = useAuth()
    const { dispatch } = useNotification()

    const { register, handleSubmit, setError, clearErrors, formState:{ errors } } = useForm({
        mode: "onBlur",
        resolver: yupResolver(loginSchema)
    });
    let navigate = useNavigate();

    
    const sendLogin = (data) => {
        AxiosInstance.post('/auth/local', data)
            .then(response => {
                if(response.status === 200) {
                    setAuth({ user: response.data.user, roles: response.data.roles })

                    dispatch({
                        type: "ADD_NOTIFICATION",
                        payload: {
                            notification_type: 'SUCCESS',
                            message: `logged in as: ${data.username}`
                        }
                    })

                    // forward to profile page
                    navigate('/profile');

                } else {
                    dispatch({
                        type: "ADD_NOTIFICATION",
                        payload: {
                            notification_type: 'ERROR',
                            message: 'something went wrong, please try again'
                        }
                    })
                    throw new Error('invalid stuffs');
                }
            })
            .catch(err => {
                console.log(err)
                if (err.response.status === 400 ) {
                    setError(`${err.response.data.error.type}`, {
                        type: 'server',
                        message: err.response.data.error.message
                    })

                } else {
                    console.log(err.name + ': ' + err.message)
                    
                }
            })
    }

    const googleAuthButton = (e) => {
        e.preventDefault()
        window.open(`${process.env.REACT_APP_BACKEND_URL}/auth/google`, "_self")
    }


    return (
        <Styles>
            <h2>Login</h2>
            <Form onSubmit={handleSubmit(sendLogin)} className='mt-3'>
                
                <Form.Group controlId="username" className='mb-3'>
                    <FloatingLabel controlId='username' label='Username'>
                        <Form.Control
                            className={errors.username ? 'inputError' : ''}
                            {...register('username')}
                            // autoFocus
                            onFocus={() => clearErrors('username')}
                            type='text'
                            name='username'
                            placeholder='username'
                            required
                        />
                    </FloatingLabel>
                    <div className='errormessage'>{errors.username?.message}</div>
                </Form.Group>

                <Form.Group controlId="password" className='mb-3'>
                    <FloatingLabel controlId='password' label='Password'>
                        <Form.Control
                            className={errors.password ? 'inputError' : ''}
                            {...register('password')}
                            onFocus={() => clearErrors('password')}
                            name='password'
                            type='password'
                            placeholder='Password'
                            required
                        />
                    </FloatingLabel>
                    <div className='errormessage'>{errors.password?.message}</div>
                    <div className='errormessage'>{errors.credentials?.message}</div>
                </Form.Group>
                
                <div className='d-flex justify-content-center w-100'>
                    <div className='d-flex justify-content-between w-75'>
                        <Button className='w-50 mx-1' variant="outline-dark" type='submit'>Submit</Button>
                        <Button className='w-50 mx-1' variant='outline-dark' onClick={googleAuthButton}>Google Login</Button>
                    </div>
                </div>
            
            </Form>
            
            <div className='my-3 text-center'>
                <p>New to the club? <Link to={{ pathname: '/register' }}>Register</Link></p>
            </div>
        </Styles>
    )
}

export default Login;
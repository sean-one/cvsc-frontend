import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Col, Form, Button, Row, FloatingLabel } from 'react-bootstrap';

import { registrationSchema } from '../helpers/validationSchemas.js';
import AxiosInstance from '../helpers/axios';
import useNotification from '../hooks/useNotification.js';


const Register = () => {
    const { dispatch } = useNotification();

    const { register, handleSubmit, setError, clearErrors, formState:{ errors } } = useForm({
        mode: "onBlur",
        resolver: yupResolver(registrationSchema)
    })
    
    let navigate = useNavigate();

    const createUser = async (data) =>{
        // remove password confirmation
        delete data['confirmation']
        
        AxiosInstance.post('/auth/local', data)
            .then(response => {
                if (response.status === 200) {
                    dispatch({
                        type: "ADD_NOTIFICATION",
                        payload: {
                            notification_type: 'SUCCESS',
                            message: `${data.username} has been created and logged in`
                        }
                    })

                    // forward to profile page
                    navigate('/profile');
                }
            })
            .catch(error => {
                if(error.response.status === 400) {
                    setError(`${error.response.data.error.type}`, {
                        type: 'server',
                        message: error.response.data.error.message
                    })
                }
            })
    }

    const googleAuthButton = (e) => {
        e.preventDefault()
        window.open(`${process.env.REACT_APP_BACKEND_URL}/auth/google`, '_self')
    }
    
    return (
        <div className='innerContainer'>
            <h2>Register</h2>
            <Form onSubmit={handleSubmit(createUser)} className='mt-3'>
                <Form.Group controlId="username" className='mb-2'>
                    <FloatingLabel controlId='username' label='Username'>
                        <Form.Control
                            className={errors.username ? 'inputError' : ''}
                            onFocus={() => clearErrors('username')}
                            {...register('username')}
                            type="text"
                            placeholder="username"
                            name='username'
                            required
                        />
                    </FloatingLabel>
                    <div className='errormessage'>{errors.username?.message}</div>
                </Form.Group>

                <div className='d-flex'>
                    <Form.Group controlId="password" className='mb-2 w-100'>
                        <FloatingLabel controlId='Password' label='Password'>
                            <Form.Control
                                className={errors.password ? 'inputError' : ''}
                                onFocus={() => clearErrors('password')}
                                {...register('password')}
                                type="password"
                                placeholder="Password"
                                name='password'
                                required
                            />
                        </FloatingLabel>
                        <div className='errormessage'>{errors.password?.message}</div>
                    </Form.Group>

                    <Form.Group controlId="confirmation" className='mb-2 w-100'>
                        <FloatingLabel controlId='confirmation' label='Confirm Password'>
                            <Form.Control
                                className={errors.confirmation ? 'inputError' : ''}
                                onFocus={() => clearErrors('confirmation')}
                                {...register('confirmation')}
                                type="password"
                                placeholder="Confirm Password"
                                name='confirmation'
                                required
                            />
                        </FloatingLabel>
                        <div className='errormessage'>{errors.confirmation?.message}</div>
                    </Form.Group>
                </div>
                <div className='errormessage'>{errors.invalid_input?.message}</div>
                <div className='d-flex justify-content-between'>
                    <Button variant="outline-dark" type='submit'>
                        Submit
                    </Button>
                    <Button variant="outline-dark" onClick={googleAuthButton}>
                        Register with Google
                    </Button>
                </div>
            </Form>
            <Row>
                <Col className='d-flex flex-column justify-content-center align-items-center my-2'>
                    <p>already have a login? <Link to={{ pathname: '/login' }}>Login</Link></p>
                </Col>
            </Row>
        </div>
    )
}

export default Register;
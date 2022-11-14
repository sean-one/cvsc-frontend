import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Col, Form, Button, Row } from 'react-bootstrap';

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
        <>
            <h2>Register</h2>
            <Form onSubmit={handleSubmit(createUser)}>
                <Form.Group controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        className={errors.username ? 'inputError' : ''}
                        onFocus={() => clearErrors('username')}
                        {...register('username')}
                        type="text"
                        placeholder="username"
                        name='username'
                        required
                    />
                </Form.Group>
                <div className='errormessage'>{errors.username?.message}</div>

                {/* <Form.Group controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        className={errors.email ? 'inputError' : ''}
                        onFocus={() => clearErrors('email')}
                        {...register('email')}
                        type="email"
                        placeholder="email"
                        name='email'
                        required
                    />
                </Form.Group>
                <div className='errormessage'>{errors.email?.message}</div> */}

                <Row>
                    <Col>
                        <Form.Group controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                className={errors.password ? 'inputError' : ''}
                                onFocus={() => clearErrors('password')}
                                {...register('password')}
                                type="password"
                                placeholder="Password"
                                name='password'
                                required
                            />
                        </Form.Group>
                        <div className='errormessage'>{errors.password?.message}</div>
                    </Col>

                    <Col>
                        <Form.Group controlId="confirmation">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                                className={errors.confirmation ? 'inputError' : ''}
                                onFocus={() => clearErrors('confirmation')}
                                {...register('confirmation')}
                                type="password"
                                placeholder="Confirm Password"
                                name='confirmation'
                                required
                            />
                        </Form.Group>
                        <div className='errormessage'>{errors.confirmation?.message}</div>
                    </Col>
                </Row>
                <div className='errormessage'>{errors.invalid_input?.message}</div>
                <Row>
                    <Col xs={4}>
                        <Button variant="outline-dark" type='submit'>
                            Submit
                        </Button>
                    </Col>
                    <Col xs={8}>
                        <Button variant="outline-dark" onClick={googleAuthButton}>
                            Register with Google
                        </Button>
                    </Col>
                </Row>
            </Form>
            <Row>
                <Col className='d-flex flex-column justify-content-center align-items-center my-2'>
                    <p>already have a login? <Link to={{ pathname: '/login' }}>Login</Link></p>
                </Col>
            </Row>
        </>
    )
}

export default Register;
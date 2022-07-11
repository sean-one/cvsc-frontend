import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Col, Form, Button, Row } from 'react-bootstrap';

import { registrationSchema } from '../helpers/validationSchemas.js';
import AxiosInstance from '../helpers/axios';
// import { UsersContext } from '../context/users/users.provider.js';
import { NotificationsContext } from '../context/notifications/notifications.provider.js';


const Register = () => {
    // const { setUser } = useContext(UsersContext);
    const { dispatch } = useContext(NotificationsContext);

    const { register, handleSubmit, setError, clearErrors, formState:{ errors } } = useForm({
        mode: "onBlur",
        resolver: yupResolver(registrationSchema)
    })
    
    let history = useHistory();

    const createUser = async (data) =>{
        delete data['confirmation']

        AxiosInstance.post('/auth/local', data)
            .then(response => {
                if(response.status === 200) {
                    // send success message
                    dispatch({
                        type: "ADD_NOTIFICATION",
                        payload: {
                            notification_type: 'SUCCESS',
                            message: `${data.username} has been created and logged in`
                        }
                    })

                    // forward to profile page
                    history.push('/profile');

                } else {
                    dispatch({
                        type: "ADD_NOTIFICATION",
                        payload: {
                            notification_type: 'ERROR',
                            message: 'something went wrong, please try again'
                        }
                    })
                    throw new Error()
                }
            })
            .catch(err => {
                if(!err.response) {
                    dispatch({
                        type: "ADD_NOTIFICATION",
                        payload: {
                            notification_type: 'ERROR',
                            message: 'something went wrong, please try again'
                        }
                    })
                } else if(err.response.status === 400) {
                    setError(`${err.response.data.error.type}`, {
                        type: 'server',
                        message: err.response.data.error.message
                    })
                }
            })
    }
    
    return (
        <Row className='justify-content-lg-center'>
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

                <Form.Group controlId="email">
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
                <div className='errormessage'>{errors.email?.message}</div>

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

                <Row>
                    <Col>
                        <Button variant="primary" size="lg" type='submit'>
                            Submit
                        </Button>
                    </Col>
                </Row>
            </Form>
            <Row>
                <Col className='d-flex flex-column justify-content-center align-items-center my-2'>
                    <p>already have a login?</p>
                    <Button href='/login' variant="secondary" size="lg">
                        Login page
                    </Button>
                </Col>
            </Row>
        </Row>
    )
}

export default Register;
import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { loginSchema } from '../helpers/validationSchemas';
import { yupResolver } from '@hookform/resolvers/yup';
import { Form, Button } from 'react-bootstrap';
import { Col, Row } from 'react-bootstrap';

import AxiosInstance from '../helpers/axios';
import { UsersContext } from '../context/users/users.provider';
import { NotificationsContext } from '../context/notifications/notifications.provider';


const Login = () => {
    const { setUser } = useContext(UsersContext);
    const { dispatch } = useContext(NotificationsContext);

    const { register, handleSubmit, setError, clearErrors, formState:{ errors } } = useForm({
        mode: "onBlur",
        resolver: yupResolver(loginSchema)
    });
    let history = useHistory();

    
    const sendLogin = (data) => {
        AxiosInstance.post('/users/login', data)
            .then(response => {
                if(response.status === 200) {
                    dispatch({
                        type: "ADD_NOTIFICATION",
                        payload: {
                            notification_type: 'SUCCESS',
                            message: `logged in as: ${data.username}`
                        }
                    })
                    setUser(response.data)
                    history.push('/profile');
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
                if (!err.response) {
                    dispatch({
                        type: "ADD_NOTIFICATION",
                        payload: {
                            notification_type: 'ERROR',
                            message: 'something went wrong, please try again'
                        }
                    })
                } else if (err.response.status === 401) {
                    setError('password', {
                        type: 'server',
                        message: 'password or username is incorrect'
                    })
                } else if (err.response.status === 404) {
                    setError('username', {
                        type: 'server',
                        message: 'username is incorrect'
                    })
                } else {
                    console.log(err.name + ': ' + err.message)
                }
            })
    }

    return (
        <Row>
            <h2>Login</h2>
            <Form onSubmit={handleSubmit(sendLogin)}>
                <Form.Group controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        className={errors.username ? 'inputError' : ''}
                        {...register('username')}
                        autoFocus
                        onFocus={() => clearErrors('username')}
                        type='text'
                        name='username'
                        placeholder='username'
                        required
                    />
                    <div className='errormessage'>{errors.username?.message}</div>
                </Form.Group>

                <Form.Group controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        className={errors.password ? 'inputError' : ''}
                        {...register('password')}
                        onFocus={() => clearErrors('password')}
                        name='password'
                        type='password'
                        placeholder='Password'
                        required
                    />
                    <div className='errormessage'>{errors.password?.message}</div>
                </Form.Group>
                <Row>
                    <Col>
                        <Button variant="primary" size="lg" type='submit'>
                            Submit
                        </Button>
                    </Col>
                    <Col>
                        <Button href='/register' variant="secondary" size="lg">
                            Register
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Row>
    )
}

export default Login;
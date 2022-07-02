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
                    // send success message
                    dispatch({
                        type: "ADD_NOTIFICATION",
                        payload: {
                            notification_type: 'SUCCESS',
                            message: `logged in as: ${data.username}`
                        }
                    })

                    // set user to the users context
                    setUser(response.data)

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

                } else if (err.response.status === 400 ) {
                    setError(`${err.response.data.error.type}`, {
                        type: 'server',
                        message: err.response.data.error.message
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

    const googleAuthButton = (e) => {
        e.preventDefault()
        window.open("http://localhost:3333/auth/google", "_self")
        // console.log('click google')
        // AxiosInstance.get('/auth/google')
        //     .then(response => {
        //         console.log(response)
        //     })
        //     .catch(err => console.log(err))
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
                        // autoFocus
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
                <Row>
                    <button onClick={googleAuthButton}>Google</button>
                </Row>
            </Form>
        </Row>
    )
}

export default Login;
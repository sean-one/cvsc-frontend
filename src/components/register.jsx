import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Form, Button, InputGroup, Row } from 'react-bootstrap';

import { registrationSchema } from '../helpers/validationSchemas.js';
import { registerCleanUp } from '../helpers/dataCleanUp.js';
import AxiosInstance from '../helpers/axios';

import { UsersContext } from '../context/users/users.provider.js';
import { NotificationsContext } from '../context/notifications/notifications.provider.js';


const Register = () => {
    const { setUser } = useContext(UsersContext);
    const { dispatch } = useContext(NotificationsContext);

    const { register, handleSubmit, setError, clearErrors, formState:{ errors } } = useForm({
        mode: "onBlur",
        resolver: yupResolver(registrationSchema)
    })
    
    let history = useHistory();

    const createUser = async (data) =>{
        const newUser = registerCleanUp(data)

        AxiosInstance.post('/users/register', newUser)
            .then(response => {
                if(response.status === 200) {
                    dispatch({
                        type: "ADD_NOTIFICATION",
                        payload: {
                            notification_type: 'SUCCESS',
                            message: `${newUser.username} has been created and logged in`
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
                    setError(`${err.response.data.type}`, {
                        type: 'server',
                        message: err.response.data.message
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

                <Form.Group controlId="instagram">
                    <Form.Label>Instagram</Form.Label>
                    <InputGroup>
                        <InputGroup.Text id="btnGroupAddon">@</InputGroup.Text>
                        <Form.Control
                            className={errors.instagram ? 'inputError' : ''}
                            onFocus={() => clearErrors('instagram')}
                            {...register('instagram')}
                            type="text"
                            placeholder="instagram"
                            name='instagram'
                            aria-describedby='btnGroupAddon'
                        />
                    </InputGroup>
                </Form.Group>
                <div className='errormessage'>{errors.instagram?.message}</div>
                
                <div className="d-grid gap-2">
                    <Button variant="primary" size="lg" type='submit'>
                        Submit
                    </Button>
                    <p className='text-center'>---- or ----</p>
                    <Button href='/login' variant="secondary" size="lg">
                        Login
                    </Button>
                </div>
            </Form>
        </Row>
    )
}

export default Register;
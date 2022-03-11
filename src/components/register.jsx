import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Col, Container, Form, Button, InputGroup, Row } from 'react-bootstrap';

import { registrationSchema } from '../helpers/validationSchemas.js';
import { registerCleanUp } from '../helpers/dataCleanUp.js';
import AxiosInstance from '../helpers/axios';

import { UsersContext } from '../context/users/users.provider.js';


const Register = () => {
    const { register, handleSubmit, setError, clearErrors, formState:{ errors } } = useForm({
        mode: "onBlur",
        resolver: yupResolver(registrationSchema)
    })
    const { setUser } = useContext(UsersContext);
    const [ serverError, setServerError ] = useState(false);
    let history = useHistory();

    const createUser = async (data) =>{
        const newUser = registerCleanUp(data)
        setServerError(false)

        AxiosInstance.post('/users/register', newUser)
            .then(response => {
                if(response.status === 200) {
                    setUser(response.data)
                    history.push('/profile');
                } else {
                    console.log('inside els')
                    throw new Error()
                }
            })
            .catch(err => {
                console.log(err.response.data.message)
                if(!err.response) {
                    setServerError(true)
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
                <Form.Group className="mb-3" controlId="username">
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
                <p className='errormessage'>{errors.username?.message}</p>

                <Form.Group className="mb-3" controlId="email">
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
                <p className='errormessage'>{errors.email?.message}</p>

                <Form.Group className="mb-3" controlId="password">
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
                <p className='errormessage'>{errors.password?.message}</p>

                <Form.Group className="mb-3" controlId="confirmation">
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
                <p className='errormessage'>{errors.confirmation?.message}</p>

                <Form.Group className="mb-3" controlId="instagram">
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
                <p className='errormessage'>{errors.instagram?.message}</p>
                
                {serverError && <p className='errormessage'>network error, please wait a moment and try again</p>}
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
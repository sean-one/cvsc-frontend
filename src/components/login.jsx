import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { loginSchema } from '../helpers/validationSchemas';
import { yupResolver } from '@hookform/resolvers/yup';
import { Form, Button } from 'react-bootstrap';
import styled from 'styled-components';

import AxiosInstance from '../helpers/axios';

import { UsersContext } from '../context/users/users.provider';

const Styles = styled.div`
    .errormessage {
        width: 100%;
        text-align: left;
        padding: 0.25rem;
        color: lightcoral;
        font-weight: bold;
    }
`;


const Login = (props) => {
    const { register, handleSubmit, setError, formState:{ errors } } = useForm({
        mode: "onBlur",
        resolver: yupResolver(loginSchema)
    });
    const { setUser } = useContext(UsersContext);
    const [ serverError, setServerError ] = useState(false);
    let history = useHistory();

    
    const sendLogin = (data) => {
        AxiosInstance.post('/users/login', data)
            .then(response => {
                if(response.status === 200) {
                    setUser(response.data)
                    history.push('/profile');
                } else {
                    console.log('inside else')
                    throw new Error('invalid stuffs');
                }
            })
            .catch(err => {
                if (!err.response) {
                    setServerError(true)

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
        <React.Fragment>
            <Styles>
                <h2>Login</h2>
                <Form onSubmit={handleSubmit(sendLogin)}>
                    <Form.Group className="mb-3" controlId="username">
                        <Form.Label>Username</Form.Label>
                        <Form.Control {...register('username')} autoFocus type="text" name='username' placeholder="username" required />
                        <p className='errormessage'>{errors.username?.message}</p>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control {...register('password')} name='password' type="password" placeholder="Password" required />
                        <p className='errormessage'>{errors.password?.message}</p>
                    </Form.Group>

                    {serverError && <p className='errormessage'>network error, please wait a moment and try again</p>}
                    <div className="d-grid gap-2">
                        <Button variant="primary" size="lg" type='submit'>
                            Submit
                        </Button>
                        <p className='text-center'>---- or ----</p>
                        <Button href='/register' variant="secondary" size="lg">
                            Register New Account
                        </Button>
                    </div>
                </Form>
            </Styles>
        </React.Fragment>
    )
}

export default Login;
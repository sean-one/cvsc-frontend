import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Form, Button, InputGroup } from 'react-bootstrap';
import styled from 'styled-components';

import { registrationSchema } from '../helpers/validationSchemas.js';
import { registerCleanUp } from '../helpers/dataCleanUp.js';
import AxiosInstance from '../helpers/axios';

import { UsersContext } from '../context/users/users.provider.js';

const Styles = styled.div`
    .errormessage {
        width: 100%;
        text-align: left;
        padding: 0.25rem;
        color: lightcoral;
        font-weight: bold;
    }
`;

const Register = () => {
    const { register, handleSubmit, setError, formState:{ errors } } = useForm({
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
        <React.Fragment>
            <Styles>
                <h2>Register</h2>
                <Form onSubmit={handleSubmit(createUser)}>
                    <Form.Group className="mb-3" controlId="username">
                        <Form.Label>Username</Form.Label>
                        <Form.Control {...register('username')} type="text" placeholder="username" name='username' required />
                    </Form.Group>
                    <p className='errormessage'>{errors.username?.message}</p>

                    <Form.Group className="mb-3" controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control {...register('email')} type="email" placeholder="email" name='email' required />
                    </Form.Group>
                    <p className='errormessage'>{errors.email?.message}</p>

                    <Form.Group className="mb-3" controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control {...register('password')} type="password" placeholder="Password" name='password' required />
                    </Form.Group>
                    <p className='errormessage'>{errors.password?.message}</p>

                    <Form.Group className="mb-3" controlId="confirmation">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control {...register('confirmation')} type="password" placeholder="Confirm Password" name='confirmation' required />
                    </Form.Group>
                    <p className='errormessage'>{errors.confirmation?.message}</p>

                    <Form.Group className="mb-3" controlId="instagram">
                        <Form.Label>Instagram</Form.Label>
                        <InputGroup>
                            <InputGroup.Text id="btnGroupAddon">@</InputGroup.Text>
                            <Form.Control
                                {...register('instagram')}
                                type="text"
                                placeholder="instagram"
                                name='instagram'
                                aria-describedby='btnGroupAddon'
                            />
                        </InputGroup>
                    </Form.Group>
                    
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
            </Styles>
        </React.Fragment>
        // <div className='componentWrapper'>
        //     <h2>Registration</h2>
        //     <form className='registerForm' onSubmit={handleSubmit(createUser)}>
                
        //         <label htmlFor='username'>Username:</label>
        //         <input
        //             {...register('username')}
        //             type='text'
        //             id='username'
        //             name='username'
        //             required
        //         />
        //         <p className='errormessage'>{errors.username?.message}</p>
                
        //         <label htmlFor='email'>Email:</label>
        //         <input
        //             {...register('email')}
        //             type='email'
        //             id='email'
        //             name='email'
        //             required
        //         />
        //         <p className='errormessage'>{errors.email?.message}</p>

        //         <label htmlFor='password'>Password:</label>
        //         <input
        //             {...register('password')}
        //             type='password'
        //             id='password'
        //             name='password'
        //             required
        //         />
        //         <p className='errormessage'>{errors.password?.message}</p>
                
        //         <label htmlFor='confirmation'>Confirm Password:</label>
        //         <input
        //             {...register('confirmation')}
        //             type='password'
        //             id='confirmation'
        //             name='confirmation'
        //             required
        //         />
        //         <p className='errormessage'>{errors.confirmation?.message}</p>
                
        //         <label htmlFor='instagram'>Instagram</label>
        //         <input
        //             {...register('instagram')}
        //             type='text'
        //             id='instagram'
        //             name='instagram'
        //         />
        //         {serverError && <p className='errormessage'>network error, please wait a moment and try again</p>}
                
        //         <input type='submit' value='submit' />
        //     </form>
        // </div>
    )
}

export default Register;
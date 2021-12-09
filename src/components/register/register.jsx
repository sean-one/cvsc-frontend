import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { registrationSchema } from '../../helpers/validationSchemas.js';
import { registerCleanUp } from '../../helpers/dataCleanUp.js';
import AxiosInstance from '../../helpers/axios';

import './register.css';

import { UsersContext } from '../../context/users/users.provider.js';

const Register = () => {
    const { register, handleSubmit, setError, formState:{ errors } } = useForm({
        mode: "onBlur",
        resolver: yupResolver(registrationSchema)
    })
    const { setUserProfile } = useContext(UsersContext);
    const [ serverError, setServerError ] = useState(false);
    let history = useHistory();

    const createUser = async (data) =>{
        const newUser = registerCleanUp(data)
        setServerError(false)

        AxiosInstance.post('/users/register', newUser)
            .then(response => {
                if(response.status === 200) {
                    setUserProfile(response.data)
                    history.push('/profile');
                } else {
                    throw new Error()
                }
            })
            .catch(err => {
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
        <div className='componentWrapper'>
            <h2>Registration</h2>
            <form className='registerForm' onSubmit={handleSubmit(createUser)}>
                <label htmlFor='username'>Username:</label>
                <input
                    {...register('username')}
                    type='text'
                    id='username'
                    name='username'
                    required
                />
                <p className='errormessage'>{errors.username?.message}</p>
                <label htmlFor='email'>Email:</label>
                <input
                    {...register('email')}
                    type='email'
                    id='email'
                    name='email'
                    required
                />
                <p className='errormessage'>{errors.email?.message}</p>
                {/* <label htmlFor='avatar'>Profile Image:</label>
                <input
                    {...register('avatar')}
                    type='file'
                    id='avatar'
                    name='avatar'
                    accept="image/*"
                /> */}
                <label htmlFor='password'>Password:</label>
                <input
                    {...register('password')}
                    type='password'
                    id='password'
                    name='password'
                    required
                />
                <p className='errormessage'>{errors.password?.message}</p>
                <label htmlFor='confirmation'>Confirm Password:</label>
                <input
                    {...register('confirmation')}
                    type='password'
                    id='confirmation'
                    name='confirmation'
                    required
                />
                <p className='errormessage'>{errors.confirmation?.message}</p>
                <label htmlFor='instagram'>Instagram</label>
                <input
                    {...register('instagram')}
                    type='text'
                    id='instagram'
                    name='instagram'
                />
                {serverError && <p className='errormessage'>network error, please wait a moment and try again</p>}
                <input type='submit' value='submit' />
            </form>
        </div>
    )
}

export default Register;
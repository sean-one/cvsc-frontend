import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { registrationSchema } from '../../helpers/validationSchemas.js';
import AxiosInstance from '../../helpers/axios';

import './register.css';

import UserContext from '../../context/userContext';

const Register = () => {
    const { register, handleSubmit, setError, formState:{ errors } } = useForm({
        mode: "onBlur",
        resolver: yupResolver(registrationSchema)
    })
    const { setUserProfile } = useContext(UserContext);
    const [ serverError, setServerError ] = useState(false);
    let history = useHistory();

    const createUser = async (data) =>{
        setServerError(false)
        // remove confirmation from data
        delete data['confirmation']
        
        const file = data.avatar[0]
        
        if (file === undefined) {
            // this is where a default image coule be send if not on the server
            const imageUrl = 'https://picsum.photos/100/100'
            data.avatar = imageUrl

        } else {

            // get s3 url from server
            const url = await AxiosInstance.get('/s3')
                .then(response => {
                    return response.data.url
                    // console.log(response)
                })
                .catch(err => console.log(err))
    
            // post the image directly to the s3 bucket
            await AxiosInstance.put(url, file, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
    
            const imageUrl = url.split('?')[0]
            data.avatar = imageUrl
            
        }

        AxiosInstance.post('/users/register', data)
            .then(response => {
                if(response.status === 200) {
                    setUserProfile(response.data)
                    localStorage.setItem('token', response.data.token);
                    localStorage.setItem('userId', response.data.id);
                    localStorage.setItem('user', JSON.stringify(response.data))
                    localStorage.setItem('isLoggedIn', true)
                    history.push('/profile');
                } else {
                    throw new Error()
                }
            })
            .catch(err => {
                
                if(err.response.status === 400) {
                    setError(`${err.response.data.type}`, {
                        type: 'server',
                        message: err.response.data.message
                    })
                }

                if(!err.response) {
                    setServerError(true)
                }

                console.log('register post catch error')
            })
    }
    return (
        <div className='formWrapper'>
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
                <label htmlFor='avatar'>Profile Image:</label>
                <input
                    {...register('avatar')}
                    type='file'
                    id='avatar'
                    name='avatar'
                    accept="image/*"
                />
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
                {serverError && <p className='errormessage'>network error, please wait a moment and try again</p>}
                <input type='submit' value='submit' />
            </form>
        </div>
    )
}

export default Register;
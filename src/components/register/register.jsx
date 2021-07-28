import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import AxiosInstance from '../../helpers/axios';

import './register.css';

import UserContext from '../../context/userContext';

const Register = () => {
    const { setUserProfile } = useContext(UserContext);
    let history = useHistory();

    const createUser = async (e) =>{
        e.preventDefault();
        const file = e.target.avatar.files[0]
        
        {/* need to check for the file.  if there is no file selected I dont want to hit the s3 for a url
            right now if nothing is selected it will upload a zero kb file and send back the url to be added to the
            server */}

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
        
        const userDetails = {
            username: e.target.username.value,
            email: e.target.email.value,
            avatar: imageUrl,
            password: e.target.password.value
        }

        AxiosInstance.post('/users/register', userDetails)
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
                console.log(err)
            })
    }
    return (
        <div className='formWrapper'>
            <h2>Registration</h2>
            <form className='registerForm' onSubmit={createUser}>
                <label htmlFor='username'>Username:</label>
                <input type='text' id='username' name='username' />
                <label htmlFor='email'>Email:</label>
                <input type='email' id='email' name='email' />
                <label htmlFor='avatar'>Profile Image:</label>
                <input type='file' id='avatar' name='avatar' accept="image/*" />
                <label htmlFor='password'>Password:</label>
                <input type='password' id='password' name='password' />
                <label htmlFor='confirmaiton'>Confirm Password:</label>
                <input type='password' id='confirmaiton' name='confirmaiton' />
                <input type='submit' value='submit' />
            </form>
        </div>
    )
}

export default Register;
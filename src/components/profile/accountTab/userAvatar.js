import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import AxiosInstance from '../../../helpers/axios';

import { UsersContext } from '../../../context/users/users.provider';
import useImagePreviewer from '../../../hooks/useImagePreviewer';

import './basicSection.css'

const Useravatar = () => {
    const { imagePreview, canvas } = useImagePreviewer()
    const [ imageToggle, setImageToggle ] = useState(false)
    const { userProfile, updateUser } = useContext(UsersContext)
    const { register, handleSubmit, formState:{ errors } } = useForm()

    const toggleEdit = () => {
        setImageToggle(!imageToggle)
    }
    
    const uploadImage = async (data) => {
        canvas.current.toBlob(async function(blob) {
            const token = localStorage.getItem('token');

            const url = await AxiosInstance.get('/s3', {
                headers: {'Authorization': 'Bearer ' + token }
            })
                .then(response => {
                    return response.data.url
                })
                .catch(err => console.log(err))
            
            await AxiosInstance.put(url, blob, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })

            const imageUrl = url.split('?')[0]

            const user = await AxiosInstance.post('/users/updateAvatar', { 'avatar': imageUrl }, {
                headers: { 'Authorization': 'Bearer ' + token }
            })
            updateUser(user.data[0])
            setImageToggle(!imageToggle)
        })
    }


    return (
        <div className='avatarSection'>
            <div id='avatarWrap' className='userAvatar'>
                {
                    !imageToggle ?
                        <img id='userProfileImage' src={`${userProfile['avatar']}`} alt='user profile' />
                        : <canvas
                            id={'avatarCanvas'}
                            ref={canvas}
                            height={200}
                            width={200}
                        />
                }
                <FontAwesomeIcon id='userAvatarEdit' icon={faCamera} size='2x' onClick={toggleEdit}/>
            </div>
            {
                imageToggle && (
                    <form onSubmit={handleSubmit(uploadImage)}>
                        <div className='fileUpload'>
                            <input
                                {...register('avatar')}
                                type='file'
                                id='avatar'
                                name='avatar'
                                accept="image/*"
                                onChange={imagePreview}
                            />
                        </div>
                        <p className='errormessage'>{errors.avatar?.message}</p>
                        <input type='submit' value='upload' />
                    </form>
                )
            }
        </div>
    );
}

export default Useravatar;

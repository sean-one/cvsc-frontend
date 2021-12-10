import React, { useState, useContext, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import AxiosInstance from '../../../../../helpers/axios';

import { UsersContext } from '../../../../../context/users/users.provider';

import './userAvatar.css';

const Useravatar = () => {
    const [ editImage, setEditImage ] = useState(false)
    const { userProfile, updateUser } = useContext(UsersContext)
    const [profileImage, setProfileImage] = useState()
    const canvas = useRef(null)
    const { register, handleSubmit, formState:{ errors } } = useForm()

    const toggleEdit = () => {
        setEditImage(!editImage)
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
            setEditImage(!editImage)
        })
    }

    const showPreview = (event) => {
        let fileToUpload = event.target.files
        let reader = new FileReader()
        const previewImage = new Image()
        reader.onload = function(e) {
            previewImage.src = e.target.result
            previewImage.onload = () => setProfileImage(previewImage)
        }
        reader.readAsDataURL(fileToUpload[0])
    }

    useEffect(() => {
        const avatarImage = new Image();
        avatarImage.crossOrigin = 'anonymous';
        avatarImage.src = `${userProfile['avatar']}`
        avatarImage.onload = () => setProfileImage(avatarImage)    
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        let mounted = true
        if (mounted) {
            if(profileImage && canvas) {
                const ctx = canvas.current.getContext('2d')
                const MAX_WIDTH = 200
                const MAX_HEIGHT = 200
                let width = profileImage.width
                let height = profileImage.height
                
                ctx.clearRect(0, 0, canvas.current.width, canvas.current.height);
                if(width > height) {
                    width *= MAX_HEIGHT / height;
                    height = MAX_HEIGHT;
                } else {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH
                }
                ctx.drawImage(profileImage, ( canvas.current.width / 2 ) - ( width / 2 ), ( canvas.current.height / 2 ) - ( height / 2 ), width, height)
            }
        }
        return () => {
            mounted = false
        }

    }, [profileImage, canvas]);

    return (
        <div className='avatarSection'>
            <div id='avatarWrap' className='userAvatar'>
                <canvas
                    id={'avatarCanvas'}
                    ref={canvas}
                    height={200}
                    width={200}
                />
                <FontAwesomeIcon id='userAvatarEdit' icon={faCamera} size='2x' onClick={toggleEdit}/>
            </div>
            {
                editImage && (
                    <form onSubmit={handleSubmit(uploadImage)}>
                        <div className='fileUpload'>
                            <input
                                {...register('avatar')}
                                type='file'
                                id='avatar'
                                name='avatar'
                                accept="image/*"
                                onChange={showPreview}
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

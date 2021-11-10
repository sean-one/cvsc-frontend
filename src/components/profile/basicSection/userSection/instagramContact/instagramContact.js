import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { addInstagramSchema } from '../../../../../helpers/validationSchemas';
import { yupResolver } from '@hookform/resolvers/yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAt } from '@fortawesome/free-solid-svg-icons';
import { faFacebookSquare } from '@fortawesome/free-brands-svg-icons'
import AxiosInstance from '../../../../../helpers/axios';

import { UsersContext } from '../../../../../context/users/users.provider';

import './instagramContact.css';

const InstagramContact = () => {
    const { setUserProfile } = useContext(UsersContext)
    const { register, handleSubmit, watch, formState:{ errors } } = useForm({
        mode: "onBlur",
        resolver: yupResolver(addInstagramSchema)
    });

    const addInstagram = watch("addInstagram", false)
    const addFacebook = watch("addFacebook", false)

    const sendInstagram = (data) => {
        const token = localStorage.getItem('token')
        delete data['addInstagram']
        delete data['addFacebook']
        AxiosInstance.post('/contacts/addUserContact', data, {
            headers: {'Authorization': 'Bearer ' + token}
        })
            .then(response => {
                setUserProfile(response.data)
                // console.log(response.data)
            })
            .catch(err => console.log(err))
        // console.log(data)
    }

    return (
        <div className='contactWrapper'>
            <form className='sendContact' onSubmit={handleSubmit(sendInstagram)}>
                <div className='addCheckBox'>
                    <input {...register('addInstagram')} type='checkbox' name='addInstagram' />
                    <label htmlFor='addInstagram'>Add Instagram</label>
                </div>
                {
                    addInstagram && (
                        <div className='instagramInput'>
                            <div className='inputWrapper'>
                                <FontAwesomeIcon className='tabIcon' icon={faAt} size='1x' />
                                <input {...register('instagram')} id='instagram' type='text' name='instagram' />
                            </div>
                            <p className='errormessage'>{errors.instagram?.message}</p>
                        </div>
                    )
                }
                <div className='addCheckBox'>
                    <input {...register('addFacebook')} type='checkbox' name='addFacebook' />
                    <label htmlFor='addFacebook'>Add Facebook</label>
                </div>
                {
                    addFacebook && (
                        <div className='facebookInput'>
                            <div className='inputWrapper'>
                                <FontAwesomeIcon className='tabIcon' icon={faFacebookSquare} size='1x' />
                                <input {...register('facebook')} id='facebook' type='text' name='facebook' />
                            </div>
                            <p className='errormessage'>{errors.facebook?.message}</p>
                        </div>
                    )
                }
                {
                    (addFacebook || addInstagram) && (
                        <input type='submit' value='add' />
                    )
                }
            </form>
        </div>
    )
}

export default InstagramContact;
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { FloatingLabel, Form, Image } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';

import useAuth from '../../../hooks/useAuth';
import default_profile from '../../../assets/default_user_icon.png'
import { role_types } from '../../../helpers/dataCleanUp';


const UserAccount = () => {
    const [ editView, setEditView ] = useState(true)
    const { auth } = useAuth()
    let navigate = useNavigate()

    const { register, handleSubmit, clearErrors, watch, formState: { errors } } = useForm({
        mode: 'onBlur'
    })

    const update_user = async (data) => {
        console.log('click')
    }


    return (
        <div className='d-flex flex-column border mb-3'>
            <div className='p-5 text-center'>
                <Image thumbnail roundedCircle src={auth?.user.avatar || default_profile} alt={`user avatar`} />
            </div>
            <div className='d-flex justify-content-between'>
                <div className='d-flex flex-column w-100 ps-2'>
                    <Form onSubmit={handleSubmit(update_user)}>
                        <div className='m-0'>{auth?.user.username}</div>
                        {
                            (editView)
                                ? <Form.Group controlId='email' className='mb-2'>
                                    <FloatingLabel controlId='email' label='Update Email'>
                                        <Form.Control
                                            className={errors.email ? 'inputError' : ''}
                                            {...register('email')}
                                            onFocus={() => clearErrors('email')}
                                            type='email'
                                            name='email'
                                        />
                                    </FloatingLabel>
                                    <div className='errormessage'>{errors.email?.message}</div>
                                </Form.Group>
                                : <div className='m-0'>{auth?.user.email}</div>
                        }
                        <div className='m-0'>{`Account Type: ${role_types[auth.user.account_type]}`}</div>
                    </Form>
                </div>
                <div className='text-end align-self-end w-25 p-2'>
                    <FontAwesomeIcon onClick={() => navigate('/profile/edit')} icon={faPen} />
                </div>
            </div>
        </div>
    )
}

export default UserAccount;
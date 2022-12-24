import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Image } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';

import default_profile from '../../../assets/default_user_icon.png'
import { role_types } from '../../../helpers/dataCleanUp';
import useAuth from '../../../hooks/useAuth';


const AccountDetails = () => {
    const { auth } = useAuth()
    let navigate = useNavigate()

    
    return (
        <div className='d-flex flex-column border mb-3'>
            <div className='p-1 text-center'>
                <Image thumbnail roundedCircle src={auth?.user.avatar || default_profile} alt={`user avatar`} />
            </div>
            <div className='d-flex justify-content-between'>
                <div className='d-flex flex-column w-100 ps-2'>
                    <div className='m-0'>{auth?.user.username}</div>
                    <div className='m-0'>{auth?.user.email}</div>
                    <div className='m-0'>{`Account Type: ${role_types[auth.user.account_type]}`}</div>
                </div>
                <div className='text-end align-self-end w-25 p-2'>
                    <FontAwesomeIcon onClick={() => navigate('/profile/edit')} icon={faPen} />
                </div>
            </div>
        </div>
    )
}

export default AccountDetails;
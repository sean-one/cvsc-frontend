import React, { useContext, useEffect } from 'react';
import AxiosInstance from '../../../helpers/axios';

import PendingRequest from './pendingRequest/pendingRequest';

import './adminSection.css';

import { UsersContext } from '../../../context/users/users.provider';

const AdminSection = (props) => {
    const { setUserRoles } = useContext(UsersContext)

    useEffect(() => {
        const token = localStorage.getItem('token');
        AxiosInstance.get(`/roles/user/${parseInt(localStorage.getItem('userId'))}`, {
            headers: {'Authorization': 'Bearer ' + token}
        })
            .then(userroles => {
                setUserRoles(userroles.data)
            })
            .catch(err => console.log(err))
        // eslint-disable-next-line
    }, []);

    return (
        <div className='adminSection'>
            {/* <p>you have admin rights!</p> */}
            <PendingRequest />
        </div>
    )
}

export default AdminSection;
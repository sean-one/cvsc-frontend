import React, { useState, useContext, useEffect } from 'react';
import AxiosInstance from '../../../helpers/axios';

import PendingRequest from './pendingRequest/pendingRequest';

import './adminSection.css';

import { UsersContext } from '../../../context/users/users.provider';

const AdminSection = (props) => {
    const [ loading, setLoading ] = useState(false);
    const { setUserRoles } = useContext(UsersContext)

    const getUserRoles = () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        AxiosInstance.get(`/roles/user/${parseInt(localStorage.getItem('userId'))}`, {
            headers: {'Authorization': 'Bearer ' + token}
        })
            .then(userroles => {
                setUserRoles(userroles.data)
                setLoading(false)
            })
            .catch(err => {
                setLoading(false)
                console.log(err)
            })

    }

    useEffect(() => {
        getUserRoles()
        // eslint-disable-next-line
    }, []);

    return (
        <div className='adminSection'>
            {/* <p>you have admin rights!</p> */}
            {
                loading ? (
                    <div>....loading data.....</div>
                ) : (
                    <PendingRequest />
                )
            }
        </div>
    )
}

export default AdminSection;
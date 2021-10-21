import React, { useState, useContext, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import AxiosInstance from '../../helpers/axios';

import { UsersContext } from '../../context/users/users.provider';

import AdminSection from './adminSection/adminSection';
import CreatorSection from './creatorSection/creatorSection';

import './profile.css';

const Profile = () => {
    const [ loading, setLoading ] = useState(false);
    const { userProfile, setUserRoles, useAdminRoles } = useContext(UsersContext);
    const adminRoles = useAdminRoles()
    
    const getRoles = () => {
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
        getRoles()
        // const userData = localStorage.getItem('user');
        // if (userData) {
        //     const user = JSON.parse(userData)
        //     getFromLocal(user)
        // }
        // eslint-disable-next-line
    }, []);

    return (
        <div className='componentWrapper'>
            {
                loading ? (
                    <div> ...loading data... </div>
                ) : (
                    <>
                        <div className='account'>
                            <div className='userinfo'>
                                <h3>{userProfile.username}</h3>
                            </div>
                        </div>
                        {
                            (adminRoles.length > 0) && 
                                <AdminSection />
                        }
                        <CreatorSection />
                    </>
                )
            }
        </div>
    )
}

export default withRouter(Profile);
import React, { useState, useContext, useCallback, useEffect } from 'react';
import { withRouter } from 'react-router-dom';

import { UsersContext } from '../../context/users/users.provider';

import AdminSection from './adminSection/adminSection';
import CreatorSection from './creatorSection/creatorSection';

import './profile.css';

const Profile = () => {
    const { userProfile, getFromLocal } = useContext(UsersContext);
    const isAdmin = JSON.parse(localStorage.getItem('isAdmin'));

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const user = JSON.parse(userData)
            getFromLocal(user)
        }
    }, []);

    return (
        <div className='componentWrapper'>
            <div className='account'>
                <div className='userinfo'>
                    <h3>{userProfile.username}</h3>
                </div>
            </div>
            {
                (isAdmin) && 
                    <AdminSection />
            }
            <CreatorSection />
        </div>
    )
}

export default withRouter(Profile);
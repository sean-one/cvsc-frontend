import React, { useState, useContext, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import AxiosInstance from '../../helpers/axios';

import { UsersContext } from '../../context/users/users.provider';

import BasicSection from './basicSection/basicSection';
import AdminSection from './adminSection/adminSection';
// import AdminUser from './adminUser/adminUserSection';
import CreatorSection from './creatorSection/creatorSection';

import './profile.css';

const Profile = () => {
    const [ loading, setLoading ] = useState(false);
    const { userProfile, editorRoles, adminRoles, setUserRoles } = useContext(UsersContext);
    // const userId = localStorage.getItem('userId')
    
    const getRoles = () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        // AxiosInstance.get(`/roles/user/${parseInt(localStorage.getItem('userId'))}`, {
        AxiosInstance.get(`/roles/user/${userProfile.id}`, {
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
        // eslint-disable-next-line
    }, []);
    
    return (
        <div className='componentWrapper'>
            {
                loading ? (
                    <div> ...loading data... </div>
                ) : (
                    <>
                        <BasicSection />
                        {
                            // (checkAdmin) && 
                            (!!adminRoles.length) && 
                                <AdminSection />
                        }
                        {/* {
                            (userId === process.env.REACT_APP_USER_ADMIN) &&
                                <AdminUser />
                        } */}
                        {
                            // (checkEditor) &&
                            (!!editorRoles.length || !!adminRoles.length) &&
                                <CreatorSection />
                        }
                    </>
                )
            }
        </div>
    )
}

export default withRouter(Profile);
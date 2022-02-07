import React, { useState, useContext, useEffect, useCallback } from 'react';
import { withRouter } from 'react-router-dom';
import AxiosInstance from '../../helpers/axios';

import { UsersContext } from '../../context/users/users.provider';

import BasicSection from './basicSection/basicSection';
import AdminSection from './adminSection/adminSection';
// import AdminUser from './adminUser/adminUserSection';
import CreatorSection from './creatorSection/creatorSection';
import BusinessAdminSection from './businessAdminSection/businessAdminSection';

import './profile.css';

const Profile = () => {
    const [ loading, setLoading ] = useState(false);
    const { userProfile, editorRoles, adminRoles, setUserRoles } = useContext(UsersContext);
    
    const getRoles = useCallback(() => {
        setLoading(true);
        const token = localStorage.getItem('token');
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
    }, [])

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
                            // (checkEditor) &&
                            (!!editorRoles.length || !!adminRoles.length) &&
                            <CreatorSection />
                        }
                        {
                            // (checkAdmin) && 
                            (!!adminRoles.length) && 
                                <AdminSection />
                        }
                        <BusinessAdminSection />
                        {/* {
                            (userId === process.env.REACT_APP_USER_ADMIN) &&
                                <AdminUser />
                        } */}
                        
                    </>
                )
            }
        </div>
    )
}

export default withRouter(Profile);
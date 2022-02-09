import React, { useState, useContext, useEffect, useCallback } from 'react';
import { withRouter } from 'react-router-dom';
import AxiosInstance from '../../helpers/axios';

import { SiteContext } from '../../context/site/site.provider';
import { UsersContext } from '../../context/users/users.provider';
import { RolesContext } from '../../context/roles/roles.provider';

import BasicSection from './basicSection/basicSection';
import AdminSection from './adminSection/adminSection';
// import AdminUser from './adminUser/adminUserSection';
import CreatorSection from './creatorSection/creatorSection';
import BusinessAdminSection from './businessAdminSection/businessAdminSection';

import './profile.css';

const Profile = () => {
    const [ loading, setLoading ] = useState(false);
    const { useBusinessAdmin } = useContext(SiteContext);
    const { userProfile, setUserRoles } = useContext(UsersContext);
    const { setRoles, isCreatorAccount, isAdminAccount } = useContext(RolesContext)

    const isCreator = isCreatorAccount()
    const isAdmin = isAdminAccount()
    const isBusinessAdmin = useBusinessAdmin(userProfile.id)

    const getRoles = useCallback(() => {
        setLoading(true);
        const token = localStorage.getItem('token');
        AxiosInstance.get(`/roles/user/${userProfile.id}`, {
            headers: {'Authorization': 'Bearer ' + token}
        })
            .then(userroles => {
                setRoles(userroles.data)
                setUserRoles(userroles.data)
                setLoading(false)
            })
            .catch(err => {
                setLoading(false)
                console.log(err)
            })
    }, [setRoles, setUserRoles, userProfile.id])

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
                            (isCreator || isAdmin) &&
                            <CreatorSection />
                        }
                        {
                            // (checkAdmin) && 
                            (isAdmin) && 
                                <AdminSection />
                        }
                        {
                            (isBusinessAdmin.length > 0) &&
                                <BusinessAdminSection businessAdminList={isBusinessAdmin} />
                        }
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
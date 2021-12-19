import React, { useState, useContext, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import AxiosInstance from '../../helpers/axios';

import { UsersContext } from '../../context/users/users.provider';

import BasicSection from './basicSection/basicSection';
import AdminSection from './adminSection/adminSection';
import AdminUser from './adminUser/adminUserSection';
import CreatorSection from './creatorSection/creatorSection';

import './profile.css';

const Profile = () => {
    const [ loading, setLoading ] = useState(false);
    const { userProfile, getFromLocal, setUserRoles, useAdminRoles, isEditor } = useContext(UsersContext);
    const editorRights = isEditor()
    const adminRoles = useAdminRoles()
    const userId = localStorage.getItem('userId')
    
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

        if (Object.keys(userProfile).length === 0) {
            // save userprofile from local storage 
            const user = JSON.parse(localStorage.getItem('user'))
            getFromLocal(user)
        }
        
        getRoles()
        return () => {
            setLoading(false)
        }
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
                            (adminRoles.length > 0) && 
                                <AdminSection />
                        }
                        {
                            (userId === process.env.REACT_APP_USER_ADMIN) &&
                                <AdminUser />
                        }
                        {
                            (editorRights) &&
                                <CreatorSection />
                        }
                    </>
                )
            }
        </div>
    )
}

export default withRouter(Profile);
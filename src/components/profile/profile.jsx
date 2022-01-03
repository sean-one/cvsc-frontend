import React, { useState, useContext, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import AxiosInstance from '../../helpers/axios';

import { SiteContext } from '../../context/site/site.provider';
import { RolesContext } from '../../context/roles/roles.provider';

import BasicSection from './basicSection/basicSection';
import AdminSection from './adminSection/adminSection';
import AdminUser from './adminUser/adminUserSection';
import CreatorSection from './creatorSection/creatorSection';

import './profile.css';

const Profile = () => {
    const [ loading, setLoading ] = useState(false);
    const { userRoles, editorRoles, adminRoles, setUserRoles, isAdmin, isEditor } = useContext(RolesContext);
    const { setRoles } = useContext(SiteContext)
    // const { setRoles, isEditor, isAdmin } = useContext(SiteContext)
    // const checkEditor = isEditor()
    // const checkAdmin = isAdmin()
    const userId = localStorage.getItem('userId')
    
    const getRoles = () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        AxiosInstance.get(`/roles/user/${parseInt(localStorage.getItem('userId'))}`, {
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
    }

    useEffect(() => {
        getRoles()
        // eslint-disable-next-line
    }, []);
    
    console.log(`editor: ${editorRoles.length}`)
    console.log(`admin: ${adminRoles.length}`)
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
                            (isAdmin) && 
                                <AdminSection />
                        }
                        {
                            (userId === process.env.REACT_APP_USER_ADMIN) &&
                                <AdminUser />
                        }
                        {
                            // (checkEditor) &&
                            (isEditor || isAdmin) &&
                                <CreatorSection />
                        }
                    </>
                )
            }
        </div>
    )
}

export default withRouter(Profile);
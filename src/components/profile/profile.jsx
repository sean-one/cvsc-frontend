import React, { useState, useContext, useEffect, useCallback } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Accordion, Row } from 'react-bootstrap';

import AxiosInstance from '../../helpers/axios';

import { SiteContext } from '../../context/site/site.provider';
import { UsersContext } from '../../context/users/users.provider';
import { RolesContext } from '../../context/roles/roles.provider';

import BasicSection from './basicSection/basicSection';
import BusinessAdminSection from './businessAdminSection/businessAdminSection';
import CreatorSection from './creatorSection/creatorSection';

import UserSection from './basicSection/userSection';
import CreatorRequest from './basicSection/creatorRequest';

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
        <React.Fragment>
            <BasicSection />
            {
                (isCreator || isAdmin) &&
                    <Row>
                        <h3>Creator</h3>
                        <Accordion >
                            <Accordion.Item eventKey="0">
                                <Accordion.Header>User Profile</Accordion.Header>
                                <Accordion.Body>
                                    <UserSection />
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </Row>
            }
            {
                (isBusinessAdmin.length > 0) &&
                    <Row>
                        <h3>Business Admin</h3>
                        <Accordion >
                            <Accordion.Item eventKey="0">
                                <Accordion.Header>User Profile</Accordion.Header>
                                <Accordion.Body>
                                    <UserSection />
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </Row>
            }
        </React.Fragment>
        // <div className='componentWrapper'>
        //     {
        //         loading ? (
        //             <div> ...loading data... </div>
        //         ) : (
        //             <>
        //                 <BasicSection />
        //                 {
        //                     // (checkEditor) &&
        //                     (isCreator || isAdmin) &&
        //                     <CreatorSection />
        //                 }
        //                 {
        //                     (isBusinessAdmin.length > 0) &&
        //                         <BusinessAdminSection businessAdminList={isBusinessAdmin} />
        //                 }
        //             </>
        //         )
        //     }
        // </div>
    )
}

export default withRouter(Profile);
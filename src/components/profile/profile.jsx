import React, { useState, useContext, useEffect, useCallback } from 'react';
import { withRouter } from 'react-router-dom';
import { Col, Container, Row } from 'react-bootstrap';

import AxiosInstance from '../../helpers/axios';

import { SiteContext } from '../../context/site/site.provider';
import { UsersContext } from '../../context/users/users.provider';
import { RolesContext } from '../../context/roles/roles.provider';

import BasicSection from './basicSection/basicSection';
import BusinessAdminSection from './businessAdminSection/businessAdminSection';
import CreatorSection from './creatorSection/creatorSection';

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
        <Container>
            <Row className='justify-content-lg-center'>
                { loading ? <Col><p>loading...</p></Col>
                    : <Col lg={8}>
                        <BasicSection className='my-3'/>
                        {
                            (isCreator || isAdmin) &&
                                <CreatorSection />
                        }
                        {
                            (isBusinessAdmin.length > 0) &&
                                <BusinessAdminSection />
                        }
                    </Col>
                }
            </Row>
        </Container>
    )
}

export default withRouter(Profile);
import React, { useState, useContext, useEffect, useCallback } from 'react';
import { withRouter } from 'react-router-dom';
import { Col, Row } from 'react-bootstrap';

import AxiosInstance from '../../helpers/axios';

import { SiteContext } from '../../context/site/site.provider';
import { UsersContext } from '../../context/users/users.provider';

import BasicSection from './basicSection/basicSection';
import BusinessAdminSection from './businessAdminSection/businessAdminSection';
import CreatorSection from './creatorSection/creatorSection';

const Profile = () => {
    const [ loading, setLoading ] = useState(false);
    const { useBusinessAdmin } = useContext(SiteContext);
    const { userProfile, setUserRoles, isCreator, isAdmin } = useContext(UsersContext);
    const isBusinessAdmin = useBusinessAdmin(userProfile.id)

    const getRoles = useCallback(() => {
        setLoading(true);
        const token = localStorage.getItem('token');
        AxiosInstance.get(`/roles/user/${userProfile.id}`, {
            headers: {'Authorization': 'Bearer ' + token}
        })
            .then(userroles => {
                setUserRoles(userroles.data)
            })
            .catch(err => {
                console.log(err)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [setUserRoles, userProfile.id])

    useEffect(() => {
        getRoles()
        // eslint-disable-next-line
    }, []);
    
    
    return (
        <Row>
            { loading ? <Col><p>loading...</p></Col>
                : <Col>
                    <BasicSection />
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
    )
}

export default withRouter(Profile);
import React, { useState, useContext, useEffect, useCallback } from 'react';
import { withRouter } from 'react-router-dom';
import { Col, Row } from 'react-bootstrap';

import AxiosInstance from '../../helpers/axios';
import { UsersContext } from '../../context/users/users.provider';
import BasicSection from './basicSection/basicSection';
import BusinessOptions from './businessOptions/businessOptions';
import BusinessAdminSection from './businessAdminSection/businessAdminSection';

const Profile = () => {
    const [ loading, setLoading ] = useState(false);
    const { userProfile, setUserRoles, isCreator, isManager, isAdmin } = useContext(UsersContext);

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
                        (isCreator || isManager || isAdmin) &&
                        <BusinessOptions />
                    }
                    {
                        (isAdmin) &&
                            <BusinessAdminSection />
                    }
                </Col>
            }
        </Row>
    )
}

export default withRouter(Profile);
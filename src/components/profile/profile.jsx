import React, { useState, useContext, useEffect, useCallback } from 'react';
import { withRouter } from 'react-router-dom';
import { Col, Row } from 'react-bootstrap';

import AxiosInstance from '../../helpers/axios';
import { useUserRolesQuery } from '../../hooks/useUserAuthApi';
import { UsersContext } from '../../context/users/users.provider';
import BasicSection from './basicSection/basicSection';
import BusinessSection from './businessSection/businessSection';

const Profile = () => {
    const { userProfile, setUserRoles, useAccountType } = useContext(UsersContext);
    const { data } = useUserRolesQuery(userProfile.id)
    const [ loading, setLoading ] = useState(false);
    const account_type = useAccountType()

    const getRoles = useCallback(() => {
        // set loading state
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
    
    console.log(data)
    return (
        <Row>
            { loading ? <Col><p>loading...</p></Col>
                : <Col>
                    <BasicSection />
                    {
                        (account_type !== 'basic' && account_type !== 'creator') ?
                            <BusinessSection />
                            : null
                    }
                </Col>
            }
        </Row>
    )
}

export default withRouter(Profile);
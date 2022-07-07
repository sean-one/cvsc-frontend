import React, { useState, useContext, useEffect, useCallback } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { Col, Row } from 'react-bootstrap';

import AxiosInstance from '../../helpers/axios';
import { UsersContext } from '../../context/users/users.provider';
import BasicSection from './basicSection/basicSection';
import BusinessSection from './businessSection/businessSection';

const Profile = () => {
    const { userProfile, setUser, setUserRoles } = useContext(UsersContext);
    const [ loading, setLoading ] = useState(false);
    
    let history = useHistory()

    const getUser = useCallback(() => {
        setLoading(true);

        AxiosInstance.get('/auth/login/success')
            .then(response => {
                setUser(response.data.user)
                setUserRoles(response.data.roles)
            })
            .catch(err => {
                if(err.response.status === 401) {
                    history.push('/login')
                }
            })
            .finally(
                setLoading(false)
            )
            // eslint-disable-next-line 
    }, [])

    useEffect(() => {
        getUser()
        // eslint-disable-next-line 
    }, [])


    return (
        <Row>
            {
                !loading
                    ? <Col>
                        <BasicSection user_id={userProfile.id} />
                        <BusinessSection user_id={userProfile.id} />
                    </Col>
                    : <div>loading...</div>
            }
        </Row>
    )
}

export default withRouter(Profile);
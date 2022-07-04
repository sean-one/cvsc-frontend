import React, { useState, useContext, useEffect, useCallback } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { Col, Row } from 'react-bootstrap';

import AxiosInstance from '../../helpers/axios';
import { UsersContext } from '../../context/users/users.provider';
import BasicSection from './basicSection/basicSection';
import BusinessSection from './businessSection/businessSection';

const Profile = () => {
    const { userProfile, setUser } = useContext(UsersContext);
    const [ loading, setLoading ] = useState(false);
    
    let history = useHistory()

    const getGoogleUser = useCallback(() => {
        setLoading(true);

        AxiosInstance.get('/auth/google/success')
            .then(response => {
                setUser(response.data.user)
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
        getGoogleUser()
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
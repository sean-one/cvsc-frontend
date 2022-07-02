import React, { useState, useContext, useEffect, useCallback } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { Col, Row } from 'react-bootstrap';

import AxiosInstance from '../../helpers/axios';
// import { useUserRolesQuery } from '../../hooks/useUserAuthApi';
import { UsersContext } from '../../context/users/users.provider';
import BasicSection from './basicSection/basicSection';
import BusinessSection from './businessSection/businessSection';

const Profile = () => {
    const { setUser, useAccountType } = useContext(UsersContext);
    // const { data } = useUserRolesQuery(userProfile.id)
    const [ loading, setLoading ] = useState(false);
    const account_type = useAccountType()
    
    let history = useHistory()

    const getGoogleUser = useCallback(() => {
        setLoading(true);

        AxiosInstance.get('/auth/google/success')
            .then(response => {
                setUser(response.data.user)
                setLoading(false)
            })
            .catch(err => {
                if(err.response.status === 401) {
                    history.push('/login')
                }
            })
    }, [setUser, history])

    useEffect(() => {
        getGoogleUser()
        // eslint-disable-next-line 
    }, [])

    
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
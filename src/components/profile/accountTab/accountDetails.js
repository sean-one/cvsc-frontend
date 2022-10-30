import React, { useContext } from 'react';
import { Col, Image, Row } from 'react-bootstrap';
import default_profile from '../../../assets/default_user_icon.png'

import { UsersContext } from '../../../context/users/users.provider';

const AccountDetails = () => {
    const { userProfile } = useContext(UsersContext);
    

    return (
        <div className='d-flex flex-column align-items-center border mb-3'>
            <Col xs={8} className='p-1 text-center'>
                <Image thumbnail roundedCircle src={userProfile.avatar || default_profile} alt={`${userProfile.username} avatar`} />
            </Col>
            <Col xs={12} className='d-flex flex-column justify-content-center'>
                <Row className='m-0 ps-3'>{userProfile?.username}</Row>
                <Row className='m-0 ps-3'>{userProfile?.email}</Row>
                <Row className='m-0 ps-3'>{`Account Type: ${userProfile.account_type || 'basic'}`}</Row>
            </Col>
        </div>
    )
}

export default AccountDetails;
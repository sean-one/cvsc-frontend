import React, { useContext } from 'react';
import { Col, Image, Row } from 'react-bootstrap';

import { UsersContext } from '../../../context/users/users.provider';

const AccountDetails = () => {
    const { userProfile, setAccountType } = useContext(UsersContext);
    const account_type = setAccountType()
    
    return (
        <div className='d-flex flex-column align-items-center border mb-3'>
            <Col xs={8} className='p-1'>
                <Image thumbnail roundedCircle src={userProfile.avatar} alt={`${userProfile.username} avatar`} />
            </Col>
            <Col xs={12} className='d-flex flex-column justify-content-center'>
                <Row className='m-0 ps-3'>{userProfile.username}</Row>
                <Row className='m-0 ps-3'>{userProfile.email}</Row>
                <Row className='m-0 ps-3'>{`Account Type: ${account_type.toUpperCase()}`}</Row>
            </Col>
        </div>
    )
}

export default AccountDetails;
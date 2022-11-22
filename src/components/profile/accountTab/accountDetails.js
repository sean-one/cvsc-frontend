import React from 'react';
import { Col, Image, Row } from 'react-bootstrap';
import default_profile from '../../../assets/default_user_icon.png'
import { role_types } from '../../../helpers/dataCleanUp';
import useAuth from '../../../hooks/useAuth';

const AccountDetails = () => {
    const { auth } = useAuth()

    return (
        <div className='d-flex flex-column align-items-center border mb-3'>
            <Col xs={8} className='p-1 text-center'>
                <Image thumbnail roundedCircle src={auth?.user.avatar || default_profile} alt={`user avatar`} />
            </Col>
            <Col xs={12} className='d-flex flex-column justify-content-center'>
                <Row className='m-0 ps-3'>{auth?.user.username}</Row>
                <Row className='m-0 ps-3'>{auth?.user.email}</Row>
                <Row className='m-0 ps-3'>{`Account Type: ${role_types[auth.user.account_type]}`}</Row>
            </Col>
        </div>
    )
}

export default AccountDetails;
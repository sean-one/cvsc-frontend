import React, { useContext } from 'react';
import { Card, Col, Image, Row } from 'react-bootstrap';
import styled from 'styled-components';

import { UsersContext } from '../../../context/users/users.provider';


const ProfileImgStyles = styled.div`
    .userProfileImage {
        width: 200px;
        height: 200px;
    }
`;


const UserSection = () => {
    const { userProfile, useAccountType } = useContext(UsersContext)
    const account_type = useAccountType()

    return (
        <Card>
            <Row lg={12}>
                <Col md={4} className='p-5' >
                    <ProfileImgStyles>
                        <Image className='userProfileImage' roundedCircle src={`${userProfile.avatar}`} alt='user profile' />
                    </ProfileImgStyles>
                </Col>
                <Col className='my-auto ps-3'>
                    <Card.Body>
                        <Card.Title>{userProfile.username}</Card.Title>
                        <Card.Subtitle>{userProfile.email}</Card.Subtitle>
                        <Card.Text>{`Account Type: ${account_type.toUpperCase()}`}</Card.Text>
                    </Card.Body>
                </Col>
            </Row>
        </Card>
    )
}

export default UserSection;
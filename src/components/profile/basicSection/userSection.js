import React, { useContext } from 'react';
import { Card, Col, Image, Row } from 'react-bootstrap';
import styled from 'styled-components';

import { UsersContext } from '../../../context/users/users.provider';
import { useUserRolesQuery } from '../../../hooks/useUserAuthApi';

const ProfileImgStyles = styled.div`
    .userProfileImage {
        width: 200px;
        height: 200px;
    }
`;


const UserSection = ({ user_id }) => {
    const { data: roles, isLoading } = useUserRolesQuery(user_id)
    const { userProfile, setAccountType } = useContext(UsersContext)

    if(isLoading) {
        return <div>loading...</div>
    }

    const account_type = setAccountType(roles.data)

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
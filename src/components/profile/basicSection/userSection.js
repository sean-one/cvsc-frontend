import React, { useContext } from 'react';
import { Button, Card, Col, Row, Image, ButtonGroup } from 'react-bootstrap';
import styled from 'styled-components';

import { UsersContext } from '../../../context/users/users.provider';


const ProfileImgStyles = styled.div`
    .userProfileImage {
        width: 200px;
        height: 200px;
    }
`;


const UserSection = (props) => {
    const { userProfile } = useContext(UsersContext)

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
                    </Card.Body>
                </Col>
            </Row>
            <Row sm={2} className='d-flex justify-content-end'>
                <ButtonGroup>
                    <Button variant='secondary' className='mx-2'>edit</Button>
                    <Button variant='success'>submit</Button>
                </ButtonGroup>
            </Row>
        </Card>
    )
}

export default UserSection;
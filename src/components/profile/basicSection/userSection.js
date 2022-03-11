import React, { useContext } from 'react';
import { Card, Col, Row, Image } from 'react-bootstrap';
import styled from 'styled-components';

import { UsersContext } from '../../../context/users/users.provider';

import ContactSection from '../../contact/contactSection';

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
                <Col>
                    <Card.Body>
                        <Card.Title>{userProfile.username}</Card.Title>
                        <ContactSection />
                    </Card.Body>
                </Col>
            </Row>
        </Card>
    )
}

export default UserSection;
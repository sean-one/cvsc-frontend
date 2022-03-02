import React, { useContext } from 'react';
import { Card, Button, Col, Container, Row, Image } from 'react-bootstrap';
import styled from 'styled-components';

import { UsersContext } from '../../../context/users/users.provider';

import UserAvatar from './userAvatar';
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
        <React.Fragment>
            <Container>
                <Card>
                    <Row lg={12}>
                        <Col md={4} className='p-5' >
                            <ProfileImgStyles>
                                <Image className='userProfileImage' roundedCircle src={`${userProfile.avatar}`} alt='user profile' />
                            </ProfileImgStyles>
                            {/* <UserAvatar /> */}
                        </Col>
                        <Col>
                            <Card.Body>
                                <Card.Title>{userProfile.username}</Card.Title>
                                <ContactSection />
                            </Card.Body>
                        </Col>
                    </Row>
                </Card>
            </Container>
        </React.Fragment>
        // <div className='userSection'>
        //     <div className={props.viewable ? 'userProfile' : 'inactive'}>
        //         <div className='userDetails'>
        //             <div className='username'>
        //                 <h3>{userProfile['username']}</h3>
        //             </div>
        //             <UserAvatar />
        //         </div>
        //         <ContactSection />
        //     </div>
        // </div>
    )
}

export default UserSection;
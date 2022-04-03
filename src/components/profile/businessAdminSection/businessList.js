import React, { useContext } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCannabis, faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons';
import { Col, Container, Row } from 'react-bootstrap';

import { SiteContext } from '../../../context/site/site.provider';
import { UsersContext } from '../../../context/users/users.provider';

const BusinessList = (props) => {
    const { useBusinessAdmin } = useContext(SiteContext)
    const { userProfile } = useContext(UsersContext)
    
    const business_admin_ids = useBusinessAdmin(userProfile.id)

    // console.log(business_admin_ids[0])
    return (
        <Container className='px-0'>
            {
                business_admin_ids.map(business => (
                    <Row key={business.id} className='d-flex'>
                        <Col className='flex-grow-0'><FontAwesomeIcon icon={faCannabis} size='1x'></FontAwesomeIcon></Col>
                        <Col className='flex-grow-1'><Link to={{
                            pathname: `/business/${business.id}`,
                            state: {
                                business,
                                from: props.location.pathname
                            }
                        }}>{business.name}</Link></Col>
                        <Col className='flex-grow-1'>req Open:</Col>
                        <Col className='flex-grow-0'><FontAwesomeIcon icon={business.requestOpen ? faToggleOn : faToggleOff} size='1x'></FontAwesomeIcon></Col>
                    </Row>
                ))
            }
        </Container>
    )
}

export default withRouter(BusinessList);
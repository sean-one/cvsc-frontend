import React, { useContext } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Col, Container, Row } from 'react-bootstrap';

import { SiteContext } from '../../../context/site/site.provider';
import { UsersContext } from '../../../context/users/users.provider';

const BusinessList = (props) => {
    const { useBusinessAdmin } = useContext(SiteContext)
    const { userProfile } = useContext(UsersContext)
    
    const business_admin_ids = useBusinessAdmin(userProfile.id)

    return (
        <Container className='px-0'>
            {
                business_admin_ids.map(business => (
                    <Row key={business.id} className='d-flex'>
                        <Col className='flex-grow-1'><Link to={{
                            pathname: `/business/admin/${business.id}`,
                            state: {
                                business_id: business.id,
                                from: props.location.pathname
                            }
                        }}>{business.business_name}</Link></Col>
                    </Row>
                ))
            }
        </Container>
    )
}

export default withRouter(BusinessList);
import React, { useContext } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Col, Container, Row } from 'react-bootstrap';

import { SiteContext } from '../../../context/site/site.provider';
import { UsersContext } from '../../../context/users/users.provider';

const BusinessList = (props) => {
    const { useBusinessByIdList } = useContext(SiteContext)
    const { useRoleBuinsessIds_Management } = useContext(UsersContext)
    const business_ids = useRoleBuinsessIds_Management()
    const business_list = useBusinessByIdList(business_ids)

    return (
        <Container className='px-0'>
            {
                business_list.map(business => (
                    <Row key={business.id} className='d-flex'>
                        <Col className='flex-grow-1'><Link to={{
                            pathname: `/business/admin/${business.id}`,
                            state: {
                                business_id: business.id,
                                from: props.location.pathname
                            }
                        }}>{business.business_name}</Link></Col>
                        <Col>{business.business_type}</Col>
                    </Row>
                ))
            }
        </Container>
    )
}

export default withRouter(BusinessList);
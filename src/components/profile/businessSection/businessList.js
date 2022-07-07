import React, { useContext } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Col, Container, Row } from 'react-bootstrap';

import { useBusinessesQuery } from '../../../hooks/useBusinessApi';
import { UsersContext } from '../../../context/users/users.provider';

const BusinessList = (props) => {
    const { data: businesses, isLoading } = useBusinessesQuery()
    const { useRoleBuinsessIds_Management } = useContext(UsersContext)
    const business_ids = useRoleBuinsessIds_Management()

    if(isLoading) {
        return <div>loading...</div>
    }

    const business_list = businesses.data.filter(business => business_ids.includes(business.id))

    return (
        <Container className='px-0'>
            {
                business_list.map(business => (
                    <Row key={business.id} className='d-flex'>
                        <Col className='flex-grow-1'><Link to={{
                            pathname: `/business/manage/${business.id}`,
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
import React from 'react';
import { withRouter } from 'react-router-dom';
import { Col, Container, Image, Row } from 'react-bootstrap'

import UpcomingBusinessView from '../upcoming/upcoming.businessview';
import useBusinessFilter from '../../hooks/useBusinessFilter';

import BusinessLogo from '../../assets/business_logo.jpg'

const BusinessView = (props) => {
    const { business } = useBusinessFilter(props.match.params.id)

    return (
        <Container className='px-0'>
            <Row>
                <Col>
                    <Image fluid src={BusinessLogo} alt={business.name} />
                </Col>
                <Col className='d-flex flex-column align-items-left justify-content-center'>
                    <Row>
                        <h2>{business.name}</h2>
                    </Row>
                    <Row>
                        <Row>
                            {`Email: ${business.email}`}
                        </Row>
                        <Row>
                            {`Instagram: ${business.instagram}`}
                        </Row>
                    </Row>
                </Col>
            </Row>
            <Row className='m-3 fw-bold'>
                {business.formatted}
            </Row>
            <Row className='py-3 m-2 fs-4 lh-lg border-top border-bottom'>
                {business.description}
            </Row>
            <UpcomingBusinessView business={business.id}/>
        </Container>
    )
}

export default withRouter(BusinessView);
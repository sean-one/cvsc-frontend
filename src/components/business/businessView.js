import React from 'react';
import { withRouter } from 'react-router-dom';
import { Col, Container, Image, Row } from 'react-bootstrap'

import UpcomingBusinessView from '../upcoming/upcoming.businessview';
import useBusinessFilter from '../../hooks/useBusinessFilter';


const BusinessView = (props) => {
    const { business } = useBusinessFilter(props.match.params.id)

    return (
        <Container>
            <Row>
                <Col>
                    <Image fluid src={business.avatar} alt={business.name} />
                </Col>
                <Col>
                    <Row>
                        <h2>{business.name}</h2>
                    </Row>
                    <Row>
                        {`Email: ${business.email}`}
                    </Row>
                    <Row>
                        {`Instagram: ${business.instagram}`}
                    </Row>
                </Col>
            </Row>
            <Row>
                {business.formatted}
            </Row>
            <Row>
                {business.description}
            </Row>
            <UpcomingBusinessView business={business.id}/>
        </Container>
    )
}

export default withRouter(BusinessView);
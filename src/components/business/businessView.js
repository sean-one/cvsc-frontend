import React from 'react';
import { withRouter } from 'react-router-dom';
import { Col, Container, Image, Row } from 'react-bootstrap'

import { useBusinessQuery } from '../../hooks/useBusinessApi';
import UpcomingBusiness from '../events/upcoming/upcoming.business';

const BusinessView = (props) => {
    const { data: business, isLoading } = useBusinessQuery(props.match.params.id)

    if (isLoading) {
        return <p>loading...</p>
    }

    return (
        <Container className='px-0'>
            <Row className='m-2 px-0'>
                <Col className='mx-auto'>
                    <Image fluid src='https://picsum.photos/500/500' alt={business.data.business_name} />
                </Col>
                <Col className='d-flex flex-column align-items-left justify-content-center'>
                    <Row className='px-0'>
                        <h2 className='px-0'>{business.data.business_name}</h2>
                    </Row>
                    <Row className='d-flex flex-column px-0 mt-3'>
                        <Row className='px-0 mx-0'>
                            {`Email: ${business.data.business_email}`}
                        </Row>
                        {/* dynamically add optional contact information */}
                        <Row className='px-0 mx-0'>
                            {
                                (business.data.business_phone !== null)
                                    ? `Phone: ${business.data.business_phone}`
                                    : null
                            }
                        </Row>
                        <Row className='px-0 mx-0'>
                            {
                                (business.data.business_instagram !== null)
                                    ? `Instagram: ${business.data.business_instagram}`
                                    : null
                            }
                        </Row>
                        <Row className='px-0 mx-0'>
                            {
                                (business.data.business_facebook !== null)
                                    ? `Facebook: ${business.data.business_facebook}`
                                    : null
                            }
                        </Row>
                        <Row className='px-0 mx-0'>
                            {
                                (business.data.business_website !== null)
                                    ? `Website: ${business.data.business_website}`
                                    : null
                            }
                        </Row>
                    </Row>
                </Col>
            </Row>
            <Row className='m-2 py-3 fw-bold'>
                <Col xs={10}>
                    {business.data.formatted}
                </Col>
            </Row>
            <Row className='py-3 m-2 fs-4 lh-lg border-top border-bottom'>
                {business.data.business_description}
            </Row>
            <UpcomingBusiness business={business.data}/>
        </Container>
    )
}

export default withRouter(BusinessView);
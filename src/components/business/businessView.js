import React, { useContext } from 'react';
import { withRouter } from 'react-router-dom';
import { Col, Container, Image, Row } from 'react-bootstrap'

import { SiteContext } from '../../context/site/site.provider';

import UpcomingBusinessView from '../upcoming/upcoming.businessview';

const BusinessView = (props) => {
    const { useBusinessById } = useContext(SiteContext);
    const business = useBusinessById(props.match.params.id);

    return (
        <Container className='px-0'>
            <Row className='m-2 px-0'>
                <Col className='mx-auto'>
                    <Image fluid src='https://picsum.photos/500/500' alt={business.name} />
                </Col>
                <Col className='d-flex flex-column align-items-left justify-content-center'>
                    <Row className='px-0'>
                        <h2 className='px-0'>{business.name}</h2>
                    </Row>
                    <Row className='d-flex flex-column px-0 mt-3'>
                        <Row className='px-0 mx-0'>
                            {`Email: ${business.email}`}
                        </Row>
                        <Row className='px-0 mx-0'>
                            {
                                (business.phone !== null)
                                    ? `Phone: ${business.phone}`
                                    : null
                            }
                        </Row>
                        <Row className='px-0 mx-0'>
                            {
                                (business.instagram !== null)
                                    ? `Instagram: ${business.instagram}`
                                    : null
                            }
                        </Row>
                        <Row className='px-0 mx-0'>
                            {
                                (business.facebook !== null)
                                    ? `Facebook: ${business.facebook}`
                                    : null
                            }
                        </Row>
                        <Row className='px-0 mx-0'>
                            {
                                (business.website !== null)
                                    ? `Website: ${business.website}`
                                    : null
                            }
                        </Row>
                    </Row>
                </Col>
            </Row>
            <Row className='m-2 py-3 fw-bold'>
                <Col xs={10}>
                    {business.formatted}
                </Col>
            </Row>
            <Row className='py-3 m-2 fs-4 lh-lg border-top border-bottom'>
                {business.description}
            </Row>
            <UpcomingBusinessView business={business.id}/>
        </Container>
    )
}

export default withRouter(BusinessView);
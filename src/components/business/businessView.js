import React from 'react';
import { withRouter } from 'react-router-dom';
import { Col, Image, Row } from 'react-bootstrap'

import { useBusinessQuery } from '../../hooks/useBusinessApi';
import UpcomingBusiness from '../events/upcoming/upcoming.business';
import BusinessLocation from './location/businessLocation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faGlobe, faPhone } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';

const BusinessView = (props) => {
    const { data: business, isLoading } = useBusinessQuery(props.match.params.id)

    if (isLoading) {
        return <p>loading...</p>
    }

    return (
        <>
            <Row>
                <h1 className='mb-0'>{business.data.business_name}</h1>
            </Row>
            {
                (business.data.business_type !== 'brand') && (
                    <BusinessLocation business={business.data} />
                )
            }
            <Row className='px-0 mb-3'>
                <Col xs={5}>
                    <Image src={business.data.business_avatar} alt={business.data.business_name} thumbnail />
                </Col>
                {/* contact section */}
                <Col xs={7} className='fs-6 py-3 px-2'>
                    <Row className='px-0'>
                        <Col xs={1} className='m-0 p-0'><FontAwesomeIcon icon={faEnvelope} /></Col>
                        <Col xs={11} className='p-0'>{business.data.business_email}</Col>
                    </Row>
                    {/* dynamically add optional contact information */}
                    {
                        (business.data.business_phone) && (
                            <Row>
                                <Col xs={1} className='m-0 p-0'><FontAwesomeIcon icon={faPhone} /></Col>
                                <Col xs={11} className='p-0'>{business.data.business_phone}</Col>
                            </Row>
                        )
                    }
                    {
                        (business.data.business_instagram) && (
                            <Row>
                                <Col xs={1} className='m-0 p-0'><FontAwesomeIcon icon={faInstagram} /></Col>
                                <Col xs={11} className='p-0'>{business.data.business_instagram}</Col>
                            </Row>
                        )
                    }
                    {
                        (business.data.business_facebook) && (
                            <Row>
                                <Col xs={1} className='m-0 p-0'><FontAwesomeIcon icon={faFacebook} /></Col>
                                <Col xs={11} className='p-0'>{business.data.business_facebook}</Col>
                            </Row>
                        )
                    }
                    {
                        (business.data.business_website) && (
                            <Row>
                                <Col xs={1} className='m-0 p-0'><FontAwesomeIcon icon={faGlobe} /></Col>
                                <Col xs={11} className='p-0'>{business.data.business_website}</Col>
                            </Row>
                        )
                    }
                    {
                        (business.data.business_twitter) && (
                            <Row>
                                <Col xs={1} className='m-0 p-0'><FontAwesomeIcon icon={faTwitter} /></Col>
                                <Col xs={11} className='p-0'>{business.data.business_twitter}</Col>
                            </Row>
                        )
                    }
                </Col>
            </Row>
            <Row className='px-0 mx-0 fs-6 lh-sm pt-2 border-top'>
                <h6 className='ps-0'>About us:</h6>
                {business.data.business_description}
            </Row>
            <UpcomingBusiness business_name={business.data.business_name} business_id={business.data.id} />
        </>
    )
}

export default withRouter(BusinessView);
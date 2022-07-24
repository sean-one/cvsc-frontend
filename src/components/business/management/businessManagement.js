import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Col, Image, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faGlobe, } from '@fortawesome/free-solid-svg-icons';
import { faInstagram, faFacebook, faTwitter } from '@fortawesome/free-brands-svg-icons'

import { useBusinessQuery } from '../../../hooks/useBusinessApi';
import { UsersContext } from '../../../context/users/users.provider';

import BusinessLocation from '../location/businessLocation';
import BusinessControls from './businessControls';
import BusinessUserRoles from './businessUserRoles/businessUserRoles';
import UpcomingManagement from '../../events/upcoming/upcoming.management';

const BusinessManagement = (props) => {
    const { data: business, isLoading } = useBusinessQuery(props.location.state.business_id)
    const { userProfile } = useContext(UsersContext)

    if(isLoading) {
        return <div>loading...</div>
    }

    const current_business = business.data

    return (
        <>
            <Row>
                <Link to={{ pathname: `/business/${business.data.id}` }}>
                    <h1>{current_business.business_name}</h1>
                </Link>
            </Row>
            <Row className='px-0'>
                <Col xs={5}>
                    <Image src={current_business.business_avatar} alt={current_business.business_name} thumbnail/>
                </Col>
                {/* contact section */}
                <Col xs={7} className='fs-6 py-3 px-2'>
                    {
                        (current_business.business_type !== 'brand') && (
                            <Row>
                                <BusinessLocation business={current_business} />
                            </Row>
                        )
                    }
                    <Row className='px-0'>
                        <Col xs={1} className='m-0 px-0'><FontAwesomeIcon icon={faEnvelope} /></Col>
                        <Col xs={11} className='p-0'>{`${current_business.business_email}`}</Col>
                    </Row>
                    {/* dynamically add optional contact information */}
                    {
                        (current_business.business_phone) && (
                            <Row>
                                <Col xs={1} className='m-0 p-0'><FontAwesomeIcon icon={faPhone} /></Col>
                                <Col xs={11} className='p-0'>{`${current_business.business_phone}`}</Col>
                            </Row>
                        )
                    }
                    {
                        (current_business.business_instagram) && (
                            <Row>
                                <Col xs={1} className='m-0 p-0'><FontAwesomeIcon icon={faInstagram} /></Col>
                                <Col xs={11} className='p-0'>{`${current_business.business_instagram}`}</Col>
                            </Row>
                        )

                    }
                    {
                        (current_business.business_facebook) && (
                            <Row>
                                <Col xs={1} className='m-0 p-0'><FontAwesomeIcon icon={faFacebook} /></Col>
                                <Col xs={11} className='p-0'>{`${current_business.business_facebook}`}</Col>
                            </Row>
                        )
                    }
                    {
                        (current_business.business_website) && (
                            <Row>
                                <Col xs={1} className='m-0 p-0'><FontAwesomeIcon icon={faGlobe} /></Col>
                                <Col xs={11} className='p-0'>{`${current_business.business_website.split('.')[1]}`}</Col>
                            </Row>
                        )
                    }
                    {
                        (current_business.business_twitter) && (
                            <Row>
                                <Col xs={1} className='m-0 p-0'><FontAwesomeIcon icon={faTwitter} /></Col>
                                <Col xs={11} className='p-0'>{`${current_business.business_twitter}`}</Col>
                            </Row>
                        )
                    }
                </Col>
            </Row>
            {
                (current_business.business_admin === userProfile.id) && (
                    <BusinessControls business={current_business} />
                )
            }
            <Row className='px-0 mx-0 fs-6 lh-sm mt-1 pt-2 border-top'>
                {current_business.business_description}
            </Row>
            {/* {
                ((current_business.business_type !== 'brand'))
                    ? <BusinessLocation business={current_business} />
                    : null
            } */}
            <BusinessUserRoles business={current_business} />
            <UpcomingManagement business_id={current_business.id} />
        </>
    )
}

export default BusinessManagement;
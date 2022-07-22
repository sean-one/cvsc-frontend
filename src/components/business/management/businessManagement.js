import React, { useContext } from 'react';
import { Col, Image, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faGlobe, } from '@fortawesome/free-solid-svg-icons';
import { faInstagram, faFacebook, faTwitter } from '@fortawesome/free-brands-svg-icons'

import { useBusinessQuery } from '../../../hooks/useBusinessApi';
import { UsersContext } from '../../../context/users/users.provider';

import BusinessLocation from '../location/businessLocation';
// import EditBusinessButton from '../../editButtonModals/editBusinessButton';
import BusinessUserRoles from './businessUserRoles/businessUserRoles';
import UpcomingManagement from '../../events/upcoming/upcoming.management';

const BusinessManagement = (props) => {
    const { data: business, isLoading } = useBusinessQuery(props.location.state.business_id)
    // const { userProfile } = useContext(UsersContext)

    if(isLoading) {
        return <div>loading...</div>
    }

    const current_business = business.data

    return (
        <>
            <Row>
                <Col xs={12}>
                    <h1>{current_business.business_name}</h1>
                </Col>
                {/* {
                    (userProfile.id === current_business.business_admin)
                        ? <EditBusinessButton business={current_business} />
                        : null
                } */}
            </Row>
            <Row className='px-0'>
                <Col xs={5}>
                    <Image src={current_business.business_avatar} alt={current_business.business_name} thumbnail/>
                </Col>
                <Col xs={7} className='fs-6 py-3'>
                    <Row>
                        <Col xs={1} className='m-0 p-0'><FontAwesomeIcon icon={faEnvelope} /></Col>
                        <Col xs={11}>{`${current_business.business_email}`}</Col>
                    </Row>
                    {/* dynamically add optional contact information */}
                    {
                        (current_business.business_phone) && (
                            <Row>
                                <Col xs={1} className='m-0 p-0'><FontAwesomeIcon icon={faPhone} /></Col>
                                <Col xs={11}>{`${current_business.business_phone}`}</Col>
                            </Row>
                        )
                    }
                    {
                        (current_business.business_instagram) && (
                            <Row>
                                <Col xs={1} className='m-0 p-0'><FontAwesomeIcon icon={faInstagram} /></Col>
                                <Col xs={11}>{`${current_business.business_instagram}`}</Col>
                            </Row>
                        )

                    }
                    {
                        (current_business.business_facebook) && (
                            <Row>
                                <Col xs={1} className='m-0 p-0'><FontAwesomeIcon icon={faFacebook} /></Col>
                                <Col xs={11}>{`${current_business.business_facebook}`}</Col>
                            </Row>
                        )
                    }
                    {
                        (current_business.business_website) && (
                            <Row>
                                <Col xs={1} className='m-0 p-0'><FontAwesomeIcon icon={faGlobe} /></Col>
                                <Col xs={11}>{`${current_business.business_website}`}</Col>
                            </Row>
                        )
                    }
                    {
                        (current_business.business_twitter) && (
                            <Row>
                                <Col xs={1} className='m-0 p-0'><FontAwesomeIcon icon={faTwitter} /></Col>
                                <Col xs={11}>{`${current_business.business_twitter}`}</Col>
                            </Row>
                        )
                    }
                </Col>
            </Row>
            <Row>
                <Col>{`Request Open: ${current_business.business_request_open}`}</Col>
                <Col>{`Active Business: ${current_business.active_business}`}</Col>
            </Row>
            <Row className='px-0 mx-0 fs-6 lh-sm mt-2 pt-2 border-top'>
                {current_business.business_description}
            </Row>
            {
                ((current_business.business_type !== 'brand'))
                    ? <BusinessLocation business={current_business} />
                    : null
            }
            <BusinessUserRoles business={current_business} />
            <UpcomingManagement business_id={current_business.id} />
        </>
    )
}

export default BusinessManagement;
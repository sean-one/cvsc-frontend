import React, { useState, useContext } from 'react';
import { Button, Col, Container, Image, Row } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

import { SiteContext } from '../../context/site/site.provider';
import EditBusinessModal from '../editModals/editBusinessModal';
import BusinessLocation from './location/businessLocation';
import BusinessUserRoles from './businessUserRoles';
// import UpcomingBusinessView from '../upcoming/upcoming.businessview';
import UpcomingBusinessAdmin from '../upcoming/upcoming.businessAdmin';

const BusinessAdminView = (props) => {
    const { useBusinessById } = useContext(SiteContext)
    const business = useBusinessById(props.location.state.business_id)
    const [modalShow, setModalShow] = useState(false);

    const handleModalClose = () => setModalShow(false);
    const handleModalOpen = () => setModalShow(true);
    
    return (
        <Container className='px-0'>
            <Row className='m-2 px-0'>
                <Col sm={10} className='fs-2 fw-bold'>
                    {business.business_name}
                </Col>
                <Col sm={2} className='d-flex justify-content-end'>
                    <Button size='sm' variant='info' className='m-2'>
                        <FontAwesomeIcon onClick={handleModalOpen} icon={faEdit} />
                    </Button>
                    <Button size='sm' variant='danger' className='m-2'>
                        <FontAwesomeIcon icon={faTrash} />
                    </Button>
                </Col>
            </Row>
            <Row className='m-2 px-0'>
                <Col md={6} className='m-auto'>
                    <Image fluid src='https://picsum.photos/500/500' alt={business.business_name} />
                </Col>
                <Col md={6} className='d-flex flex-column align-items-left justify-content-start'>
                    <Row className='d-flex flex-column px-0 mt-3'>
                        <Row className='px-0 mx-0'>
                            {`Email: ${business.business_email}`}
                        </Row>
                        {/* dynamically add optional contact information */}
                        <Row className='px-0 mx-0'>
                            {
                                (business.business_phone !== null)
                                    ? `Phone: ${business.business_phone}`
                                    : null
                            }
                        </Row>
                        <Row className='px-0 mx-0'>
                            {
                                (business.business_instagram !== null)
                                    ? `Instagram: ${business.business_instagram}`
                                    : null
                            }
                        </Row>
                        <Row className='px-0 mx-0'>
                            {
                                (business.business_facebook !== null)
                                    ? `Facebook: ${business.business_facebook}`
                                    : null
                            }
                        </Row>
                        <Row className='px-0 mx-0'>
                            {
                                (business.business_website !== null)
                                    ? `Website: ${business.business_website}`
                                    : null
                            }
                        </Row>
                        <Row className='px-0 mx-0'>
                            {
                                (business.business_twitter !== null)
                                    ? `Twitter: ${business.business_twitter}`
                                    : null
                            }
                        </Row>
                        <Row className='px-0 mx-0'>
                            {`Request Open: ${business.business_request_open}`}
                        </Row>
                        <Row className='px-0 mx-0'>
                            {`Active Business: ${business.active_business}`}
                        </Row>
                        <Row className='px-0 mx-0 fs-6 lh-sm mt-2 pt-2 border-top'>
                            {business.business_description}
                        </Row>
                    </Row>
                </Col>
            </Row>
            {
                (business.business_type !== 'brand')
                    ? <BusinessLocation business={business} />
                    : null
            }
            <BusinessUserRoles business_id={business.id} />
            <UpcomingBusinessAdmin />
            {/* <UpcomingBusinessView business={business.id} /> */}
            <EditBusinessModal business={business} modalshow={modalShow} close={handleModalClose} />
        </Container>
    )
}

export default BusinessAdminView;
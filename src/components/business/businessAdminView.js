import React, { useState, useContext } from 'react';
import { Button, Col, Container, Image, Modal, Row } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

import { SiteContext } from '../../context/site/site.provider';
import UpcomingBusinessView from '../upcoming/upcoming.businessview';
import EditBusiness from '../business/editBusiness';

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
                <Col md={6} className='d-flex flex-column align-items-left justify-content-center'>
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
                        <Row className='px-0 mx-0 fs-6 lh-sm mt-2 border-top'>
                            {business.business_description}
                        </Row>
                    </Row>
                </Col>
            </Row>
            <Row className='m-2 fw-bold'>
                <Col sm={2}>
                    <Button size='sm' variant='info' className='m-2'>
                        edit
                        {/* <FontAwesomeIcon onClick={handleModalOpen} icon={faEdit} /> */}
                    </Button>
                </Col>
                <Col sm={10}>
                    {business.formatted}
                </Col>
            </Row>
            <UpcomingBusinessView business={business.id} />
            <Modal centered show={modalShow} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{`${business.business_name}`}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <EditBusiness business={business} handleClose={handleModalClose} />
                </Modal.Body>
            </Modal>
        </Container>
    )
}

export default BusinessAdminView;
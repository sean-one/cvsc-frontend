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
                <Col className='mx-auto'>
                    <Image fluid src='https://picsum.photos/500/500' alt={business.business_name} />
                </Col>
                <Col className='d-flex flex-column align-items-left justify-content-center'>
                    <Row className='px-0'>
                        <h2 className='px-0'>{business.business_name}</h2>
                    </Row>
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
                    </Row>
                </Col>
            </Row>
            <Row className='m-2 py-3 fw-bold'>
                <Col xs={10}>
                    {business.formatted}
                </Col>
                <Col className='d-flex'>
                    <Col>
                        <Button size='sm' variant='info'>
                            <FontAwesomeIcon onClick={handleModalOpen} icon={faEdit} />
                        </Button>
                    </Col>
                    <Col>
                        <Button size='sm' variant='danger'>
                            <FontAwesomeIcon icon={faTrash} />
                        </Button>
                    </Col>
                </Col>
            </Row>
            <Row className='py-3 m-2 fs-4 lh-lg border-top border-bottom'>
                {business.business_description}
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
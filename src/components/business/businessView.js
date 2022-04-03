import React, { useState, useContext, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Col, Container, Image, Modal, Row } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

import { SiteContext } from '../../context/site/site.provider';

import UpcomingBusinessView from '../upcoming/upcoming.businessview';
import EditBusiness from './editBusiness';

// import BusinessLogo from '../../assets/business_logo.jpg'

const BusinessView = (props) => {
    const { useBusinessById } = useContext(SiteContext);
    const business = useBusinessById(Number(props.match.params.id));

    const [ isAdmin, setIsAdmin ] = useState(false);
    const [ modalShow, setModalShow ] = useState(false);

    const handleModalClose = () => setModalShow(false);
    const handleModalOpen = () => setModalShow(true);

    useEffect(() => {
        const user_id = localStorage.getItem('userId')
        if(!user_id) {
            return
        } else {
            if (business.business_admin === Number(user_id)) {
                setIsAdmin(true)
            } else {
                return
            }
        }
    }, [business.business_admin])

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
                            {`Instagram: ${business.instagram}`}
                        </Row>
                    </Row>
                </Col>
            </Row>
            <Row className='m-2 py-3 fw-bold'>
                <Col xs={10}>
                    {business.formatted}
                </Col>
                <Col className={`${isAdmin ? 'd-flex' : 'd-none'}`}>
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
                {business.description}
            </Row>
            <UpcomingBusinessView business={business.id}/>
            <Modal show={modalShow} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Business</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <EditBusiness business={business} handleClose={handleModalClose}/>
                </Modal.Body>
            </Modal>
        </Container>
    )
}

export default withRouter(BusinessView);
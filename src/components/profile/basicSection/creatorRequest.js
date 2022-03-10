import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, Button, Col, Container, Form, Row } from 'react-bootstrap';

import { requestBusinessCreator } from '../../../helpers/validationSchemas';
import AxiosInstance from '../../../helpers/axios';
import { SiteContext } from '../../../context/site/site.provider';
import { NotificationsContext } from '../../../context/notifications/notifications.provider';
import useBusinessList from '../../../hooks/useBusinessList';


const CreatorRequest = (props) => {
    const { dispatch } = useContext(NotificationsContext);
    const { businessList } = useContext(SiteContext)
    const { businessCreatorRequest } = useBusinessList(businessList)
    
    const [ requestStatus, setRequestStatus ] = useState('')
    const [ show, setShow ] = useState(false)
    const { register, handleSubmit, reset, formState:{ errors } } = useForm({
        mode: 'onBlur',
        resolver: yupResolver(requestBusinessCreator)
    });

    const sendRequest = (data) => {
        console.log(data)
        const token = localStorage.getItem('token')

        AxiosInstance.post('/roles/create-request', data, {
            headers: { 'Authorization': 'Bearer ' + token }
        })
            .then(response => {
                setRequestStatus('request successfully sent')
                setTimeout(() => {
                    reset()
                    setRequestStatus('')
                }, 1000)
                
            })
            .catch(err => {
                
                if(err.response.data.type === 'duplicate') {
                    setShow(true)
                    setRequestStatus('a previous request for this business is still pending')
                }

                if(err.response.data.type === 'missing input') {
                    setShow(true)
                    setRequestStatus('please be sure to select both the business & admin rights')
                }

                setTimeout(() => {
                    reset()
                    setRequestStatus('')
                }, 1000)
            })
    }

    const resetStatus = () => {
        setRequestStatus('')
    }


    return (
        <Container className='p-0'>
            <Form onSubmit={handleSubmit(sendRequest)}>
                <Row className='d-flex align-items-center'>
                    <Col sm={12} lg={8}>
                        <Form.Group controlId='business_id' className='d-flex justify-content-start alight-items-lg-center'>
                            <Form.Select {...register('business_id', { valueAsNumber: true})} required onFocus={resetStatus} >
                                <option>Business Select...</option>
                                {
                                    businessCreatorRequest.map(business => (
                                        <option key={business.id} value={business.id}>{business.name}</option>
                                        ))
                                    }
                            </Form.Select>
                        </Form.Group>
                    </Col>

                    <Col md={12} lg={4}>
                        <Form.Group controlId='request_for'>
                            <Row className='d-flex'>
                                <Col className='d-flex flex-column align-items-center'>
                                    <Form.Check {...register('request_for', { required: true })} type={'radio'} id='creator_rights' value='creator' />
                                    <Form.Label>creator</Form.Label>
                                </Col>

                                <Col className='d-flex flex-column align-items-center'>
                                    <Form.Check {...register('request_for', { required: true })} type={'radio'} id='admin_rights' value='admin' />
                                    <Form.Label>admin</Form.Label>
                                </Col>
                            </Row>
                        </Form.Group>
                    </Col>
                </Row>
                <Row className='m-2'>
                    <Col lg={4}>
                        <Button type='submit'>Submit</Button>
                    </Col>

                    <Col lg={8}>
                        <p>{errors.business_id?.message}</p>
                        <Alert show={show} dismissible={true}>
                            {requestStatus}
                        </Alert>
                    </Col>
                </Row>
            </Form>
            <Button onClick={() => dispatch({ type: 'ADD_NOTIFICATION', payload: { notification_type: 'error', message: 'from button'} })}>notification</Button>
        </Container>
    )
}

export default CreatorRequest;
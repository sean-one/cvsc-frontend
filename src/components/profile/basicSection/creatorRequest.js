import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';

import { requestBusinessCreator } from '../../../helpers/validationSchemas';
import AxiosInstance from '../../../helpers/axios';
import { SiteContext } from '../../../context/site/site.provider';
import useBusinessList from '../../../hooks/useBusinessList';

// import './basicSection.css'

const CreatorRequest = (props) => {
    const { businessList } = useContext(SiteContext)
    const { businessCreatorRequest } = useBusinessList(businessList)
    
    const [ requestStatus, setRequestStatus ] = useState('')
    const { register, handleSubmit, reset, formState:{ errors } } = useForm({
        mode: 'onBlur',
        resolver: yupResolver(requestBusinessCreator)
    });

    const sendRequest = (data) => {
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
                    setRequestStatus('a previous request for this business is still pending')
                }

                if(err.response.data.type === 'missing input') {
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
        <Container>
            <Form onSubmit={handleSubmit(sendRequest)}>
                <Row>
                    <Col lg={8}>
                        <Form.Group controlId='business_id' className='d-flex justify-content-start alight-items-lg-center'>
                            <Form.Label>Business</Form.Label>
                            <Form.Select {...register('business_id', { valueAsNumber: true})} required onFocus={resetStatus} >
                                <option value='0'>Select...</option>
                                {
                                    businessCreatorRequest.map(business => (
                                        <option key={business.id} value={business.id}>{business.name}</option>
                                    ))
                                }
                                <p className='errormessage'>{errors.business_id?.message}</p>
                            </Form.Select>
                        </Form.Group>
                    </Col>

                    <Col lg={4}>
                    <Form.Group controlId='request_for'>
                        <Row>
                            <Col lg={6}>
                                <Form.Label>creator</Form.Label>
                                <Form.Check {...register('request_for', { required: true })} type={'radio'} id='creator_rights' value='creator' />
                            </Col>

                            <Col lg={6}>
                                <Form.Label>admin</Form.Label>
                                <Form.Check {...register('request_for', { required: true })} type={'radio'} id='admin_rights' value='admin' />
                            </Col>
                        </Row>
                    </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Button type='submit'>Submit</Button>
                </Row>
            </Form>
        </Container>
    )
}

export default CreatorRequest;
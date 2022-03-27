import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Col, Form, Row } from 'react-bootstrap';

import { requestBusinessCreator } from '../../../helpers/validationSchemas';
import AxiosInstance from '../../../helpers/axios';
import { NotificationsContext } from '../../../context/notifications/notifications.provider';
import useBusinessListFilter from '../../../hooks/useBusinessListFilter';

const CreatorRequest = () => {
    const { dispatch } = useContext(NotificationsContext);
    const { business_filtered } = useBusinessListFilter()
    
    const { register, handleSubmit, reset, clearErrors, formState:{ errors } } = useForm({
        mode: 'onBlur',
        resolver: yupResolver(requestBusinessCreator)
    });

    const sendRequest = (data) => {
        const token = localStorage.getItem('token')

        AxiosInstance.post('/roles/create-request', data, {
            headers: { 'Authorization': 'Bearer ' + token }
        })
            .then(response => {
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'SUCCESS',
                        message: `your ${data.request_for} rights request submitted`
                    }
                })
            })
            .catch(err => {
                
                if(err.response.data.type === 'duplicate') {
                    dispatch({
                        type: "ADD_NOTIFICATION",
                        payload: {
                            notification_type: 'error',
                            message: 'a previous request for this business is still pending'
                        }
                    })
                }

                if(err.response.data.type === 'missing input') {
                    dispatch({
                        type: "ADD_NOTIFICATION",
                        payload: {
                            notification_type: 'error',
                            message: 'please be sure to select both the business & admin rights'
                        }
                    })
                }
            })
            .finally(() => {
                reset()
            })
    }

    return (
        <Form onSubmit={handleSubmit(sendRequest)}>
            <Row className='d-flex align-items-center'>
                <Col sm={12} lg={8}>
                    <Form.Group controlId='business_id' className='d-flex justify-content-start alight-items-lg-center'>
                        <Form.Select
                            className={errors.business_id ? 'inputError' : ''}
                            onFocus={() => clearErrors('business_id')}
                            {...register('business_id', { valueAsNumber: true})}
                            required
                        >
                            <option>Business Select...</option>
                            {
                                business_filtered.map(business => (
                                    <option key={business.id} value={business.id}>{business.name}</option>
                                    ))
                                }
                        </Form.Select>
                    </Form.Group>
                    <div className='errormessage'>{errors.business_id?.message}</div>
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
            </Row>
        </Form>
    )
}

export default CreatorRequest;
import React, { useContext } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';

import AxiosInstance from '../../helpers/axios';
import { addBusinessSchema } from '../../helpers/validationSchemas';
import { addBusiness } from '../../helpers/dataCleanUp';
import { NotificationsContext } from '../../context/notifications/notifications.provider';

const CreateBusiness = (props) => {
    const {dispatch } = useContext(NotificationsContext) 
    const { register, handleSubmit, watch, reset, clearErrors, formState: { errors } } = useForm({
        mode: 'onBlur',
        resolver: yupResolver(addBusinessSchema)
    });

    const businessType = watch('business_type', 'brand')
    let history = useHistory();

    const sendRequest = (data) => {
        const token = localStorage.getItem('token')

        // clean and format data
        data = addBusiness(data)
        
        AxiosInstance.post('/business/create', data, {
            headers: { 'Authorization': 'Bearer ' + token }
        })
            .then(response => {
                if (response.status === 201) {
                    reset()
                    dispatch({
                        type: "ADD_NOTIFICATION",
                        payload: {
                            notification_type: 'SUCCESS',
                            message: 'business request submitted'
                        }
                    })
                    history.push({
                        pathname: '/profile',
                    });
                }
            })
            .catch(err => {
                console.log(err)
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'ERROR',
                        message: 'there was a server error'
                    }
                })
            })
    }


    return (
        <Form onSubmit={handleSubmit(sendRequest)}>
            <Form.Group controlId='business_name'>
                <Form.Label>Business Name</Form.Label>
                <Form.Control
                    className={errors.business_name ? 'inputError' : ''}
                    {...register('business_name')}
                    autoFocus
                    onFocus={() => clearErrors('business_name')}
                    type='text'
                    name='business_name'
                    required
                />
                <div className='errormessage'>{errors.business_name?.message}</div>
            </Form.Group>

            <Form.Group controlId='email'>
                <Form.Label>Business Email</Form.Label>
                <Form.Control
                    className={errors.email ? 'inputError' : ''}
                    {...register('email')}
                    onFocus={() => clearErrors('email')}
                    type='text'
                    name='email'
                    required
                />
                <div className='errormessage'>{errors.email?.message}</div>
            </Form.Group>

            <Form.Group controlId='business_avatar'>
                <Form.Label>Business Branding</Form.Label>
                <Form.Control
                    className={errors.business_avatar ? 'inputError' : ''}
                    {...register('business_avatar')}
                    onFocus={() => clearErrors('business_avatar')}
                    type='text'
                    name='business_avatar'
                    required
                />
                <div className='errormessage'>{errors.business_avatar?.message}</div>
            </Form.Group>

            <Form.Group controlId='business_description'>
                <Form.Label>Business Bio</Form.Label>
                <Form.Control
                    className={errors.business_description ? 'inputError' : ''}
                    {...register('business_description')}
                    onFocus={() => clearErrors('business_description')}
                    as='textarea'
                    rows={3}
                    name='business_description'
                    required
                />
                <div className='errormessage'>{errors.business_description?.message}</div>
            </Form.Group>

            <Form.Group controlId='business_type'>
                <Form.Label>Business Type</Form.Label>
                <Form.Select
                    className={errors.business_type ? 'inputError' : ''}
                    {...register('business_type')}
                    onFocus={() => clearErrors('business_type')}
                    type='text'
                    name='business_type'
                    required
                >
                    <option value='brand'>Brand</option>
                    <option value='venue'>Dispensary</option>
                    <option value='both'>{`Brand & Dispensary`}</option>
                </Form.Select>
                <div className='errormessage'>{errors.business_type?.message}</div>
            </Form.Group>

            {
                (businessType !== 'brand') && (
                    <Container>
                        <Row>
                            <Col>
                                <Form.Group controlId='street_address'>
                                    <Form.Label>Street Address</Form.Label>
                                    <Form.Control
                                        className={errors.street_address ? 'inputError' : ''}
                                        {...register('street_address')}
                                        onFocus={() => clearErrors('street_address')}
                                        type='text'
                                        name='street_address'
                                        required
                                    />
                                    <div className='errormessage'>{errors.street_address?.message}</div>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col lg={6}>
                                <Form.Group controlId='city'>
                                    <Form.Label>City</Form.Label>
                                    <Form.Control
                                        className={errors.city ? 'inputError' : ''}
                                        {...register('city')}
                                        onFocus={() => clearErrors('city')}
                                        type='text'
                                        name='city'
                                        required
                                    />
                                    <div className='errormessage'>{errors.city?.message}</div>
                                </Form.Group>
                            </Col>

                            <Col lg={3}>
                                <Form.Group controlId='state'>
                                    <Form.Label>State</Form.Label>
                                    <Form.Control
                                        className={errors.state ? 'inputError' : ''}
                                        {...register('state')}
                                        onFocus={() => clearErrors('state')}
                                        type='text'
                                        name='state'
                                        required
                                    />
                                    <div className='errormessage'>{errors.state?.message}</div>
                                </Form.Group>
                            </Col>

                            <Col lg={3}>
                                <Form.Group controlId='zip'>
                                    <Form.Label>Zip</Form.Label>
                                    <Form.Control
                                        className={errors.zip ? 'inputError' : ''}
                                        {...register('zip')}
                                        onFocus={() => clearErrors('zip')}
                                        type='text'
                                        name='zip'
                                        required
                                    />
                                    <div className='errormessage'>{errors.zip?.message}</div>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Container>
                )
            }
            
            <Form.Group controlId='instagram'>
                <Form.Label>Instagram</Form.Label>
                <Form.Control
                    className={errors.instagram ? 'inputError' : ''}
                    {...register('instagram')}
                    onFocus={() => clearErrors('instagram')}
                    type='text'
                    name='instagram'
                />
                <div className='errormessage'>{errors.instagram?.message}</div>
            </Form.Group>

            <Form.Group controlId='website'>
                <Form.Label>Website</Form.Label>
                <Form.Control
                    className={errors.website ? 'inputError' : ''}
                    {...register('website')}
                    onFocus={() => clearErrors('website')}
                    type='text'
                    name='website'
                />
                <div className='errormessage'>{errors.website?.message}</div>
            </Form.Group>

            <Button type='submit'>Submit</Button>
        </Form>
    )
}

export default withRouter(CreateBusiness);
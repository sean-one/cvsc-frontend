import React, { useState } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';

import AxiosInstance from '../../helpers/axios';
import { addBusinessSchema } from '../../helpers/validationSchemas';
import { addBusiness } from '../../helpers/dataCleanUp';

const CreateBusiness = (props) => {
    const [serverError, setServerError] = useState(false)
    const { register, handleSubmit, setError, watch, reset, formState: { errors } } = useForm({
        mode: 'onBlur',
        resolver: yupResolver(addBusinessSchema)
    });

    const businessType = watch('business_type', 'brand')
    let history = useHistory();

    const sendRequest = (data) => {
        setServerError(false)

        const token = localStorage.getItem('token')

        data = addBusiness(data)
        
        AxiosInstance.post('/business/create', data, {
            headers: { 'Authorization': 'Bearer ' + token }
        })
            .then(response => {
                if (response.status === 201) {
                    reset()
                    // alert('request sent')
                    history.push({
                        pathname: '/profile',
                    });
                }
                console.log(response)
            })
            .catch(err => {
                console.log(err)
                if (!err.response) {
                    setServerError(true)
                } else if (err.response.status === 400) {
                    setError(`${err.response.data.type}`, {
                        type: 'server',
                        message: err.response.data.message
                    })
                }
            })
    }


    return (
        <Container>
            <Form onSubmit={handleSubmit(sendRequest)}>
                <Form.Group controlId='business_name'>
                    <Form.Label>Business Name</Form.Label>
                    <Form.Control {...register('business_name')} autoFocus type='text' name='business_name' required />
                    <p className='errormessage'>{errors.business_name?.message}</p>
                </Form.Group>

                <Form.Group controlId='email'>
                    <Form.Label>Business Email</Form.Label>
                    <Form.Control {...register('email')} type='text' name='email' required />
                    <p className='errormessage'>{errors.email?.message}</p>
                </Form.Group>

                <Form.Group controlId='business_avatar'>
                    <Form.Label>Business Branding</Form.Label>
                    <Form.Control {...register('business_avatar')} type='text' name='business_avatar' required />
                    <p className='errormessage'>{errors.business_avatar?.message}</p>
                </Form.Group>

                <Form.Group controlId='business_description'>
                    <Form.Label>Business Bio</Form.Label>
                    <Form.Control {...register('business_description')} type='text' name='business_description' required />
                    <p className='errormessage'>{errors.business_description?.message}</p>
                </Form.Group>

                <Form.Group controlId='business_type'>
                    <Form.Label>Business Type</Form.Label>
                    <Form.Select {...register('business_type')} type='text' name='business_type' required>
                        <option value='brand'>Brand</option>
                        <option value='venue'>Dispensary</option>
                        <option value='both'>{`Brand & Dispensary`}</option>
                    </Form.Select>
                    <p className='errormessage'>{errors.business_type?.message}</p>
                </Form.Group>

                {
                    (businessType !== 'brand') && (
                        <Container>
                            <Row>
                                <Col>
                                    <Form.Group controlId='street_address'>
                                        <Form.Label>Street Address</Form.Label>
                                        <Form.Control {...register('street_address')} type='text' name='street_address' required />
                                        <p className='errormessage'>{errors.street_address?.message}</p>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col lg={6}>
                                    <Form.Group controlId='city'>
                                        <Form.Label>City</Form.Label>
                                        <Form.Control {...register('city')} type='text' name='city' required />
                                        <p className='errormessage'>{errors.city?.message}</p>
                                    </Form.Group>
                                </Col>

                                <Col lg={3}>
                                    <Form.Group controlId='state'>
                                        <Form.Label>State</Form.Label>
                                        <Form.Control {...register('state')} type='text' name='state' required />
                                        <p className='errormessage'>{errors.state?.message}</p>
                                    </Form.Group>
                                </Col>

                                <Col lg={3}>
                                    <Form.Group controlId='zip'>
                                        <Form.Label>Zip</Form.Label>
                                        <Form.Control {...register('zip')} type='text' name='zip' required />
                                        <p className='errormessage'>{errors.zip?.message}</p>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Container>
                    )
                }
                
                <Form.Group controlId='instagram'>
                    <Form.Label>Instagram</Form.Label>
                    <Form.Control {...register('instagram')} type='text' name='instagram' />
                    <p className='errormessage'>{errors.instagram?.message}</p>
                </Form.Group>

                <Form.Group controlId='website'>
                    <Form.Label>Website</Form.Label>
                    <Form.Control {...register('website')} type='text' name='website' />
                    <p className='errormessage'>{errors.website?.message}</p>
                </Form.Group>

                {serverError && <p className='errormessage'>network error, please wait a moment and try again</p>}
                <Button type='submit'>Submit</Button>
            </Form>
        </Container>
    )
}

export default withRouter(CreateBusiness);
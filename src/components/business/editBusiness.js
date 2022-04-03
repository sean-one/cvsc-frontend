import React, { useContext } from 'react';
import { useForm, useFormState } from 'react-hook-form';
import { Button, Col, Form, Row } from 'react-bootstrap';

import { update_Business } from '../../helpers/dataCleanUp';
import { SiteContext } from '../../context/site/site.provider';
import AxiosInstance from '../../helpers/axios';

const EditBusiness = (props) => {
    const { business, handleClose } = props;
    const { updateBusiness } = useContext(SiteContext)
    const { register, handleSubmit, clearErrors, control } = useForm({
        defaultValues: {
            business_name: business.name,
            email: business.email,
            business_description: business.description,
            instagram: business.instagram,
            website: business.website
        }
    })

    const { isDirty, dirtyFields, errors } = useFormState({
        control
    })
    
    const sendBusinessUpdate = (data) => {
        const token = localStorage.getItem('token')
        // clean up data prior to sending to server
        data = update_Business(data, dirtyFields)

        AxiosInstance.put(`/business/${business.id}`, data, {
            headers: {'Authorization': 'Bearer ' + token}
        })
            .then(response => {
                if(response.status === 201) {
                    updateBusiness(response.data[0].id, response.data[0])
                    handleClose()
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    return (
        <Form onSubmit={handleSubmit(sendBusinessUpdate)}>
            <Form.Group controlId='business_name'>
                <Form.Label>Business Name</Form.Label>
                <Form.Control
                    className={errors.business_name ? 'inputError' : ''}
                    {...register('business_name')}
                    autoFocus
                    onFocus={() => clearErrors('business_name')}
                    type='text'
                    name='business_name'
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
                />
                <div className='errormessage'>{errors.email?.message}</div>
            </Form.Group>

            {/* <Form.Group controlId='business_avatar'> */}
            {/* <Form.Group>
                <Form.Label>Business Branding</Form.Label>
                <Form.Control
                    className={errors.business_avatar ? 'inputError' : ''}
                    {...register('business_avatar')}
                    onFocus={() => clearErrors('business_avatar')}
                    type='text'
                    name='business_avatar'
                />
                <div className='errormessage'>{errors.business_avatar?.message}</div>
            </Form.Group> */}

            <Form.Group controlId='business_description'>
                <Form.Label>Business Bio</Form.Label>
                <Form.Control
                    className={errors.business_description ? 'inputError' : ''}
                    {...register('business_description')}
                    onFocus={() => clearErrors('business_description')}
                    as='textarea'
                    rows={5}
                    name='business_description'
                />
                <div className='errormessage'>{errors.business_description?.message}</div>
            </Form.Group>

            {/* <Form.Group controlId='business_type'>
                <Form.Label>Business Type</Form.Label>
                <Form.Select
                    className={errors.business_type ? 'inputError' : ''}
                    {...register('business_type')}
                    onFocus={() => clearErrors('business_type')}
                    type='text'
                    name='business_type'
                >
                    <option value='brand'>Brand</option>
                    <option value='venue'>Dispensary</option>
                    <option value='both'>{`Brand & Dispensary`}</option>
                </Form.Select>
                <div className='errormessage'>{errors.business_type?.message}</div>
            </Form.Group> */}

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

            <Row className='d-flex justify-content-around pt-3'>
                <Col xs={2}>
                    <Button type='submit' disabled={!isDirty}>Update</Button>
                </Col>
                <Col xs={2}>
                    <Button onClick={handleClose} variant='secondary'>Close</Button>
                </Col>
            </Row>

        </Form>
    )
}

export default EditBusiness;
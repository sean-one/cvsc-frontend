import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Col, Form, Row } from 'react-bootstrap';

import { update_Business } from '../../helpers/dataCleanUp';
import { SiteContext } from '../../context/site/site.provider';
import { NotificationsContext } from '../../context/notifications/notifications.provider';
import AxiosInstance from '../../helpers/axios';

const EditBusiness = ({ business, handleClose }) => {
    const { updateBusiness } = useContext(SiteContext)
    const { dispatch } = useContext(NotificationsContext)
    const { register, handleSubmit, setError, clearErrors, formState: { isDirty, dirtyFields, errors } } = useForm({
        defaultValues: {
            email: business.email,
            business_description: business.description,
            instagram: business.instagram,
            website: business.website,
        }
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
                    dispatch({
                        type: "ADD_NOTIFICATION",
                        payload: {
                            notification_type: 'SUCCESS',
                            message: `${response.data[0].name} has been updated`

                        }
                    })
                }
            })
            .catch(err => {
                if(!err.response) {
                    dispatch({
                        type: "ADD_NOTIFICATION",
                        payload: {
                            notification_type: 'ERROR',
                            message: 'server error, please wait and try again'
                        }
                    })
                }

                else if (err.response.status === 400) {
                    setError(`${err.response.data.type}`, {
                        type: 'server',
                        message: `${err.response.data.message}`
                    })
                    dispatch({
                        type: "ADD_NOTIFICATION",
                        payload: {
                            notification_type: 'ERROR',
                            message: `${err.response.data.message}`
                        }
                    })
                }

                else {
                    console.log(err)
                }
            })
    }

    return (
        <Form onSubmit={handleSubmit(sendBusinessUpdate)}>

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
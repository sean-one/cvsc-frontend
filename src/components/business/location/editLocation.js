import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Col, Form, Row } from 'react-bootstrap';
import styled from 'styled-components';

import { NotificationsContext } from '../../../context/notifications/notifications.provider';
import { useLocationMutation } from '../../../hooks/useBusinessApi';

const Styles = styled.div`
    .errormessage {
        width: 100%;
        text-align: left;
        padding: 0.25rem;
        color: #DAD7CD;
        /* font-weight: bold; */
    }

    .inputError {
        border: 2px solid red;
    }
`

const EditLocation = ({ modalClose, business_location }) => {
    const { mutateAsync: editBusinessLocation } = useLocationMutation()
    const { dispatch } = useContext(NotificationsContext)
    
    const { register, handleSubmit, setError, clearErrors, formState: { isDirty, errors } } = useForm({
        defaultValues: {
            street_address: business_location.street_address,
            location_city: business_location.location_city,
            location_state: business_location.location_state,
            zip_code: business_location.zip_code,
        }
    })

    const sendLocationUpdate = async (data) => {
        const updated_location = await editBusinessLocation({ ...data, ...business_location.id })

        if(updated_location.status === 200) {
            modalClose()
            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    notification_type: 'SUCCESS',
                    message: `${updated_location.data.venue_name} location updated`
                }
            })
        } else {
            console.log(`error: ${updated_location.status}`)
        }
    }


    return (
        <Styles>
            <Form onSubmit={handleSubmit(sendLocationUpdate)}>

                <Form.Group controlId='street_address'>
                    <Form.Label>Street Address</Form.Label>
                    <Form.Control
                        className={errors.street_address ? 'inputError' : ''}
                        {...register('street_address')}
                        onFocus={() => clearErrors('street_address')}
                        type='text'
                        name='street_address'
                    />
                    <div className='errormessage'>{errors.street_address?.message}</div>
                </Form.Group>

                <Form.Group controlId='location_city'>
                    <Form.Label>City</Form.Label>
                    <Form.Control
                        className={errors.location_city ? 'inputError' : ''}
                        {...register('location_city')}
                        onFocus={() => clearErrors('location_city')}
                        type='text'
                        name='location_city'
                    />
                    <div className='errormessage'>{errors.location_city?.message}</div>
                </Form.Group>

                <Form.Group controlId='location_state'>
                    <Form.Label>State</Form.Label>
                    <Form.Control
                        className={errors.location_state ? 'inputError' : ''}
                        {...register('location_state')}
                        onFocus={() => clearErrors('location_state')}
                        type='text'
                        name='location_state'
                    />
                    <div className='errormessage'>{errors.location_state?.message}</div>
                </Form.Group>

                <Form.Group controlId='zip_code'>
                    <Form.Label>Zip Code</Form.Label>
                    <Form.Control
                        className={errors.zip_code ? 'inputError' : ''}
                        {...register('zip_code')}
                        onFocus={() => clearErrors('zip_code')}
                        type='text'
                        name='zip_code'
                    />
                    <div className='errormessage'>{errors.zip_code?.message}</div>
                </Form.Group>

                <Row className='d-flex justify-content-around pt-3'>
                    <Col xs={2}>
                        <Button type='submit' disabled={!isDirty}>Update</Button>
                    </Col>
                    <Col xs={2}>
                        <Button onClick={modalClose} variant='secondary'>Close</Button>
                    </Col>
                </Row>

            </Form>
        </Styles>
    )
}

export default EditLocation;
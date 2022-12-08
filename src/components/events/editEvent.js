import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { updateEventSchema } from '../../helpers/validationSchemas';
import { format } from 'date-fns';
import { Button, Col, Form, Row } from 'react-bootstrap';

import { reformatTime } from '../../helpers/formatTime';
import { useEditEventMutation, useEventQuery } from '../../hooks/useEvents';
import useNotification from '../../hooks/useNotification';
import BusinessList from '../business/business_list';
import LoadingSpinner from '../loadingSpinner';


const EditEvent = () => {
    // const [ imageFile, setImageFile ] = useState('')
    const { event_id } = useParams()
    const { dispatch } = useNotification();
    
    let navigate = useNavigate()
    const { data: event, isLoading: loadingEvent } = useEventQuery(event_id)
    const { mutateAsync: editEventMutation } = useEditEventMutation()
    
    const { register, handleSubmit, clearErrors, setError, formState:{ isDirty, dirtyFields, errors } } = useForm({
        mode: 'onBlur',
        resolver: yupResolver(updateEventSchema),
        defaultValues: {
            eventname: event.data.eventname,
            eventdate: format(new Date(event.data.eventdate), 'yyyy-MM-dd'),
            eventstart: reformatTime(event.data.eventstart),
            eventend: reformatTime(event.data.eventend),
            eventmedia: '',
            venue_id: event.data.venue_id,
            details: event.data.details,
            brand_id: event.data.brand_id

        }
    });
    
    if(loadingEvent) {
        <LoadingSpinner />
    }

    const sendUpdate = async (data) => {
        try {
            const formData = new FormData()

            // remove entries that are unchanged
            for (const [key] of Object.entries(data)) {
                if (!Object.keys(dirtyFields).includes(key)) {
                    delete data[key]
                }
            }

            Object.keys(data).forEach(key => {
                if (key === 'eventmedia') {
                    formData.set('eventmedia', data['eventmedia'][0])
                } else if (key === 'eventdate') {
                    formData.append(key, format(data[key], 'y-M-d'))
                } else if (key === 'eventstart' || key === 'eventend') {
                    formData.append(key, data[key].replace(':', ''))
                } else {
                    formData.append(key, data[key])
                }
            })        

            const edit_event_response = await editEventMutation({ event_id: event_id, event_updates: formData })
            
            if(edit_event_response.status === 201) {
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'SUCCESS',
                        message: `${edit_event_response.data.eventname} has been updated`
                    }
                })

                navigate(`/event/${event_id}`)
            }

        } catch (error) {
            console.log('inside the send update catch')
            console.log(error)
            if(error.response.status === 401) {
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'ERROR',
                        message: `${error.response.data.error.message}`
                    }
                })

                navigate('/login')
            }

            if(error.response.status === 400) {
                setError(error.response.data.error.type, {
                    type: error.response.data.error.type,
                    message: error.response.data.error.message
                })
            }

        }
    }


    return (
        <Form onSubmit={handleSubmit(sendUpdate)} encType='multipart/form-data'>

            <Form.Group controlId='eventname'>
                <Form.Label>Eventname</Form.Label>
                <Form.Control
                    className={errors.eventname ? 'inputError' : ''}
                    {...register('eventname')}
                    autoFocus
                    onFocus={() => clearErrors('eventname')}
                    type='text'
                    name='eventname'
                    required
                />
                <div className='errormessage'>{errors.eventname?.message}</div>
            </Form.Group>

            <Form.Group controlId='eventdate'>
                <Form.Label>Event Date</Form.Label>
                <Form.Control
                    className={errors.eventdate ? 'inputError' : ''}
                    {...register('eventdate')}
                    onFocus={() => clearErrors('eventdate')}
                    type='date'
                    name='eventdate'
                    required
                />
                <div className='errormessage'>{errors.eventdate?.message}</div>
            </Form.Group>

            <Row>
                <Col>
                    <Form.Group controlId='eventstart'>
                        <Form.Label>Start</Form.Label>
                        <Form.Control
                            className={errors.eventstart ? 'inputError' : ''}
                            {...register('eventstart', { setValueAs: v => parseInt(v.replace(":", "")) })}
                            onFocus={() => clearErrors('eventstart')}
                            type='time'
                            name='eventstart'
                            required
                        />
                        <div className='errormessage'>{errors.eventstart?.message}</div>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId='eventend'>
                        <Form.Label>End</Form.Label>
                        <Form.Control
                            className={errors.eventend ? 'inputError' : ''}
                            {...register('eventend', { setValueAs: v => parseInt(v.replace(":", "")) })}
                            onFocus={() => clearErrors('eventend')}
                            type='time'
                            name='eventend'
                            required
                        />
                        <div className='errormessage'>{errors.eventend?.message}</div>
                    </Form.Group>
                </Col>
            </Row>

            <Form.Group controlId='eventmedia' className='my-3'>
                <Form.Control 
                    {...register('eventmedia')}
                    onFocus={() => clearErrors('eventmedia')}
                    type='file'
                    name='eventmedia'
                    accept='image/*'
                    // onChange={(e) => setImageFile(e.target.files[0])}
                    required
                />
                <div className='errormessage'>{errors.eventmedia?.message}</div>
            </Form.Group>

            <Form.Group controlId='venue_id'>
                <Form.Label>Location</Form.Label>
                <Form.Select
                    className={(errors.venue_id || errors.role_rights) ? 'inputError' : ''}
                    {...register('venue_id')}
                    onFocus={() => clearErrors(['venue_id', 'role_rights'])}
                    type='text'
                    name='venue_id'
                    required
                >
                    {/* <option value=''>Location</option> */}
                    <BusinessList business_type='venue' />
                </Form.Select>
                <div className='errormessage'>{errors.venue_id?.message}</div>
                <div className='errormessage'>{errors.role_rights?.message}</div>
            </Form.Group>

            <Form.Group controlId='details'>
                <Form.Label>Event Details</Form.Label>
                <Form.Control
                    className={errors.details ? 'inputError' : ''}
                    {...register('details')}
                    autoFocus
                    onFocus={() => clearErrors('details')}
                    as='textarea'
                    row={15}
                    name='details'
                    required
                />
                <div className='errormessage'>{errors.details?.message}</div>
            </Form.Group>

            <Form.Group controlId='brand_id'>
                <Form.Label>Brand</Form.Label>
                <Form.Select
                    className={(errors.brand_id || errors.role_rights) ? 'inputError' : ''}
                    {...register('brand_id')}
                    onFocus={() => clearErrors(['brand_id', 'role_rights'])}
                    type='text'
                    name='brand_id'
                    required
                >
                    {/* <option value=''>Brand</option> */}
                    <BusinessList business_type='brand' />
                </Form.Select>
                <div className='errormessage'>{errors.brand_id?.message}</div>
                <div className='errormessage'>{errors.role_rights?.message}</div>
            </Form.Group>

            <Row className='d-flex justify-content-around pt-3'>
                <Col xs={2}>
                    <Button type='submit' disabled={!isDirty}>Update</Button>
                </Col>
                <Col xs={2}>
                    <Button onClick={() => navigate(`/event/${event_id}`)}variant='secondary'>Close</Button>
                </Col>
            </Row>
            <div className='errormessage'>{errors.server?.message}</div>

        </Form>
    )
}

export default EditEvent;
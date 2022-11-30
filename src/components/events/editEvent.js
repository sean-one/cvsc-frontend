import React from 'react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { Button, Col, Form, Row } from 'react-bootstrap';
import styled from 'styled-components';

import { reformatTime } from '../../helpers/formatTime';
import { update_event } from '../../helpers/dataCleanUp';
// import useImagePreviewer from '../../hooks/useImagePreviewer';
import { useEditEventMutation } from '../../hooks/useEvents';
import useNotification from '../../hooks/useNotification';
import useAuth from '../../hooks/useAuth';
import BusinessList from '../business/business_list';

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

const EditEvent = ({ event, handleClose }) => {
    const { auth } = useAuth()
    const { dispatch } = useNotification();
    // const { editImage, imagePreview, canvas } = useImagePreviewer()
    
    const { mutateAsync: editEventMutation } = useEditEventMutation()
    
    const { register, handleSubmit, clearErrors, setError, formState:{ isDirty, dirtyFields, errors } } = useForm({
        defaultValues: {
            eventname: event.eventname,
            eventdate: format(new Date(event.eventdate), 'yyyy-MM-dd'),
            eventstart: reformatTime(event.eventstart),
            eventend: reformatTime(event.eventend),
            venue_id: event.venue_id,
            details: event.details,
            brand_id: event.brand_id

        }
    });
    
    const sendUpdate = async (data) => {
        try {
            const { event_id } = event
            const update_data = await update_event(data, dirtyFields)
            console.log(update_data)
            const edit_event_response = await editEventMutation({ ...update_data, event_id })
            
            if(edit_event_response.status === 201) {
                handleClose()
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'SUCCESS',
                        message: `${edit_event_response.data.eventname} has been updated`
                    }
                })
            }
        } catch (error) {
            console.log(error)
            if(error.response.data.error.type === 'role_validation') {
                setError('brand_id', {
                    type: 'role_validation',
                    message: 'must have valid rights for at least one business'
                })

                setError('venue_id', {
                    type: 'role_validation',
                    message: 'must have valid rights for at least one business'
                })
            }
            console.log('inside the send update')
            console.log(Object.keys(error))
            console.log(error.response)
            
        }
    }


    return (
        <Styles>
            <Form onSubmit={handleSubmit(sendUpdate)}>

                <Form.Group controlId='eventname'>
                    <Form.Label>Eventname</Form.Label>
                    <Form.Control
                        className={errors.eventname ? 'inputError' : ''}
                        {...register('eventname')}
                        autoFocus
                        onFocus={() => clearErrors('eventname')}
                        type='text'
                        name='eventname'
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
                            />
                            <div className='errormessage'>{errors.eventend?.message}</div>
                        </Form.Group>
                    </Col>
                </Row>

                {/* {
                    editImage &&
                    <Row className='mx-auto'>
                        <canvas
                            id={'eventImagePreview'}
                            ref={canvas}
                            width={384}
                            height={480}
                        />
                    </Row>
                }

                <Form.Group controlId='eventmedia'>
                    <Form.Label>Image Link</Form.Label>
                    <Form.Control
                        className={errors.eventmedia ? 'inputError' : ''}
                        {...register('eventmedia')}
                        onFocus={() => clearErrors('eventmedia')}
                        type='file'
                        name='eventmedia'
                        accept='image/*'
                        onChange={imagePreview}
                    />
                    <div className='errormessage'>{errors.eventmedia?.message}</div>
                </Form.Group> */}

                {
                    (event.created_by === auth?.user?.id) && (
                        <Form.Group controlId='venue_id'>
                            <Form.Label>Location</Form.Label>
                            <Form.Select
                                className={(errors.venue_id || errors.role_rights) ? 'inputError' : ''}
                                {...register('venue_id')}
                                onFocus={() => clearErrors(['venue_id', 'role_rights'])}
                                type='text'
                                name='venue_id'
                            >
                                <option value=''>Location</option>
                                <BusinessList business_type='venue' />
                            </Form.Select>
                            <div className='errormessage'>{errors.venue_id?.message}</div>
                            <div className='errormessage'>{errors.role_rights?.message}</div>
                        </Form.Group>
                    )
                }

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
                    />
                    <div className='errormessage'>{errors.details?.message}</div>
                </Form.Group>

                {
                    (event.created_by === auth?.user?.id) && (
                        <Form.Group controlId='brand_id'>
                            <Form.Label>Brand</Form.Label>
                            <Form.Select
                                className={(errors.brand_id || errors.role_rights) ? 'inputError' : ''}
                                {...register('brand_id')}
                                onFocus={() => clearErrors(['brand_id', 'role_rights'])}
                                type='text'
                                name='brand_id'
                            >
                                <option value=''>Brand</option>
                                <BusinessList business_type='brand' />
                            </Form.Select>
                            <div className='errormessage'>{errors.brand_id?.message}</div>
                            <div className='errormessage'>{errors.role_rights?.message}</div>
                        </Form.Group>
                    )
                }

                <Row className='d-flex justify-content-around pt-3'>
                    <Col xs={2}>
                        <Button type='submit' disabled={!isDirty}>Update</Button>
                    </Col>
                    <Col xs={2}>
                        <Button onClick={handleClose} variant='secondary'>Close</Button>
                    </Col>
                </Row>

            </Form>
        </Styles>
    )
}

export default EditEvent;
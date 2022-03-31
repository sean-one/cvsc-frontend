import React, { useState, useContext } from 'react';
// import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { Button, Col, Form, Row } from 'react-bootstrap';

import { reformatTime } from '../../helpers/formatTime';
import AxiosInstance from '../../helpers/axios';
import useImagePreviewer from '../../hooks/useImagePreviewer';
import useBusinessFilter from '../../hooks/useBusinessFilter';
// import { SiteContext } from '../../context/site/site.provider';

const EditEvent = (props) => {
    const { event, handleClose } = props;

    const { venue_list, brand_list } = useBusinessFilter()
    const { editImage, imagePreview, canvas } = useImagePreviewer()
    
    const { register, handleSubmit, clearErrors, formState:{ errors } } = useForm();
    const [ eventname, setEventname ] = useState(event.eventname);
    const [ eventdate, setEventdate ] = useState(format(new Date(event.eventdate), 'yyyy-MM-dd'));
    const [ eventstart, setEventstart ] = useState(reformatTime(event.eventstart));
    const [ eventend, setEventend ] = useState(reformatTime(event.eventend));
    const [ eventmedia, setEventmedia ] = useState(event.eventmedia);
    const [ venue, setVenue ] = useState(event.venue_id);
    const [ eventdetails, setEventDetails ] = useState(event.details);
    const [ brands, setBrands ] = useState(event.brand_id);
    
    let history = useHistory();

    const sendEvent = (event) => {
        const token = localStorage.getItem('token')
        // if this is not edited a string is returned
        if (isNaN(event.brand_id)) {
            event['brand_id'] = currentEvent.brand_id
        }
        // if this is not edited a string is returned
        if (isNaN(event.venue_id)) {
            event['venue_id'] = currentEvent.venue_id
        }
        AxiosInstance.put(`/events/${currentEvent.event_id}`, event, {
            headers: {'Authorization': 'Bearer ' + token}
        })
            .then(response => {
                const updatedEvent = response.data
                if (response.status === 201) {
                    updateEvent(updatedEvent.event_id, updatedEvent)
                    history.push({
                        pathname: `/calendar/${currentEvent.event_id}`,
                        state: {
                            event: currentEvent
                        }
                    });
                } else {
                    console.log(response)
                    // throw new Error();
                }
            })
            .catch(err => {
                if (!err.response) {
                    console.log('network error')
                } else if (err.response.status === 400) {
                    localStorage.clear()
                    history.push('/login');
                } else if (err.response.status === 403) {
                    // setAdminRoleError(true);
                    console.log('403');
                }
            })
    }

    return (
        <Form>

            <Form.Group controlId='eventname'>
                <Form.Label>Eventname</Form.Label>
                <Form.Control
                    className={errors.eventname ? 'inputError' : ''}
                    {...register('eventname')}
                    autoFocus
                    onFocus={() => clearErrors('eventname')}
                    type='text'
                    name='eventname'
                    value={eventname}
                    onChange={(e) => setEventname(e)}
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
                    value={eventdate}
                    onChange={(e) => setEventdate(e)}
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
                            value={eventstart}
                            onChange={(e) => setEventstart(e)}
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
                            value={eventend}
                            onChange={(e) => setEventend(e)}
                        />
                        <div className='errormessage'>{errors.eventend?.message}</div>
                    </Form.Group>
                </Col>
            </Row>

            {
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
            </Form.Group>

            <Form.Group controlId='venue_id'>
                <Form.Label>Location</Form.Label>
                <Form.Select
                    className={(errors.venue_id || errors.role_rights) ? 'inputError' : ''}
                    {...register('venue_id', { valueAsNumber: true })}
                    onFocus={() => clearErrors(['venue_id', 'role_rights'])}
                    type='text'
                    name='venue_id'
                    value={venue}
                    onChange={(e) => setVenue(e)}
                >
                    <option value='0'>Select...</option>
                    {
                        venue_list.map(venue => (
                            <option key={venue.id} value={venue.id}>{venue.name}</option>
                        ))
                    }

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
                    value={eventdetails}
                    onChange={(e) => setEventDetails(e)}
                />
                <div className='errormessage'>{errors.details?.message}</div>
            </Form.Group>

            <Form.Group controlId='brand_id'>
                <Form.Label>Brand</Form.Label>
                <Form.Select
                    className={(errors.brand_id || errors.role_rights) ? 'inputError' : ''}
                    {...register('brand_id', { valueAsNumber: true })}
                    onFocus={() => clearErrors(['brand_id', 'role_rights'])}
                    type='text'
                    name='brand_id'
                    value={brands}
                    onChange={(e) => setBrands(e)}
                >
                    <option value='0'>Select...</option>
                    {
                        brand_list.map(brand => (
                            <option key={brand.id} value={brand.id}>{brand.name}</option>
                        ))
                    }

                </Form.Select>
                <div className='errormessage'>{errors.brand_id?.message}</div>
                <div className='errormessage'>{errors.role_rights?.message}</div>
            </Form.Group>

            <Row className='d-flex justify-content-around pt-3'>
                <Col xs={2}>
                    <Button type='submit'>Update</Button>
                </Col>
                <Col xs={2}>
                    <Button onClick={handleClose} variant='secondary'>Close</Button>
                </Col>
            </Row>

        </Form>
    )
}

export default EditEvent;
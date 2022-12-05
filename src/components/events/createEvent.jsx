import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { createEventSchema } from '../../helpers/validationSchemas';
import { Button, Form } from 'react-bootstrap';
import { DevTool } from '@hookform/devtools'

import { useAddEventMutation } from '../../hooks/useEvents';
import useNotification from '../../hooks/useNotification';
import BusinessList from '../business/business_list';

const CreateEvent = () => {
    const [ imageFile, setImageFile ] = useState('')
    const { mutateAsync: addEventMutation } = useAddEventMutation()
    const { dispatch } = useNotification();

    const { register, handleSubmit, control, setError, clearErrors, formState:{ errors } } = useForm({
        mode: 'onBlur',
        resolver: yupResolver(createEventSchema),
    });
    
    let navigate = useNavigate();

    const createNewEvent = async (data) => {
        try {
            const formData = new FormData()
            
            Object.keys(data).forEach(key => {
                if(key === 'eventmedia') {
                    formData.set(key, imageFile)
                } else if(key === 'eventdate') {
                    formData.append(key, format(data[key], 'y-M-d'))
                } else if(key === 'eventstart' || key === 'eventend') {
                    formData.append(key, data[key].replace(':', ''))
                } else {
                    formData.append(key, data[key])
                }
            })
            
            const add_event_response = await addEventMutation(formData)

            if(add_event_response.status === 201) {
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'SUCCESS',
                        message: `${add_event_response.data.eventname} has been created`
                    }
                })

                navigate(`/event/${add_event_response.data.event_id}`)
            }
        } catch (error) {
            console.log(error)
            if(error?.response.status === 401) {
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'ERROR',
                        message: `${error.response.data.error.message}`
                    }
                })

                navigate('/login')
            }

            if(error?.response.status === 400) {
                setError(`${error.response.data.error.type}`, {
                    type: 'server',
                    message: error.response.data.error.message
                })
            }
        }
    }

    return (
        <Form onSubmit={handleSubmit(createNewEvent)} encType='multipart/form-data' className='gy-3'>

            {/* eventname input */}
            <Form.Group controlId='eventname' className='my-3'>
                <Form.Control
                    className={errors.eventname ? 'inputError' : ''}
                    {...register('eventname')}
                    autoFocus
                    onFocus={() => clearErrors('eventname')}
                    type='text'
                    name='eventname'
                    placeholder='Eventname'
                />
                <div className='errormessage'>{errors.eventname?.message}</div>
            </Form.Group>

            {/* eventdate input */}
            <Form.Group controlId='eventdate' className='my-3'>
                <Form.Control
                    {...register('eventdate')}
                    onFocus={() => clearErrors('eventdate')}
                    type='date'
                    name='eventdate'
                />
                <div className='errormessage'>{errors.eventdate?.message}</div>
            </Form.Group>
                
            <div className='d-flex justify-content-between'>
                {/* eventstart input */}
                <Form.Group controlId='eventstart' className='my-3'>
                    <Form.Control
                        {...register('eventstart')}
                        onFocus={() => clearErrors('eventstart')}
                        type='time'
                        name='eventstart'
                    />
                    <div className='errormessage'>{errors.eventstart?.message}</div>
                    {/* <div className='errormessage'>{errors.time_format?.message}</div> */}
                </Form.Group>
                
                {/* eventend input */}
                <Form.Group controlId='eventend' className='my-3'>
                    <Form.Control
                        {...register('eventend')}
                        onFocus={() => clearErrors('eventend')}
                        type='time'
                        name='eventend'
                    />
                    <div className='errormessage'>{errors.eventend?.message}</div>
                </Form.Group>
            </div>
            <div className='errormessage'>{errors.time_format?.message}</div>

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
            } */}
            
            {/* event image input */}
            <Form.Group controlId='eventmedia' className='my-3'>
                <Form.Control
                    {...register('eventmedia')}
                    onFocus={() => clearErrors('eventmedia')}
                    type='file'
                    name='eventmedia'
                    accept='image/*'
                    onChange={(e) => setImageFile(e.target.files[0])}
                    required
                />
                <div className='errormessage'>{errors.eventmedia?.message}</div>
            </Form.Group>
            
            {/* business location selector */}
            <Form.Group controlId='venue_id' className='my-3'>
                <Form.Select
                    {...register('venue_id')}
                    onFocus={() => clearErrors([ 'venue_id', 'role_rights' ])}
                    type='text'
                    name='venue_id'
                >
                    <option value=''>Location</option>
                    <BusinessList business_type='venue' />
                </Form.Select>
                <div className='errormessage'>{errors.venue_id?.message}</div>
                <div className='errormessage'>{errors.role_rights?.message}</div>
            </Form.Group>

            {/* event details input */}
            <Form.Group controlId='details' className='my-3'>
                <Form.Control
                    {...register('details')}
                    onFocus={() => clearErrors('details')}
                    as='textarea'
                    row={10}
                    name='details'
                    placeholder='event details...'
                />
                <div className='errormessage'>{errors.details?.message}</div>
            </Form.Group>

            {/* business brand selector */}
            <Form.Group controlId='brand_id' className='my-3'>
                <Form.Select
                    {...register('brand_id')}
                    onFocus={() => clearErrors([ 'brand_id', 'role_rights' ])}
                    type='text'
                    name='brand_id'
                >
                    <option value=''>Brand</option>
                    <BusinessList business_type='brand' />
                </Form.Select>
                <div className='errormessage'>{errors.brand_id?.message}</div>
                <div className='errormessage'>{errors.role_rights?.message}</div>
            </Form.Group>

            <Button type='submit'>Submit</Button>
            
            <DevTool control={control} />
        </Form>
    )
}

export default CreateEvent;
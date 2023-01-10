import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, FloatingLabel, Form } from 'react-bootstrap';
import { DevTool } from '@hookform/devtools'

import useAuth from '../../../hooks/useAuth';
import { createEventSchema } from '../../../helpers/validationSchemas';
import { useCreateEventMutation } from '../../../hooks/useEventsApi';
import { useBusinessesQuery } from '../../../hooks/useBusinessApi';
import useNotification from '../../../hooks/useNotification';
import LoadingSpinner from '../../loadingSpinner';
import useImagePreviewer from '../../../hooks/useImagePreviewer';

const EventCreateForm = () => {
    const { logout_user } = useAuth()
    const { editImage, imagePreview, canvas } = useImagePreviewer()
    const { mutateAsync: createEvent } = useCreateEventMutation()
    const { dispatch } = useNotification();
    let venue_list, brand_list = []

    const { data: business_list, isLoading, isSuccess } = useBusinessesQuery()

    const { register, handleSubmit, control, setError, clearErrors, formState: { errors } } = useForm({
        mode: 'onBlur',
        resolver: yupResolver(createEventSchema),
        defaultValues: {
            eventname: '',
            eventdate: '',
            eventstart: '',
            eventend: '',
            eventmedia: '',
            venue_id: '',
            details: '',
            brand_id: '',
        }
    });

    let navigate = useNavigate();

    const createNewEvent = async (data) => {
        try {
            const formData = new FormData()

            Object.keys(data).forEach(key => {
                if (key === 'eventmedia') {
                    formData.set(key, data[key][0])
                } else if (key === 'eventdate') {
                    formData.append(key, format(data[key], 'y-M-d'))
                } else if (key === 'eventstart' || key === 'eventend') {
                    formData.append(key, data[key].replace(':', ''))
                } else {
                    formData.append(key, data[key])
                }
            })

            const add_event_response = await createEvent(formData)

            if (add_event_response.status === 201) {
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
            if (error?.response.status === 401) {
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'ERROR',
                        message: `${error.response.data.error.message}`
                    }
                })

                logout_user()
                // navigate('/login')
            }

            if (error?.response.status === 400) {
                setError(`${error.response.data.error.type}`, {
                    type: 'server',
                    message: error.response.data.error.message
                })
            }
        }
    }

    if(isLoading) {
        return <LoadingSpinner />
    }

    if(isSuccess) {
        venue_list = business_list.data.filter(business => business.business_type !== 'brand' && business.active_business)
        brand_list = business_list.data.filter(business => business.business_type !== 'venue' && business.active_business)
    }


    return (
        <Form onSubmit={handleSubmit(createNewEvent)} encType='multipart/form-data'>

            {/* eventname input */}
            <Form.Group controlId='eventname' className='mb-2'>
                <FloatingLabel controlId='eventname' label='Event Name'>
                    <Form.Control
                        className={errors.eventname ? 'inputError' : ''}
                        {...register('eventname')}
                        autoFocus
                        onFocus={() => clearErrors('eventname')}
                        type='text'
                        name='eventname'
                    />
                </FloatingLabel>
                <div className='errormessage'>{errors.eventname?.message}</div>
            </Form.Group>

            {/* eventdate input */}
            <Form.Group controlId='eventdate' className='mb-2'>
                <FloatingLabel controlId='eventdate' label='Date'>
                    <Form.Control
                        className={errors.eventdate ? 'inputError' : ''}
                        {...register('eventdate')}
                        onFocus={() => clearErrors('eventdate')}
                        type='date'
                        name='eventdate'
                    />
                </FloatingLabel>
                <div className='errormessage'>{errors.eventdate?.message}</div>
            </Form.Group>

            {/* start & end */}
            <div className='d-flex justify-content-between mb-2'>
                {/* eventstart input */}
                <Form.Group controlId='eventstart' className='w-100'>
                    <FloatingLabel controlId='eventstart' label='Start'>
                        <Form.Control
                            className={errors.eventstart ? 'inputError' : ''}
                            {...register('eventstart')}
                            onFocus={() => clearErrors('eventstart')}
                            type='time'
                            name='eventstart'
                        />
                    </FloatingLabel>
                    <div className='errormessage'>{errors.eventstart?.message}</div>
                    {/* <div className='errormessage'>{errors.time_format?.message}</div> */}
                </Form.Group>

                {/* eventend input */}
                <Form.Group controlId='eventend' className='w-100'>
                    <FloatingLabel controlId='eventend' label='End'>
                        <Form.Control
                            className={errors.eventend ? 'inputError' : ''}
                            {...register('eventend')}
                            onFocus={() => clearErrors('eventend')}
                            type='time'
                            name='eventend'
                        />
                    </FloatingLabel>
                    <div className='errormessage'>{errors.eventend?.message}</div>
                </Form.Group>
            </div>
            <div className='errormessage'>{errors.time_format?.message}</div>

            {
                editImage &&
                    <div className='mx-1'>
                        <canvas
                            id={'eventImagePreview'}
                            ref={canvas}
                            width={384}
                            height={480}
                        />
                    </div>
            }

            {/* event image input */}
            <Form.Group controlId='eventmedia' className='mb-2'>
                <Form.Control
                    className={errors.eventmedia ? 'inputError' : ''}
                    {...register('eventmedia')}
                    onFocus={() => clearErrors('eventmedia')}
                    type='file'
                    name='eventmedia'
                    accept='image/*'
                    size='lg'
                    onChange={imagePreview}
                    // onChange={(e) => setImageFile(e.target.files[0])}
                />
                <div className='errormessage'>{errors.eventmedia?.message}</div>
            </Form.Group>

            {/* business location selector */}
            <Form.Group controlId='venue_id' className='mb-2'>
                <FloatingLabel controlId='venue_id' label='Location'>
                    <Form.Select
                        className={errors.venue_id || errors.role_rights ? 'inputError' : ''}
                        {...register('venue_id')}
                        onFocus={() => clearErrors(['venue_id', 'role_rights'])}
                        type='text'
                        name='venue_id'
                    >
                        <option value=''>Location</option>
                        {
                            venue_list.map(business => (
                                <option key={business.id} value={business.id}>{business.business_name}</option>
                            ))
                        }
                    </Form.Select>
                </FloatingLabel>
                <div className='errormessage'>{errors.venue_id?.message}</div>
                <div className='errormessage'>{errors.role_rights?.message}</div>
            </Form.Group>

            {/* event details input */}
            <Form.Group controlId='details' className='mb-2'>
                <FloatingLabel controlId='details' label='Event Details'>
                    <Form.Control
                        className={errors.details ? 'inputError' : ''}
                        {...register('details')}
                        onFocus={() => clearErrors('details')}
                        as='textarea'
                        name='details'
                        style={{ height: '200px' }}
                    />
                </FloatingLabel>
                <div className='errormessage'>{errors.details?.message}</div>
            </Form.Group>

            {/* business brand selector */}
            <Form.Group controlId='brand_id' className='mb-2'>
                <FloatingLabel controlId='brand_id' label='Brand'>
                    <Form.Select
                        className={errors.brand_id || errors.role_rights ? 'inputError' : ''}
                        {...register('brand_id')}
                        onFocus={() => clearErrors(['brand_id', 'role_rights'])}
                        type='text'
                        name='brand_id'
                    >
                        <option value=''>Brand</option>
                        {
                            brand_list.map(business => (
                                <option key={business.id} value={business.id}>{business.business_name}</option>
                            ))
                        }
                    </Form.Select>
                </FloatingLabel>
                <div className='errormessage'>{errors.brand_id?.message}</div>
                <div className='errormessage'>{errors.role_rights?.message}</div>
            </Form.Group>

            <Button type='submit'>Submit</Button>

            <DevTool control={control} />
        </Form>
    )
}

export default EventCreateForm;
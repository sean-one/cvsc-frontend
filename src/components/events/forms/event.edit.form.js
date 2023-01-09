import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { Button, FloatingLabel, Form } from 'react-bootstrap';
import { yupResolver } from '@hookform/resolvers/yup';

import useImagePreviewer from '../../../hooks/useImagePreviewer';
import { reformatTime } from '../../../helpers/formatTime';
import { useBusinessesQuery } from '../../../hooks/useBusinessApi';
import { useEventQuery } from '../../../hooks/useEvents';
import useNotification from '../../../hooks/useNotification';
import LoadingSpinner from '../../loadingSpinner';
import { updateEventSchema } from '../../../helpers/validationSchemas';


const EventEditForm = () => {
    const { event_id } = useParams()
    const { editImage, imagePreview, canvas } = useImagePreviewer();
    const { dispatch } = useNotification()
    let venue_list, brand_list = []

    let navigate = useNavigate()

    const { data: event, isLoading: eventLoading, isSuccess: eventSuccess } = useEventQuery(event_id)
    const { data: business_list, isLoading: listLoading, isSuccess: listSuccess } = useBusinessesQuery()

    const { register, handleSubmit, setError, clearErrors, formState: { isDirty, dirtyFields, errors } } = useForm({
        mode: 'onBlur',
        resolver: yupResolver(updateEventSchema),
        defaultValues: {
            eventname: event?.data.eventname,
            eventdate: format(new Date(event?.data.eventdate), 'yyyy-MM-dd'),
            eventstart: reformatTime(event?.data.eventstart),
            eventend: reformatTime(event?.data.eventend),
            eventmedia: '',
            venue_id: event?.data.venue_id,
            details: event?.data.details,
            brand_id: event?.data.brand_id,
        }
    })

    const update_event = async (data) => {
        console.log('click')
    }

    if(eventLoading || listLoading) {
        return <LoadingSpinner />
    }

    if(eventSuccess || listSuccess) {
        venue_list = business_list.data.filter(business => business.business_type !== 'brand' && business.active_business)
        brand_list = business_list.data.filter(business => business.business_type !== 'venue' && business.active_business)
    }

    return (
        <>
            <h1>{event?.eventname}</h1>
            <Form onSubmit={handleSubmit(update_event)} encType='multipart/form-data'>
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
                
                <div className='d-flex justify-content-between pt-3'>
                    <Button type='submit' disabled={!isDirty}>Update</Button>
                    <Button onClick={() => navigate(`/event/${event_id}`)} variant='secondary'>Close</Button>
                </div>
            </Form>
        </>
    )
}

export default EventEditForm;
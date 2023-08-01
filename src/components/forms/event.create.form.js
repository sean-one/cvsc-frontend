import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';

import useAuth from '../../hooks/useAuth';
import useEventImagePreview from '../../hooks/useEventImagePreview';
import { setImageForForm } from '../../helpers/setImageForForm';
import { useCreateEventMutation } from '../../hooks/useEventsApi';
import { useBusinessesQuery } from '../../hooks/useBusinessApi';
import useNotification from '../../hooks/useNotification';
import LoadingSpinner from '../loadingSpinner';
import { AddImageIcon } from '../icons/siteIcons';

const CreateEventFormStyles = styled.div`
`;


const EventCreateForm = ({ business_id }) => {
    const { logout_user } = useAuth()
    const { editImage, imagePreview, canvas, setEditImage } = useEventImagePreview()
    const { mutateAsync: createEvent } = useCreateEventMutation()
    const { dispatch } = useNotification();
    let venue_list, brand_list = []
    let navigate = useNavigate();
    let location = useLocation()

    const { data: business_list, isLoading, isSuccess } = useBusinessesQuery()

    const { register, handleSubmit, setError, clearErrors, reset, formState: { errors } } = useForm({
        mode: 'onBlur',
        defaultValues: {
            eventname: '',
            eventdate: '',
            eventstart: '',
            eventend: '',
            eventmedia: '',
            venue_id: location?.state || '',
            details: '',
            brand_id: location?.state || '',
        }
    });

    const createNewEvent = async (data) => {
        try {
            delete data['eventmedia']
            
            const formData = new FormData()

            if(canvas.current === null) {
                throw new Error('missing_image')
            } else {
                let event_image = setImageForForm(canvas)

                formData.set('eventmedia', event_image)
            }

            Object.keys(data).forEach(key => {
                if (key === 'eventdate') {
                    formData.append(key, format(parseISO(data[key]), 'y-M-d'))
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

                setEditImage(false)
                reset()

                navigate(`/event/${add_event_response.data.event_id}`)
            }
        } catch (error) {
            console.log(error)
            if (error?.message === 'missing_image') {
                setError('eventmedia', { message: 'missing required event image' })
                throw Error;
            }

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

    if(isLoading) { return <LoadingSpinner /> }

    if(isSuccess) {
        venue_list = business_list.data.filter(business => business.business_type !== 'brand' && business.active_business)
        brand_list = business_list.data.filter(business => business.business_type !== 'venue' && business.active_business)
    }

    return (
        <CreateEventFormStyles>
            <div>
                <form onSubmit={handleSubmit(createNewEvent)} encType='multipart/form-data' className='standardForm'>
                    
                    {/* EVENT NAME AND MEDIA IMAGE */}
                    <div className='formRowInputIcon'>
                        
                        {/* EVENT NAME */}
                        <div className='inputWrapper'>
                            <input {...register('eventname', {
                                required: 'event name is required',
                                minLength: {
                                    value: 2,
                                    message: 'event name must be at least 2 characters'
                                },
                                maxLength: {
                                    value: 50,
                                    message: 'event name too long'
                                }
                            })} className='formInput' type='text' onClick={() => clearErrors('eventname')} placeholder='Event name' />
                        </div>

                        {/* EVENT MEDIA UPLOAD */}
                        <label htmlFor='eventmedia' className='formInput inputLabel' onClick={() => clearErrors('eventmedia')}>
                            <AddImageIcon />
                            <input {...register('eventmedia')} id='eventmedia' className='inputLabelInput' type='file' accept='image/*' onChange={(e) => imagePreview(e)} />
                        </label>

                    </div>
                    {errors.eventname ? <div className='errormessage'>{errors.eventname?.message}</div> : null}

                    {
                        editImage &&
                                <div className='formImage'>
                                    <canvas id={'eventImagePreview'} ref={canvas} />
                                </div>
                    }

                    {/* EVENT DATE */}
                    <div className='inputWrapper'>
                        <input {...register('eventdate', { required: 'event date is required' })} className='formInput' type='date' onClick={() => clearErrors('eventdate')} />
                        {errors.eventdate ? <div className='errormessage'>{errors.eventdate?.message}</div> : null}
                    </div>

                    {/* EVENT START */}
                    <div className='inputWrapper'>
                        <input {...register('eventstart', { required: 'event start time is required' })} className='formInput' type='time' onClick={() => clearErrors('eventstart')} />
                        {errors.eventstart ? <div className='errormessage'>{errors.eventstart?.message}</div> : null}
                    </div>
                    
                    {/* EVENT END */}
                    <div className='inputWrapper'>
                        <input {...register('eventend', { required: 'event end time is required' })} className='formInput' type='time' onClick={() => clearErrors('eventend')} />
                        {errors.eventend ? <div className='errormessage'>{errors.eventend?.message}</div> : null}
                    </div>
                    <div className='errormessage'>{errors.time_format?.message}</div>
                    
                    {/* VENUE ID / EVENT LOCATION */}
                    <div className='inputWrapper'>
                        <select {...register('venue_id', {
                            required: 'event location / venue is required'
                        })} className='formInput' type='text' defaultValue='venueDefault' onClick={() => clearErrors(['venue_id', 'role_rights'])}>
                            <option value='venueDefault' disabled>Venue / Location</option>
                            {
                                venue_list.map(venue => (
                                    <option key={venue.id} value={venue.id}>{venue.business_name}</option>
                                    ))
                                }
                        </select>
                        {errors.venue_id ? <div className='errormessage'>{errors.venue_id?.message}</div> : null}
                        {errors.role_rights ? <div className='errormessage'>{errors.role_rights?.message}</div> : null}
                    </div>

                    {/* EVENT DETAILS */}
                    <div className='inputWrapper'>
                        <textarea {...register('details', { required: 'event details are required' })} className='formInput' rows='8' onClick={() => clearErrors('details')} placeholder='Event details ...'/>
                        {errors.details ? <div className='errormessage'>{errors.details?.message}</div> : null}
                    </div>

                    {/* EVENT BUSINESS BRANDING */}
                    <div className='inputWrapper'>
                        <select {...register('brand_id', {
                            required: 'branding business is required'
                        })} className='formInput' type='text' defaultValue='brandDefault' onClick={() => clearErrors(['brand_id', 'role_rights'])}>
                            <option value='brandDefault' disabled>Brand</option>
                            {
                                brand_list.map(brand => (
                                    <option key={brand.id} value={brand.id}>{brand.business_name}</option>
                                    ))
                                }
                        </select>
                        {errors.brand_id ? <div className='errormessage'>{errors.brand_id?.message}</div> : null}
                        {errors.role_rights ? <div className='errormessage'>{errors.role_rights?.message}</div> : null}
                    </div>

                    <div className='formButtonWrapper'>
                        <button type='submit'>Create</button>
                        <button onClick={() => navigate(-1)}>Close</button>
                    </div>

                </form>
            </div>
        </CreateEventFormStyles>
    )
}

export default EventCreateForm;
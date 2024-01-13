import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { useForm, Controller } from 'react-hook-form';
import styled from 'styled-components';

import useEventImagePreview from '../../hooks/useEventImagePreview';
import { setImageForForm } from '../../helpers/setImageForForm';
import { useCreateEventMutation } from '../../hooks/useEventsApi';
import { useBusinessesQuery } from '../../hooks/useBusinessApi';
import useNotification from '../../hooks/useNotification';
import LoadingSpinner from '../loadingSpinner';
import { AddImageIcon, DateIcon, TimeIcon } from '../icons/siteIcons';
import { validateEventDate, validateEventTime, validateEventBusiness } from './utils/form.validations';

const CreateEventFormStyles = styled.div`
    .imageError {
        text-align: right;
    }
`;

const EventCreateForm = ({ business_id }) => {
    const { editImage, imagePreview, canvas } = useEventImagePreview()
    const { mutateAsync: createEvent } = useCreateEventMutation()
    const { dispatch } = useNotification();
    let venue_list, brand_list = []
    let navigate = useNavigate();
    let location = useLocation()
    
    const { data: business_list, status: business_list_status } = useBusinessesQuery()

    const { register, control, handleSubmit, setError, setValue, clearErrors, reset, formState: { errors } } = useForm({
        mode: 'onBlur',
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
    
    useEffect(() => {
        // check for saved form in local storage
        const savedFormData = localStorage.getItem('createEventForm');

        // if found set values to values saved in local storage
        if (savedFormData) {
            const parsedData = JSON.parse(savedFormData);
            for (let key in parsedData) {
                setValue(key, parsedData[key]);
            }
        }
    },[setValue])

    if (business_list_status === 'loading') {
        return <LoadingSpinner />
    }

    if (business_list_status === 'success') {
        venue_list = business_list.data.filter(business => business.business_type !== 'brand' && business.active_business)
        brand_list = business_list.data.filter(business => business.business_type !== 'venue' && business.active_business)
        
        const foundVenue = venue_list.find(venue => venue.id === location?.state)
        const foundBrand = brand_list.find(brand => brand.id === location?.state)
        
        if(foundVenue) { setValue('venue_id', foundVenue?.id) }
        if(foundBrand) { setValue('brand_id', foundBrand?.id)}
    }


    const createNewEvent = async (event_data) => {
        localStorage.setItem('createEventForm', JSON.stringify(event_data));
        try {
            delete event_data['eventmedia']

            const formData = new FormData()

            if(canvas.current === null) {
                throw new Error('missing_image')
            } else {
                let event_image = setImageForForm(canvas)

                formData.set('eventmedia', event_image)
            }

            Object.keys(event_data).forEach(key => {
                if (key === 'eventdate') {
                    formData.append(key, format(parseISO(event_data[key]), 'y-M-d'))
                } else if (key === 'eventstart' || key === 'eventend') {
                    formData.append(key, event_data[key].replace(':', ''))
                } else {
                    formData.append(key, event_data[key])
                }
            })

            await createEvent(formData)

            reset()

        } catch (error) {
            // handles error for no canvas object for image upload
            if (error?.message === 'missing_image' || (error?.response?.data?.error?.type === 'media_error')) {
                setError('eventmedia', {
                    message: 'an event image is required'
                })
            }

            // handles events from event.response
            else if (error?.response?.status === 400 || error?.response?.status === 404) {
                if (error?.response?.data?.error?.type === 'server') {
                    dispatch({
                        type: "ADD_NOTIFICATION",
                        payload: {
                            notification_type: 'ERROR',
                            message: error?.response?.data?.error?.message
                        }
                    })
                } else {
                    setError(error?.response?.data?.error?.type, {
                        message: error?.response?.data?.error?.message
                    })
                }
            }
            
            else {
                console.log(`uncaught error: ${Object.keys(error)}`)
            }
        }
    }

    const handleClose = () => {
        // remove create event form save from localhost & go back
        localStorage.removeItem('createEventForm')
        // reset the form
        reset()
        
        navigate('/profile')
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
                                required: 'an event name is required',
                                minLength : {
                                    value: 4,
                                    message: 'an event name must have at least 4 characters'
                                },
                                maxLength: {
                                    value: 49,
                                    message: 'an event name must have less then 50 characters'
                                }
                            })} type='text' onClick={() => clearErrors('eventname')} placeholder='Event name' />
                        </div>

                        {/* EVENT MEDIA UPLOAD */}
                        <label htmlFor='eventmedia' className='inputLabel' onClick={() => clearErrors('eventmedia')}>
                            <AddImageIcon color={errors.eventmedia ? 'var(--error-color)' : 'var(--trim-color'} />
                            <input {...register('eventmedia')} id='eventmedia' className='inputLabelInput' type='file' accept='image/*' onChange={(e) => imagePreview(e)} />
                        </label>

                    </div>
                    {errors.eventname ? <div className='errormessage'>{errors.eventname?.message}</div> : null}
                    {errors.eventmedia ? <div className='errormessage imageError'>{errors.eventmedia?.message}</div> : null}

                    {/* EVENT IMAGE PREVIEW RENDER */}
                    {
                        editImage &&
                                <div className='formImage'>
                                    <canvas id={'eventImagePreview'} ref={canvas} />
                                </div>
                    }

                    {/* EVENT DATE */}
                    <div className='dateTimeInputWrapper'>
                        <label htmlFor='eventdate'><DateIcon /></label>
                        <input {...register('eventdate', {
                            required: 'an event date is required',
                            validate: validateEventDate,
                        })} type='date' onClick={() => clearErrors('eventdate')} />
                    </div>
                    {errors.eventdate ? <div className='errormessage'>{errors.eventdate?.message}</div> : null}

                    {/* EVENT START */}
                    <div className='dateTimeInputWrapper'>
                        <label htmlFor='eventstart'><TimeIcon /></label>
                        <input {...register('eventstart', {
                            required: 'an event starting time is required',
                            validate: validateEventTime,
                        })} type='time' onClick={() => clearErrors('eventstart')} />
                    </div>
                    {errors.eventstart ? <div className='errormessage'>{errors.eventstart?.message}</div> : null}
                    
                    {/* EVENT END */}
                    <div className='dateTimeInputWrapper'>
                        <label htmlFor='eventend'><TimeIcon /></label>
                        <input {...register('eventend', {
                            required: 'an event ending time is required',
                            validate: validateEventTime,
                        })} type='time' onClick={() => clearErrors('eventend')} />
                    </div>
                    {errors.eventend ? <div className='errormessage'>{errors.eventend?.message}</div> : null}
                    
                    {/* VENUE ID / EVENT LOCATION */}
                    <div className='inputWrapper'>
                        <label htmlFor='venue_id' className='visuallyHidden'>Venue:</label>
                        <Controller
                            name='venue_id'
                            control={control}
                            defaultValue=""
                            rules={{ required: 'a business name is required', validate: validateEventBusiness }}
                            render={({ field }) => (
                                <select {...field} onClick={() => clearErrors(['venue_id', 'role_rights'])}>
                                    <option value="" disabled>Select a venue...</option>
                                    {
                                        venue_list.map(venue => (
                                            <option key={venue.id} value={venue.id}>{venue.business_name}</option>
                                        ))
                                    }
                                </select>
                            )}
                        />
                        {errors.venue_id && <div className='errormessage'>{errors.venue_id.message}</div>}
                        {errors.role_rights && <div className='errormessage'>{errors.role_rights.message}</div>}
                    </div>

                    {/* EVENT DETAILS */}
                    <div className='inputWrapper'>
                        <textarea {...register('details', {
                            required: 'event details are required'
                        })} rows='8' onClick={() => clearErrors('details')} placeholder='Event details ...'/>
                        {errors.details ? <div className='errormessage'>{errors.details?.message}</div> : null}
                    </div>

                    {/* EVENT BUSINESS BRANDING */}
                    <div className='inputWrapper'>
                        <label htmlFor='brand_id' className='visuallyHidden'>Brand:</label>
                        <Controller
                            name='brand_id'
                            control={control}
                            defaultValue=""
                            rules={{ required: 'A business name is required', validate: validateEventBusiness }}
                            render={({ field }) => (
                                <select {...field} onClick={() => clearErrors(['brand_id', 'role_rights'])}>
                                    <option value="" disabled>Select a brand...</option>
                                    {
                                        brand_list.map(brand => (
                                            <option key={brand.id} value={brand.id}>{brand.business_name}</option>
                                        ))
                                    }
                                </select>
                            )}
                        />
                        {errors.brand_id ? <div className='errormessage'>{errors.brand_id?.message}</div> : null}
                        {errors.role_rights ? <div className='errormessage'>{errors.role_rights?.message}</div> : null}
                    </div>

                    <div className='formButtonWrapper'>
                        <button type='submit'>Create</button>
                        <button onClick={handleClose}>Close</button>
                    </div>

                </form>
            </div>
        </CreateEventFormStyles>
    )
}

export default EventCreateForm;
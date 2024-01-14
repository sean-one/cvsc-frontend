import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { format, parseISO } from 'date-fns';
import styled from 'styled-components';

import useEventImagePreview from '../../hooks/useEventImagePreview';
import { setImageForForm } from '../../helpers/setImageForForm';
import { reformatTime } from '../../helpers/formatTime';
import { useBusinessesQuery } from '../../hooks/useBusinessApi';
import { useUpdateEventMutation, useRemoveEventMutation } from '../../hooks/useEventsApi';
import useNotification from '../../hooks/useNotification';
import LoadingSpinner from '../loadingSpinner';
import { image_link } from '../../helpers/dataCleanUp';
import { AddImageIcon, DateIcon, TimeIcon } from '../icons/siteIcons';
import AxiosInstance from '../../helpers/axios';
import { validateEventBusiness, validateEventDate, validateEventTime, validateNONEmptyString } from './utils/form.validations';


const EditEventFormStyles = styled.div`
    input {
        &[type=time], &[type=date] {
            appearance: none;

            // For Chrome
            &::-webkit-calendar-picker-indicator {
            display: none;
            }

            // For Firefox (if needed, depending on the browser version and OS)
            &::-moz-calendar-picker-indicator {
            display: none;
            }
        }
    } 
`;

const EventEditForm = () => {
    const [ eventData, setEventData ] = useState(null) 
    let { event_id } = useParams()
    const { editImage, imagePreview, canvas, setEditImage } = useEventImagePreview()
    const { dispatch } = useNotification()

    let venue_list, brand_list = [];

    const { mutateAsync: updateEventMutation } = useUpdateEventMutation()
    const { mutateAsync: removeEventMutation } = useRemoveEventMutation()

    let navigate = useNavigate()

    const { data: business_list, status: business_list_status } = useBusinessesQuery()

    const { register, handleSubmit, setError, clearErrors, reset, setValue, formState: { isDirty, dirtyFields, errors } } = useForm({
        mode: 'onBlur',
    })

    const update_event = async (event_data) => {
        localStorage.setItem('editEventForm', JSON.stringify(event_data))
        try {
            const formData = new FormData()

            // if eventmedia has a file set in formData, for some reason it does not show in dirtyFields
            if(canvas.current !== null) {
                let eventmediaUpload = setImageForForm(canvas)

                formData.set('eventmedia', eventmediaUpload)
            }

            delete event_data['eventmedia']

            // remove entries that are unchanged
            for (const [key] of Object.entries(event_data)) {
                if (!Object.keys(dirtyFields).includes(key)) {
                    delete event_data[key]
                }
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

            await updateEventMutation({ event_id: event_id, event_updates: formData })

        } catch (error) {
            if (error?.response?.status === 400 || error?.response?.status === 404) {
                if (error?.response?.data?.error?.type === 'media_error') {
                    setError('eventmedia', { message: error?.response?.data?.error?.message })
                }

                else if (error?.response?.data?.error?.type === 'server') {
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
                console.log(`uncaught error ${Object.keys(error)}`);
            }
        }
    }

    const sendEventDelete = async () => {
        await removeEventMutation(event_id)
    }

    const handleClose = () => {
        // remove editEventForm if it is there so not to leave it stuck on local storage
        localStorage.removeItem('editEventForm')
        setEditImage(false)
        reset()

        navigate('/profile/events');
    }

    useEffect(() => {
        // function to format the event data
        const formatEventData = (data) => ({
            eventname: data.eventname,
            eventdate: format(new Date(data.eventdate), 'yyyy-MM-dd'),
            eventstart: reformatTime(data.eventstart),
            eventend: reformatTime(data.eventend),
            eventmedia: null,
            venue_id: data.venue_id,
            details: data.details,
            brand_id: data.brand_id,
        })

        // function to get event details and check local storage for changes
        const getEventDetails = async () => {
            try {
                const eventResponse = await AxiosInstance.get(`/events/${event_id}`)
                
                // save event details to state
                setEventData(eventResponse?.data);

                // set default values to the event details from api
                const defaultValues = formatEventData(eventResponse?.data);
                // adding values to default for isDirty bases
                reset(defaultValues)

                // check for saved data in local storage
                const savedFormData = localStorage.getItem('editEventForm');
                if (savedFormData) {
                    const parsedData = JSON.parse(savedFormData);
                    for (let key in parsedData) {
                        setValue(key, parsedData[key], { shouldDirty: true });
                    }
                }

                // set default values to either api call or local storage if available
            } catch (error) {
                if (error?.response) {
                    dispatch({
                        type: "ADD_NOTIFICATION",
                        payload: {
                            notification_type: 'ERROR',
                            message: error?.response?.data?.error?.message
                        }
                    })
        
                    navigate(-1)
                }
                console.log(error)
            }
        }
        getEventDetails()
    }, [event_id, reset, dispatch, navigate, setValue])

    if(business_list_status === 'loading') {
        return <LoadingSpinner />
    }

    if(business_list_status === 'success') {
        if (business_list.data.length <= 0) {
            venue_list = [{ id: eventData.venue_id, business_name: eventData.venue_name }]
            brand_list = [{ id: eventData.brand_id, business_name: eventData.brand_name }]
        } else {
            venue_list = business_list.data.filter(business => business.business_type !== 'brand' && business.active_business)
            brand_list = business_list.data.filter(business => business.business_type !== 'venue' && business.active_business)
        }
    }



    return (
        <EditEventFormStyles>
            <div>
                <form onSubmit={handleSubmit(update_event)} encType='multipart/form-data' className='standardForm'>

                    {/* EVENT NAME AND MEDIA IMAGE */}
                    <div className='formRowInputIcon'>

                        {/* EVENT NAME */}
                        <div className='inputWrapper'>
                            <input {...register('eventname', {
                                minLength: {
                                    value: 4,
                                    message: 'an event name must have at least 4 characters'
                                },
                                maxLength: {
                                    value: 49,
                                    message: 'an event name must have less then 50 characters'
                                }
                            })} type='text' onClick={() => clearErrors('eventname')} />
                        </div>

                        {/* EVENT MEDIA UPDATE */}
                        <label htmlFor='eventmedia' className='inputLabel' onClick={() => clearErrors('eventmedia')}>
                            <AddImageIcon />
                            <input {...register('eventmedia')} id='eventmedia' className='inputLabelInput' type='file' accept='image/*' onChange={(e) => imagePreview(e)} />
                        </label>

                    </div>
                    {errors.eventname ? <div className='errormessage'>{errors.eventname?.message}</div> : null}
                    {errors.eventmedia ? <div className='errormessage imageError'>{errors.eventmedia?.message}</div>: null}

                    {
                        editImage
                            ? <div className='formImage'>
                                <canvas
                                    id={'avatarImagePreview'}
                                    ref={canvas}
                                />
                            </div>
                            : <div className='formImage'>
                                <img
                                    src={image_link(eventData?.eventmedia)}
                                    alt={eventData?.eventname}
                                />
                            </div>
                    }

                    {/* EVENT DATE */}
                    <div className='dateTimeInputWrapper'>
                        <label htmlFor='eventdate'><DateIcon /></label>
                        <input {...register('eventdate', {
                            validate: {
                                checkEmptyString: validateNONEmptyString,
                                validateDateFormat: (value) => validateEventDate(value, false)
                            }
                        })} type='date' onClick={() => clearErrors('eventdate')} />
                    </div>
                    {errors.eventdate ? <div className='errormessage'>{errors.eventdate?.message}</div> : null}

                    {/* EVENT START TIME */}
                    <div className='dateTimeInputWrapper'>
                        <label htmlFor='eventstart'><TimeIcon /></label>
                        <input {...register('eventstart', {
                            validate: {
                                checkEmptyString: validateNONEmptyString,
                                validateTimeFormat: (value) => validateEventTime(value, false)
                            }
                        })} type='time' onClick={() => clearErrors('eventstart')} />
                    </div>
                    {errors.eventstart ? <div className='errormessage'>{errors.eventstart?.message}</div> : null}

                    {/* EVENT END TIME */}
                    <div className='dateTimeInputWrapper'>
                        <label htmlFor='eventend'><TimeIcon /></label>
                        <input {...register('eventend', {
                            validate: {
                                checkEmptyString: validateNONEmptyString,
                                validateTimeFormat: (value) => validateEventTime(value, false)
                            }
                        })} type='time' onClick={() => clearErrors('eventend')} />
                    </div>
                    {errors.eventend ? <div className='errormessage'>{errors.eventend?.message}</div> : null}

                    {/* VENUE ID / EVENT LOCATION */}
                    <div className='inputWrapper'>
                        <select {...register('venue_id', {
                            validate: (value) => validateEventBusiness(value, false)
                        })} onClick={() => clearErrors(['venue_id', 'role_rights'])}>
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
                        <textarea {...register('details')} rows='8' onClick={() => clearErrors('details')} />
                        {errors.details ? <div className='errormessage'>{errors.details?.message}</div> : null}
                    </div>

                    {/* EVENT BUSINESS BRANDING */}
                    <div className='inputWrapper'>
                        <select {...register('brand_id', {
                            validate: (value) => validateEventBusiness(value, false)
                        })} onClick={() => clearErrors(['brand_id', 'role_rights'])}>
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
                        <button type='submit' disabled={(!isDirty || Object.keys(dirtyFields).length === 0) && (canvas.current === null)}>Update</button>
                        <button type='button' onClick={sendEventDelete}>Delete</button>
                        <button type='button' onClick={handleClose}>Close</button>
                    </div>

                </form>
            </div>
        </EditEventFormStyles>
    )
}

export default EventEditForm;
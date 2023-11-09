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
                let event_media = setImageForForm(canvas)

                formData.set('eventmedia', event_media)
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

            const edit_event_response = await updateEventMutation({ event_id: event_id, event_updates: formData })

            if (edit_event_response.status === 201) {
                localStorage.removeItem('editEventForm')
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
            console.log(error)
            if (error?.response?.status === 400 || error?.response?.status === 403 || error?.response?.status === 404) {
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'ERROR',
                        message: error?.response?.data?.error?.message
                    }
                })
                
                setError(error?.response?.data?.error?.type, {
                    message: error?.response?.data?.error?.message
                })
                return null;
            }
        }
    }

    const sendEventDelete = async () => {
        try {
            const delete_event_response = await removeEventMutation(event_id)

            if (delete_event_response?.status === 200) {
                // remove editEventForm just incase it is saved to local storage
                localStorage.removeItem('editEventForm')
                
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'SUCCESS',
                        message: `${delete_event_response?.data?.eventname} has been deleted`
                    }
                })

                navigate('/profile/events')
            }

        } catch (error) {
            console.log(error)
        }
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
                console.log(eventResponse.data)
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
                                    message: 'event name must be at least 4 characters'
                                },
                                maxLength: {
                                    value: 49,
                                    message: 'event name is too long'
                                }
                            })} type='text' onClick={() => clearErrors('eventname')} />
                        </div>

                        {/* EVENT MEDIA UPDATE */}
                        <label htmlFor='eventmedia' className='inputLabel' onClick={() => clearErrors('eventmedia')}>
                            <AddImageIcon />
                            <input {...register('eventmedia')} id='eventmedia' className='inputLabelInput' type='file' accept='image/*' onChange={(e) => imagePreview(e)} />
                        </label>

                    </div>

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
                        <input {...register('eventdate')} type='date' onClick={() => clearErrors('eventdate')} />
                        {errors.eventdate ? <div className='errormessage'>{errors.eventdate?.message}</div> : null}
                    </div>

                    {/* EVENT START TIME */}
                    <div className='dateTimeInputWrapper'>
                        <label htmlFor='eventstart'><TimeIcon /></label>
                        <input {...register('eventstart')} type='time' onClick={() => clearErrors('eventstart')} />
                        {errors.eventstart ? <div className='errormessage'>{errors.eventstart?.message}</div> : null}
                    </div>

                    {/* EVENT END TIME */}
                    <div className='dateTimeInputWrapper'>
                        <label htmlFor='eventend'><TimeIcon /></label>
                        <input {...register('eventend')} type='time' onClick={() => clearErrors('eventend')} />
                        {errors.eventend ? <div className='errormessage'>{errors.eventend?.message}</div> : null}
                    </div>

                    {/* VENUE ID / EVENT LOCATION */}
                    <div className='inputWrapper'>
                        <select {...register('venue_id')} onClick={() => clearErrors(['venue_id', 'role_rights'])}>
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
                        <select {...register('brand_id')} onClick={() => clearErrors(['brand_id', 'role_rights'])}>
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
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
    const { state: event } = useLocation()
    const { editImage, imagePreview, canvas, setEditImage } = useEventImagePreview()
    const { dispatch } = useNotification()
    
    let venue_list, brand_list = []

    const { mutateAsync: updateEventMutation } = useUpdateEventMutation()
    const { mutateAsync: removeEventMutation } = useRemoveEventMutation()

    let navigate = useNavigate()

    const { data: business_list, status } = useBusinessesQuery()

    const { register, handleSubmit, setError, clearErrors, reset, formState: { isDirty, dirtyFields, errors } } = useForm({
        mode: 'onBlur',
        defaultValues: {
            eventname: event?.eventname,
            eventdate: format(new Date(event?.eventdate), 'yyyy-MM-dd'),
            eventstart: reformatTime(event?.eventstart),
            eventend: reformatTime(event?.eventend),
            eventmedia: null,
            venue_id: event?.venue_id,
            details: event?.details,
            brand_id: event?.brand_id,
        }
    })

    const update_event = async (data) => {
        try {
            const formData = new FormData()

            // if eventmedia has a file set in formData, for some reason it does not show in dirtyFields
            if(canvas.current !== null) {
                let event_media = setImageForForm(canvas)

                formData.set('eventmedia', event_media)
            }

            delete data['eventmedia']

            // remove entries that are unchanged
            for (const [key] of Object.entries(data)) {
                if (!Object.keys(dirtyFields).includes(key)) {
                    delete data[key]
                }
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

            const edit_event_response = await updateEventMutation({ event_id: event.event_id, event_updates: formData })

            if (edit_event_response.status === 201) {
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'SUCCESS',
                        message: `${edit_event_response.data.eventname} has been updated`
                    }
                })

                navigate(`/event/${event.event_id}`)
            }

        } catch (error) {

            if (error?.response?.status === 401) {
                
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'ERROR',
                        message: `${error?.response?.data?.error?.message}`
                    }
                })
                
                navigate('/login', { state: { from: `/event/${event.event_id}` }})

                return null;
            }

            if (error?.response?.status === 400 || error?.response?.status === 403 || error?.response?.status === 404) {
                setError(error?.response?.data?.type, {
                    message: error.response.data.message
                })
                return null;
            }

        }
    }

    const sendEventDelete = async () => {
        try {
            const delete_event_response = await removeEventMutation(event.event_id)

            console.log('delete event response....')
            console.log(delete_event_response)
            if (delete_event_response?.status === 200) {
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
            // navigate('/login', { state: { from: `/event/${event.event_id}` } })
        }
    }

    const handleClose = () => {
        setEditImage(false)
        reset()

        navigate(-1);
        return null;
    }

    if(status === 'loading') {
        return <LoadingSpinner />
    }

    if(status === 'error') {
        dispatch({
            type: "ADD_NOTIFICATION",
            payload: {
                notification_type: 'ERROR',
                message: 'server error, please try again'
            }
        })

        navigate(-1);
        return null;
    }

    venue_list = business_list.data.filter(business => business.business_type !== 'brand' && business.active_business)
    brand_list = business_list.data.filter(business => business.business_type !== 'venue' && business.active_business)


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
                                    src={image_link(event?.eventmedia)}
                                    alt={event?.eventname}
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
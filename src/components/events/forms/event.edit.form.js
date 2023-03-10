import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { yupResolver } from '@hookform/resolvers/yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faTrash } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';

import useAuth from '../../../hooks/useAuth';
import useImagePreview from '../../../hooks/useImagePreview';
import { reformatTime } from '../../../helpers/formatTime';
import { useBusinessesQuery } from '../../../hooks/useBusinessApi';
import { useUpdateEventMutation, useRemoveEventMutation } from '../../../hooks/useEventsApi';
import useNotification from '../../../hooks/useNotification';
import LoadingSpinner from '../../loadingSpinner';
import { updateEventSchema } from '../../../helpers/validationSchemas';
import { image_link } from '../../../helpers/dataCleanUp';

const Styles = styled.div`
    .eventImage {
        width: 100%;
        max-width: 350px;
        margin: 1rem auto;
        
        @media (min-width: 500px) {
            width: 100%;
        }

        canvas {
            max-width: 100%;
            border: 1px solid #dcdbc4;
            display: block;
            box-shadow: 5px 5px 5px #010a00;
        }

        img {
            width: 100%;
            border: 1px solid #dcdbc4;
            display: block;
            box-shadow: 5px 5px 5px #010a00;
        }
    }

    .buttonWrapper {
        display: flex;
        justify-content: space-around;
        padding-top: 0.75rem;
    }
`;

const EventEditForm = () => {
    const { logout_user } = useAuth()
    const { state: event } = useLocation()
    const { editImage, imagePreview, canvas, setEditImage } = useImagePreview()
    const { dispatch } = useNotification()
    
    let venue_list, brand_list = []

    const { mutateAsync: updateEventMutation } = useUpdateEventMutation()
    const { mutateAsync: removeEventMutation } = useRemoveEventMutation()

    let navigate = useNavigate()

    const { data: business_list, isLoading, isSuccess } = useBusinessesQuery()

    const { register, handleSubmit, setError, clearErrors, watch, reset, formState: { isDirty, dirtyFields, errors } } = useForm({
        mode: 'onBlur',
        resolver: yupResolver(updateEventSchema),
        defaultValues: {
            eventname: event?.eventname,
            eventdate: format(new Date(event?.eventdate), 'yyyy-MM-dd'),
            eventstart: reformatTime(event?.eventstart),
            eventend: reformatTime(event?.eventend),
            eventmedia: '',
            venue_id: event?.venue_id,
            details: event?.details,
            brand_id: event?.brand_id,
        }
    })

    const image_attached = watch('image_attached', false)

    const update_event = async (data) => {
        try {
            const formData = new FormData()

            // if eventmedia has a file set in formData, for some reason it does not show in dirtyFields
            if(data?.eventmedia[0]) {
                formData.set('eventmedia', data['eventmedia'][0])
            }

            delete data['image_attached']

            // remove entries that are unchanged
            for (const [key] of Object.entries(data)) {
                if (!Object.keys(dirtyFields).includes(key)) {
                    delete data[key]
                }
            }

            Object.keys(data).forEach(key => {
                if (key === 'eventdate') {
                    formData.append(key, format(data[key], 'y-M-d'))
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
            console.log('inside the send update catch')
            console.log(error)
            if (error.response.status === 401) {
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

            if (error.response.status === 400) {
                setError(error.response.data.error.type, {
                    type: error.response.data.error.type,
                    message: error.response.data.error.message
                })
            }

        }
    }

    const delete_event = async () => {
        try {
            const delete_event_response = await removeEventMutation(event.event_id)

            if (delete_event_response.status === 204) {
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'SUCCESS',
                        message: `event has been deleted`
                    }
                })

                navigate('/profile')
            }

        } catch (error) {
            console.log('error in the deleteEvent')
            if (error.response.status === 401) {
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'ERROR',
                        message: error.response.data.error.message
                    }
                })

                logout_user()
            }
        }
    }

    const close_edit_event = () => {
        setEditImage(false)
        reset()

        navigate(`/event/${event?.event_id}`)
    }

    if(isLoading) { return <LoadingSpinner /> }

    if(isSuccess) {
        venue_list = business_list.data.filter(business => business.business_type !== 'brand' && business.active_business)
        brand_list = business_list.data.filter(business => business.business_type !== 'venue' && business.active_business)
    }


    return (
        <Styles>
            <div className='d-flex justify-content-between align-items-center'>
                <h1>{event?.eventname}</h1>
                <FontAwesomeIcon className='mx-1' icon={faTrash} onClick={() => delete_event()} />
            </div>
            
            <form onSubmit={handleSubmit(update_event)} encType='multipart/form-data'>
                
                {/* eventname input */}
                <input
                    className={errors.eventname ? 'inputError' : ''}
                    {...register('eventname')}
                    autoFocus
                    onFocus={() => clearErrors('eventname')}
                    type='text'
                    name='eventname'
                />
                <div className='errormessage'>{errors.eventname?.message}</div>

                {/* image preview */}
                <div className='eventImage'>
                    {
                        editImage
                            ? <canvas
                                id={'avatarImagePreview'}
                                ref={canvas}
                            />
                            : <img
                                src={image_link(event?.eventmedia)}
                                alt={event?.eventname}
                            />
                    }
                </div>

                <label for='image_attached' className='updateCheckbox'>
                    <input
                        {...register('image_attached')}
                        type='checkbox'
                        name='image_attached'
                    />
                    Update Image
                </label>

                {/* event image input */}
                {
                    (image_attached) &&
                        <label for='eventmedia' className='imageUpdateInput'>
                            Select Image
                            <FontAwesomeIcon icon={faCamera} className='cameraIcon' />
                            <input
                                {...register('eventmedia')}
                                className={errors.eventmedia ? 'inputError' : ''}
                                onFocus={() => clearErrors('eventmedia')}
                                type='file'
                                id='eventmedia'
                                name='eventmedia'
                                accept='image/*'
                                onChange={(e) => imagePreview(e)}
                            />
                        </label>
                }
                <div className='errormessage'>{errors.eventmedia?.message}</div>

                {/* eventdate input */}
                <input
                    className={errors.eventdate ? 'inputError' : ''}
                    {...register('eventdate')}
                    onFocus={() => clearErrors('eventdate')}
                    type='date'
                    name='eventdate'
                />
                <div className='errormessage'>{errors.eventdate?.message}</div>

                {/* start & end */}
                <div className='d-flex justify-content-between mb-2'>
                    {/* eventstart input */}
                    <div className='inputErrorWrapper'>
                        <input
                            className={errors.eventstart ? 'inputError' : ''}
                            {...register('eventstart')}
                            onFocus={() => clearErrors('eventstart')}
                            type='time'
                            name='eventstart'
                            />
                        <div className='errormessage'>{errors.eventstart?.message}</div>
                    </div>
                    {/* <div className='errormessage'>{errors.time_format?.message}</div> */}

                    {/* eventend input */}
                    <div className='inputErrorWrapper'>
                        <input
                            className={errors.eventend ? 'inputError' : ''}
                            {...register('eventend')}
                            onFocus={() => clearErrors('eventend')}
                            type='time'
                            name='eventend'
                        />
                        <div className='errormessage'>{errors.eventend?.message}</div>
                    </div>
                </div>
                <div className='errormessage'>{errors.time_format?.message}</div>

                {/* business location selector */}
                <select
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
                </select>
                <div className='errormessage'>{errors.venue_id?.message}</div>
                <div className='errormessage'>{errors.role_rights?.message}</div>

                {/* event details input */}
                <textarea
                    {...register('details')}
                    className={errors.details ? 'inputError' : ''}
                    onFocus={() => clearErrors('details')}
                    name='details'
                    rows='8'
                />
                <div className='errormessage'>{errors.details?.message}</div>

                {/* business brand selector */}
                <select
                    {...register('brand_id')}
                    className={errors.brand_id || errors.role_rights ? 'inputError' : ''}
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
                </select>
                <div className='errormessage'>{errors.brand_id?.message}</div>
                <div className='errormessage'>{errors.role_rights?.message}</div>
                
                <div className='buttonWrapper d-flex justify-content-between pt-3'>
                    <button type='submit' disabled={!isDirty}>Update</button>
                    <button onClick={() => close_edit_event()} variant='secondary'>Close</button>
                </div>
            </form>
        </Styles>
    )
}

export default EventEditForm;
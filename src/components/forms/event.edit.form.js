import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { yupResolver } from '@hookform/resolvers/yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';

import useAuth from '../../hooks/useAuth';
import useEventImagePreview from '../../hooks/useEventImagePreview';
import { setImageForForm } from '../../helpers/setImageForForm';
import { reformatTime } from '../../helpers/formatTime';
import { useBusinessesQuery } from '../../hooks/useBusinessApi';
import { useUpdateEventMutation, useRemoveEventMutation } from '../../hooks/useEventsApi';
import useNotification from '../../hooks/useNotification';
import LoadingSpinner from '../loadingSpinner';
import { updateEventSchema } from '../../helpers/validationSchemas';
import { image_link } from '../../helpers/dataCleanUp';
import { BusinessSelect, CheckBox, FormInput, ImageInput, TextAreaInput } from './formInput';

const EditEventFormStyles = styled.div`
    .editEventFormWrapper {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .editEventForm {
        width: 100%;
        max-width: var(--max-page-width);
    }

    .editEventFormRow {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
    }

    .dateTimeRow {
        flex-direction: column;

        @media(min-width: 500px) {
            flex-direction: row;
        }
    }

    .editEventFormImage {
        width: 100%;
        max-width: 450px;
        margin: 1rem auto;
        
        @media (min-width: 500px) {
            width: 100%;
        }

        canvas {
            max-width: 100%;
            border: 1px solid var(--image-border-color);
            display: block;
            box-shadow: 5px 5px 5px var(--image-box-shadow-color);
        }

        img {
            width: 100%;
            border: 1px solid var(--image-border-color);
            display: block;
            box-shadow: 5px 5px 5px var(--image-box-shadow-color);
        }
    }

    .eventnameSection {
        flex-grow: 1;
    }

    .imageUploadSection {
        flex-shrink: 0;
    }

    .dateSection {
        width: 100%;
        flex-grow: 1;
    }

    .timeSection {
        width: 100%;
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        column-gap: 10px;
    
        @media(min-width: 500px) {
            width: auto;
            flex-direction: row;
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
    const { editImage, imagePreview, canvas, setEditImage } = useEventImagePreview()
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
            if(image_attached) {
                let event_media = setImageForForm(canvas)

                formData.set('eventmedia', event_media)
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
        <EditEventFormStyles>
            <div className='editEventFormWrapper'>
                <form onSubmit={handleSubmit(update_event)} encType='multipart/form-data' className='editEventForm'>

                    <div className='editEventFormRow'>

                        <div className='eventnameSection'>
                            <FormInput id='eventname'
                                register={register}
                                onfocus={clearErrors}
                                error={errors.eventname}
                            />
                        </div>

                        <div className='imageUploadSection'>
                            <ImageInput id='eventmedia'
                                register={register}
                                onfocus={clearErrors}
                                error={errors.eventmedia}
                                change={imagePreview}
                            />
                        </div>

                    </div>

                    <div className='editEventFormImage'>
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

                    <div className='editEventFormRow dateTimeRow'>
                        <div className='dateSection'>
                            <FormInput id='eventdate'
                                register={register}
                                onfocus={clearErrors}
                                type='date'
                                error={errors.eventdate}
                            />
                        </div>

                        <div className='timeSection'>
                            
                            <div className='eventStart'>
                                <FormInput id='eventstart'
                                    register={register}
                                    onfocus={clearErrors}
                                    type='time'
                                    error={errors.eventstart}
                                />
                            </div>
                            
                            <div className='eventEnd'>
                                <FormInput id='eventend'
                                    register={register}
                                    onfocus={clearErrors}
                                    type='time'
                                    error={errors.eventend}
                                />
                            </div>

                        </div>
                    </div>

                    {/* business location selector */}
                    <BusinessSelect id='venue_id'
                        register={register}
                        onfocus={() => clearErrors(['venue_id','role_rights'])}
                        role_error={errors.role_rights}
                        business_error={errors.venue_id}
                        business_list={venue_list}
                        selectFor='Location'
                    />
                    {/* event details input */}
                    <TextAreaInput id='details'
                        register={register}
                        onfocus={clearErrors}
                        error={errors.details}
                        placeholder='Event details...'
                    />
                    {/* business brand selector */}
                    <BusinessSelect id='brand_id'
                        register={register}
                        onfocus={() => clearErrors(['brand_id','role_rights'])}
                        role_error={errors.role_rights}
                        business_error={errors.brand_id}
                        business_list={brand_list}
                        selectFor='Brand'
                    />
                    
                    <div className='buttonWrapper d-flex justify-content-between pt-3'>
                        <button type='submit' disabled={!isDirty}>Update</button>
                        <FontAwesomeIcon icon={faTrash} onClick={() => delete_event()} siza='2x' />
                        <button onClick={() => close_edit_event()} variant='secondary'>Close</button>
                    </div>
                </form>
            </div>
        </EditEventFormStyles>
    )
}

export default EventEditForm;
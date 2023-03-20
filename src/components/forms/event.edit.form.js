import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { yupResolver } from '@hookform/resolvers/yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';

import useAuth from '../../hooks/useAuth';
import useImagePreview from '../../hooks/useImagePreview';
import { reformatTime } from '../../helpers/formatTime';
import { useBusinessesQuery } from '../../hooks/useBusinessApi';
import { useUpdateEventMutation, useRemoveEventMutation } from '../../hooks/useEventsApi';
import useNotification from '../../hooks/useNotification';
import LoadingSpinner from '../loadingSpinner';
import { updateEventSchema } from '../../helpers/validationSchemas';
import { image_link } from '../../helpers/dataCleanUp';
import { BusinessSelect, CheckBox, FormInput, ImageInput, TextAreaInput } from './formInput';

const Styles = styled.div`
    .formHeader {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
    }

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
            if(image_attached) {
                let canvas_image = canvas.current.toDataURL("image/webp", 1.0)

                let [mime, image_data] = canvas_image.split(',')
                mime = mime.match(/:(.*?);/)[1]

                let data_string = atob(image_data)
                let data_length = data_string.length
                let image_array = new Uint8Array(data_length)

                while(data_length--) { image_array[data_length] = data_string.charCodeAt(data_length) }

                let event_media = new File([image_array], 'eventmedia.jpeg', { type: mime })

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
        <Styles>
            <form onSubmit={handleSubmit(update_event)} encType='multipart/form-data'>

                <div className='formHeader'>
                    {/* eventname input */}
                    <FormInput id='eventname'
                        register={register}
                        onfocus={clearErrors}
                        error={errors.eventname}
                    />
                    <FontAwesomeIcon icon={faTrash} onClick={() => delete_event()} siza='2x' />
                </div>

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

                <CheckBox id='image_attached'
                    register={register}
                    boxlabel='Update Image'
                />
                {/* event image input */}
                {
                    (image_attached) &&
                        <ImageInput id='eventmedia'
                            register={register}
                            onfocus={clearErrors}
                            error={errors.eventmedia}
                            change={imagePreview}
                        />
                }

                <div className='dateTimeWrapper'>
                    {/* eventdate input */}
                    <FormInput id='eventdate'
                        register={register}
                        onfocus={clearErrors}
                        type='date'
                        error={errors.eventdate}
                    />

                    {/* start & end */}
                    <div className='timeWrapper'>
                        {/* eventstart input */}
                        <FormInput id='eventstart'
                            register={register}
                            onfocus={clearErrors}
                            type='time'
                            error={errors.eventstart}
                        />
                        {/* eventend input */}
                        <FormInput id='eventend'
                            register={register}
                            onfocus={clearErrors}
                            type='time'
                            error={errors.eventend}
                        />
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
                    <button onClick={() => close_edit_event()} variant='secondary'>Close</button>
                </div>
            </form>
        </Styles>
    )
}

export default EventEditForm;
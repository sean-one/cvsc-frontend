import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { DevTool } from '@hookform/devtools'

import useAuth from '../../hooks/useAuth';
import { FormInput, BusinessSelect, TextAreaInput, ImageInput } from './formInput';
import useImagePreview from '../../hooks/useImagePreview';
import { createEventSchema } from '../../helpers/validationSchemas';
import { useCreateEventMutation } from '../../hooks/useEventsApi';
import { useBusinessesQuery } from '../../hooks/useBusinessApi';
import useNotification from '../../hooks/useNotification';
import LoadingSpinner from '../loadingSpinner';

const EventCreateForm = ({ business_id }) => {
    const { logout_user } = useAuth()
    const { editImage, imagePreview, canvas, setEditImage } = useImagePreview()
    const { mutateAsync: createEvent } = useCreateEventMutation()
    const { dispatch } = useNotification();
    let venue_list, brand_list = []
    let navigate = useNavigate();
    let location = useLocation()

    const { data: business_list, isLoading, isSuccess } = useBusinessesQuery()

    const { register, handleSubmit, control, setError, clearErrors, reset, formState: { errors } } = useForm({
        mode: 'onBlur',
        resolver: yupResolver(createEventSchema),
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
            const formData = new FormData()

            if(canvas.current === null) {
                throw new Error('missing_image')
            } else {
                let canvas_image = canvas.current.toDataURL("image/webp", 1.0)

                let [mime,image_data] = canvas_image.split(',')
                mime = mime.match(/:(.*?);/)[1]

                let data_string = atob(image_data)
                let data_length = data_string.length
                let image_array = new Uint8Array(data_length)

                while(data_length--) { image_array[data_length] = data_string.charCodeAt(data_length) }

                let event_image = new File([image_array], 'event_image.jpeg', { type: mime })

                formData.set('eventmedia', event_image)
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
                setError('eventmedia', { message: 'required' })
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
        <form onSubmit={handleSubmit(createNewEvent)} encType='multipart/form-data'>

            {/* eventname input */}
            <FormInput register={register} id='eventname' onfocus={clearErrors} placeholder='Event Name' error={errors.eventname} />

            <div className='dateTimeWrapper'>
                {/* eventdate input */}
                <FormInput register={register} id='eventdate' onfocus={clearErrors} type='date' error={errors.eventdate} />

                {/* start & end */}
                <div className='timeWrapper'>
                    {/* eventstart input */}
                    <FormInput register={register} id='eventstart' onfocus={clearErrors} type='time' error={errors.eventstart} />

                    {/* eventend input */}
                    <FormInput register={register} id='eventend' onfocus={clearErrors} type='time' error={errors.eventend} />
                </div>
            </div>
            <div className='errormessage'>{errors.time_format?.message}</div>

            <div className='formImage'>
                {
                    editImage &&
                            <canvas id={'eventImagePreview'} ref={canvas} />
                }
            </div>

            {/* event image input */}
            <ImageInput id='eventmedia'
                register={register}
                onfocus={clearErrors}
                error={errors.eventmedia}
                change={imagePreview}
            />

            {/* business location selector */}
            <BusinessSelect id='venue_id'
                register={register}
                onfocus={() => clearErrors(['venue_id', 'role_rights'])}
                role_error={errors.role_rights}
                business_error={errors.venue_id}
                business_list={venue_list}
                selectFor='Location'
            />

            {/* event details input */}
            <TextAreaInput register={register} id='details' onfocus={() => clearErrors('details')} error={errors.details} placeholder='Event details...' />

            {/* business brand selector */}
            <BusinessSelect id='brand_id'
                register={register}
                onfocus={() => clearErrors(['brand_id', 'role_rights'])}
                role_error={errors.role_rights}
                business_error={errors.brand_id}
                business_list={brand_list}
                selectFor='Brand'
            />

            <button type='submit'>Submit</button>

            <DevTool control={control} />
        </form>
    )
}

export default EventCreateForm;
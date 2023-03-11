import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import { DevTool } from '@hookform/devtools'

import useAuth from '../../../hooks/useAuth';
import { FormInput, BusinessSelect, TextAreaInput } from '../../forms/formInput';
import { createEventSchema } from '../../../helpers/validationSchemas';
import { useCreateEventMutation } from '../../../hooks/useEventsApi';
import { useBusinessesQuery } from '../../../hooks/useBusinessApi';
import useNotification from '../../../hooks/useNotification';
import LoadingSpinner from '../../loadingSpinner';
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
`;

const EventCreateForm = ({ business_id }) => {
    const { logout_user } = useAuth()
    const [ showImage, setShowImage ] = useState(false)
    const [ imageFile, setImageFile ] = useState('')
    const { mutateAsync: createEvent } = useCreateEventMutation()
    const { dispatch } = useNotification();
    let venue_list, brand_list = []
    let navigate = useNavigate();
    let location = useLocation()

    const { data: business_list, isLoading, isSuccess } = useBusinessesQuery()

    const { register, handleSubmit, control, setError, clearErrors, formState: { errors } } = useForm({
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

            Object.keys(data).forEach(key => {
                if (key === 'eventmedia') {
                    formData.set(key, data[key][0])
                } else if (key === 'eventdate') {
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

                navigate(`/event/${add_event_response.data.event_id}`)
            }
        } catch (error) {
            console.log(error)
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

    const image_preview = (e) => {
        if(e.target.files.length !== 0) {
            setImageFile(URL.createObjectURL(e.target.files[0]))
            setShowImage(true)
        }
    }

    if(isLoading) { return <LoadingSpinner /> }

    if(isSuccess) {
        venue_list = business_list.data.filter(business => business.business_type !== 'brand' && business.active_business)
        brand_list = business_list.data.filter(business => business.business_type !== 'venue' && business.active_business)
    }


    return (
        <Styles>
            <form onSubmit={handleSubmit(createNewEvent)} encType='multipart/form-data'>

                {/* eventname input */}
                <FormInput register={register} id='eventname' onfocus={() => clearErrors('eventname')} type='text' placeholder='Event Name' error={errors.eventname} />

                <div className='dateTimeWrapper'>
                    {/* eventdate input */}
                    <FormInput register={register} id='eventdate' onfocus={() => clearErrors('eventdate')} type='date' error={errors.eventdate} />

                    {/* start & end */}
                    <div className='timeWrapper'>
                        {/* eventstart input */}
                        <FormInput register={register} id='eventstart' onfocus={() => clearErrors('eventstart')} type='time' error={errors.eventstart} />

                        {/* eventend input */}
                        <FormInput register={register} id='eventend' onfocus={() => clearErrors('eventend')} type='time' error={errors.eventend} change={(e) => image_preview(e)} />
                    </div>
                </div>
                <div className='errormessage'>{errors.time_format?.message}</div>

                {
                    showImage &&
                        <div className='eventImage'>
                            <img
                                src={image_link(imageFile)}
                                alt='your event media'
                            />
                        </div>
                }

                {/* event image input */}
                <label for='eventmedia' className='imageUpdateInput'>
                    Select Image
                    <FontAwesomeIcon icon={faCamera} className='cameraIcon' />
                    <input
                        {...register('eventmedia')}
                        className={errors.eventmedia ? 'inputError' : ''}
                        onFocus={() => clearErrors('eventmedia')}
                        type='file'
                        name='eventmedia'
                        accept='image/*'
                        onChange={(e) => image_preview(e)}
                    />
                </label>
                <div className='errormessage'>{errors.eventmedia?.message}</div>

                {/* business location selector */}
                <BusinessSelect register={register} id='venue_id' onfocus={() => clearErrors(['venue_id', 'role_rights'])} role_error={errors.role_rights} business_error={errors.venue_id} business_list={venue_list} selectFor='Location' />

                {/* event details input */}
                <TextAreaInput register={register} id='details' onfocus={() => clearErrors('details')} error={errors.details} placeholder='Event details...' />

                {/* business brand selector */}
                <BusinessSelect register={register} id='brand_id' onfocus={() => clearErrors(['brand_id', 'role_rights'])} role_error={errors.role_rights} business_error={errors.brand_id} business_list={brand_list} selectFor='Brand' />

                <button type='submit'>Submit</button>

                <DevTool control={control} />
            </form>
        </Styles>
    )
}

export default EventCreateForm;
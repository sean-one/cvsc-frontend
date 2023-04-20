import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { createEventSchema } from '../../helpers/validationSchemas';
import styled from 'styled-components';

import useAuth from '../../hooks/useAuth';
import { FormInput, BusinessSelect, TextAreaInput, ImageInput } from './formInput';
import useEventImagePreview from '../../hooks/useEventImagePreview';
import { setImageForForm } from '../../helpers/setImageForForm';
import { useCreateEventMutation } from '../../hooks/useEventsApi';
import { useBusinessesQuery } from '../../hooks/useBusinessApi';
import useNotification from '../../hooks/useNotification';
import LoadingSpinner from '../loadingSpinner';

const CreateEventFormStyles = styled.div`
    .createEventFormWrapper {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        border: 1px solid blue;

    }

    .createEventForm {
        width: 100%;
        max-width: var(--max-page-width);
        background-color: red;
    }

    .createEventFormImage {
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
            /* border: 1px solid #dcdbc4; */
            display: block;
            /* box-shadow: 5px 5px 5px #010a00; */
        }
    }

    .createEventFormRow {
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
                let event_image = setImageForForm(canvas)

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
        <CreateEventFormStyles>
            <div className='createEventFormWrapper'>
                <form onSubmit={handleSubmit(createNewEvent)} encType='multipart/form-data' className='createEventForm'>
                    
                    <div className='createEventFormRow'>
                        
                        <div className='eventnameSection'>
                            <FormInput
                                id='eventname'
                                register={register}
                                onfocus={clearErrors}
                                placeholder='Event Name'
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

                    <div className='createEventFormImage'>
                        {
                            editImage &&
                                    <canvas id={'eventImagePreview'} ref={canvas} />
                        }
                    </div>

                    <div className='createEventFormRow dateTimeRow'>
                        
                        <div className='dateSection'>
                            <FormInput
                                id='eventdate'
                                register={register}
                                onfocus={clearErrors}
                                type='date'
                                error={errors.eventdate}
                            />
                        </div>

                        <div className='timeSection'>
                            <div className='eventStart'>
                                <FormInput
                                    id='eventstart'
                                    register={register}
                                    onfocus={clearErrors}
                                    type='time'
                                    error={errors.eventstart}
                                />
                            </div>
                            <div className='eventEnd'>
                                <FormInput
                                    id='eventend'
                                    register={register}
                                    onfocus={clearErrors}
                                    type='time'
                                    error={errors.eventend}
                                />
                            </div>
                        </div>
                    
                    </div>
                    <div className='errormessage'>{errors.time_format?.message}</div>

                    {/* <ImageInput id='eventmedia'
                        register={register}
                        onfocus={clearErrors}
                        error={errors.eventmedia}
                        change={imagePreview}
                    /> */}

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

                </form>
            </div>
        </CreateEventFormStyles>
    )
}

export default EventCreateForm;
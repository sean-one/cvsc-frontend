import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import styled from 'styled-components';
import { TbCameraPlus } from 'react-icons/tb'
import { FaRegCalendarDays, FaRegClock } from 'react-icons/fa6';

import useAuth from '../../hooks/useAuth';
import useNotification from '../../hooks/useNotification';
import { useCreateEventMutation } from '../../hooks/useEventsApi';
import { useUserRolesQuery } from '../../hooks/useRolesApi';
import { validateEventDate, validateEventTime } from './utils/form.validations';

import AddressForm from './address.form';
import ImageUploadAndCrop from '../../helpers/imageUploadAndCrop';
import LoadingSpinner from '../loadingSpinner';

const CreateEventFormStyles = styled.div`
    .business_name_field {
        margin-top: 1rem;
    }
`;

const customSelectStyles = {
    control: (provided, state) => ({
        ...provided,
        backgroundColor: 'var(--main-background-color)',
        fontSize: '2.1rem',
        color: 'var(--main-color)',
        borderColor: state.isFocused ? 'var(--main-color)' : provided.borderColor,
        boxShadow: state.isFocused ? '0 0 0 1px var(--main-color)' : provided.boxShadow,
        '&:hover': {
            borderColor: state.isFocused ? 'var(--main-color)' : provided.borderColor,
        }
    }),
    input: (provided) => ({
        ...provided,
        color: 'var(--main-color)',
        fontSize: '2.1rem',
    }),
    singleValue: (provided) => ({
        ...provided,
        color: 'var(--main-color)',
        fontSize: '2.1rem',
    }),
    placeholder: (provided) => ({
        ...provided,
        color: 'var(--input-placeholder)',
        fontSize: '2.1rem',
    }),
    valueContainer: (provided) => ({
        ...provided,
        color: 'var(--main-color)',
        fontSize: '2.1rem',
    }),
    dropdownIndicator: (provided) => ({
        ...provided,
        color: 'var(--main-color)',
        fontSize: '2.1rem',
        '&:hover': {
            color: 'var(--main-color)',
        }
    }),
    clearIndicator: (provided) => ({
        ...provided,
        color: 'var(--main-color)',
        '&:hover': {
            color: 'var(--error-color)',
        }
    }),
    menu: (provided) => ({
        ...provided,
        backgroundColor: 'var(--main-background-color)',
        fontSize: '2.1rem'
    }),
    option: (provided) => ({
        ...provided,
        backgroundColor: 'var(--main-background-color)',
        color: 'var(--main-color)',
        fontSize: '2.1rem',
    })
}

const EventCreateForm = () => {
    const [ croppedImage, setCroppedImage ] = useState(null);
    const [ previewImageUrl, setPreviewImageUrl ] = useState('');
    const { auth } = useAuth();
    const { dispatch } = useNotification();
    const { mutateAsync: createEvent } = useCreateEventMutation()
    let user_host_business_list = []
    
    const { data: user_roles, isError, isPending, isSuccess: userRolesSuccess } = useUserRolesQuery(auth?.user?.id)
    
    let navigate = useNavigate();
    
    const { register, control, handleSubmit, setError, setValue, clearErrors, reset, formState: { errors } } = useForm({
        mode: 'onBlur',
        defaultValues: {
            eventname: '',
            place_id: null,
            formatted_address: '',
            eventdate: '',
            eventstart: '',
            eventend: '',
            eventmedia: '',
            details: '',
            // host_business: ''
        }
    });

    const onImageCropped = useCallback((croppedBlob) => {
        setCroppedImage(croppedBlob);

        const previewImageURL = URL.createObjectURL(croppedBlob)
        setPreviewImageUrl(previewImageURL)

        let eventmedia = new File([croppedBlob], 'eventmedia.jpeg', { type: croppedBlob.type })
        // React Hook Form for handling cropped image
        setValue('eventmedia', eventmedia); // This allows you to include the cropped image in the form data
    }, [setValue]);
    
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

    const createNewEvent = async (event_data) => {
        localStorage.setItem('createEventForm', JSON.stringify(event_data));
        try {
            
            if (event_data.hasOwnProperty('host_business')) {
                if (event_data.host_business && event_data.host_business.hasOwnProperty('value')) {
                    event_data.host_business = event_data.host_business.value
                }
            }
            
            const formData = new FormData()
            
            if(croppedImage) {
                formData.set('eventmedia', event_data.eventmedia[0])
            } else {
                throw new Error('missing_image')
            }

            Object.keys(event_data).forEach(key => {
                if (key === 'eventdate') {
                    formData.append(key, format(parseISO(event_data[key]), "y-M-d"))
                } else if (key === 'eventstart' || key === 'eventend') {
                    formData.append(key, event_data[key].replace(':', ''))
                } else {
                    formData.append(key, event_data[key])
                }
            })

            const new_event = await createEvent(formData)

            if (new_event.status === 201) {
                // reset the create event form
                reset()

                // navigate to the newly created event page
                navigate(`/event/${new_event?.data?.event_id}`)
            }


        } catch (error) {
            // handles error for no canvas object for image upload
            if (error?.message === 'missing_image' || (error?.response?.data?.error?.type === 'media_error')) {
                setError('eventmedia', {
                    message: 'an event image is required'
                }, { shouldFocus: true })
            }

            // handles events from event.response
            else if (error?.response?.status === 400) {
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
                console.log(error)
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

    if (userRolesSuccess) {
        if (user_roles?.data.length === 0) {
            dispatch({
                type: "ADD_NOTIFICATION",
                payload: {
                    notification_type: 'ERROR',
                    message: 'No business roles found'
                }
            })
            
            navigate('/profile')
        }
        user_host_business_list = user_roles?.data.filter(role => role.active_role).map(role => ({
            value: role.business_id,
            label: role.business_name,
        }))
    }


    return (
        <CreateEventFormStyles>
            {
                isPending ? (
                    <LoadingSpinner />
                ) : isError ? (
                    null
                ) : <div>
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
                                <TbCameraPlus className='siteIcons' color={errors.eventmedia ? 'var(--error-color)' : 'var(--main-color'} />
                            </label>

                        </div>
                        {errors.eventname ? <div className='errormessage'>{errors.eventname?.message}</div> : null}
                        {errors.eventmedia ? <div className='errormessage imageError'>{errors.eventmedia?.message}</div> : null}

                        {/* EVENT IMAGE PREVIEW RENDER */}
                        {
                            previewImageUrl &&
                                    <div className='imagePreview eventImage'>
                                        <img src={previewImageUrl} alt='event promotional media' />
                                    </div>
                        }
                        <ImageUploadAndCrop
                            onImageCropped={onImageCropped}
                            registerInput={register}
                            registerName='eventmedia'
                        />

                        <AddressForm
                            register={register}
                            setValue={setValue}
                            errors={errors}
                            clearErrors={clearErrors}
                        />

                        {/* EVENT DATE */}
                        <div className='dateTimeInputWrapper'>
                            <label htmlFor='eventdate'><FaRegCalendarDays className='siteIcons' /></label>
                            <input {...register('eventdate', {
                                required: 'an event date is required',
                                validate: validateEventDate,
                            })} type='date' onClick={() => clearErrors('eventdate')} />
                        </div>
                        {errors.eventdate ? <div className='errormessage'>{errors.eventdate?.message}</div> : null}

                        {/* EVENT START */}
                        <div className='dateTimeInputWrapper'>
                            <label htmlFor='eventstart'><FaRegClock className='siteIcons' /></label>
                            <input {...register('eventstart', {
                                required: 'an event starting time is required',
                                validate: validateEventTime,
                            })} type='time' onClick={() => clearErrors('eventstart')} />
                        </div>
                        {errors.eventstart ? <div className='errormessage'>{errors.eventstart?.message}</div> : null}
                        
                        {/* EVENT END */}
                        <div className='dateTimeInputWrapper'>
                            <label htmlFor='eventend'><FaRegClock className='siteIcons' /></label>
                            <input {...register('eventend', {
                                required: 'an event ending time is required',
                                validate: validateEventTime,
                            })} type='time' onClick={() => clearErrors('eventend')} />
                        </div>
                        {errors.eventend ? <div className='errormessage'>{errors.eventend?.message}</div> : null}

                        {/* BUSINESS NAME */}
                        <div className='inputWrapper business_name_field' onClick={() => clearErrors('host_business')}>
                            <label htmlFor='host_business' className='visuallyHidden'>Business Name:</label>
                            <Controller
                                name='host_business'
                                control={control}
                                rules={{ required: 'a business name is required' }}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={user_host_business_list}
                                        placeholder='Select a business'
                                        isClearable
                                        isSearchable
                                        styles={customSelectStyles}
                                        onChange={(selectedOption) => field.onChange(selectedOption)}
                                    />
                                )}
                            />
                            {errors.host_business && <div className='errormessage'>{errors.host_business.message}</div>}
                        </div>

                        {/* EVENT DETAILS */}
                        <div className='inputWrapper'>
                            <textarea {...register('details', {
                                required: 'event details are required',
                                minLength: {
                                    value: 30,
                                    message: 'event details must be at least 30 characters'
                                },
                                maxLength: {
                                    value: 1000,
                                    message: 'event details are too long'
                                }
                            })} rows='8' onClick={() => clearErrors('details')} placeholder='Event details ...'/>
                            {errors.details ? <div className='errormessage'>{errors.details?.message}</div> : null}
                        </div>

                        <div className='formButtonWrapper'>
                            <button type='submit'>Create</button>
                            <button onClick={handleClose}>Close</button>
                        </div>

                    </form>
                </div>
            }
        </CreateEventFormStyles>
    )
}

export default EventCreateForm;
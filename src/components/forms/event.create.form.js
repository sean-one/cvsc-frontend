import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
        fontSize: 'var(--input-font-size)',
        color: 'var(--text-color)',
        borderColor: 'var(--text-color)',
        boxShadow: state.isFocused ? '0 0 0 1px var(--text-color)' : provided.boxShadow,
        '&:hover': {
            borderColor: 'var(--text-color)',
        }
    }),
    input: (provided) => ({
        ...provided,
        color: 'var(--text-color)',
        fontSize: 'var(--input-font-size)',
    }),
    singleValue: (provided) => ({
        ...provided,
        color: 'var(--text-color)',
        fontSize: 'var(--input-font-size)',
    }),
    placeholder: (provided) => ({
        ...provided,
        color: 'var(--input-placeholder)',
        fontSize: 'var(--input-font-size)',
    }),
    valueContainer: (provided) => ({
        ...provided,
        color: 'var(--text-color)',
        fontSize: 'var(--input-font-size)',
    }),
    dropdownIndicator: (provided) => ({
        ...provided,
        color: 'var(--text-color)',
        fontSize: 'var(--input-font-size)',
        '&:hover': {
            color: 'var(--text-color)',
        }
    }),
    clearIndicator: (provided) => ({
        ...provided,
        color: 'var(--text-color)',
        '&:hover': {
            color: 'var(--error-color)',
        }
    }),
    menu: (provided) => ({
        ...provided,
        backgroundColor: 'var(--main-background-color)',
        fontSize: 'var(--input-font-size)'
    }),
    option: (provided) => ({
        ...provided,
        backgroundColor: 'var(--main-background-color)',
        color: 'var(--text-color)',
        fontSize: 'var(--input-font-size)',
    })
}

const EventCreateForm = () => {
    const [ croppedImage, setCroppedImage ] = useState(null);
    const [ previewImageUrl, setPreviewImageUrl ] = useState('');
    const [ userHostBusinessList, setUserHostBusinessList ] = useState([])
    const { auth } = useAuth();
    const { dispatch } = useNotification();
    const { mutateAsync: createEvent } = useCreateEventMutation()
    
    const { data: user_roles, isError, isPending, isSuccess: userRolesSuccess } = useUserRolesQuery(auth?.user?.id)
    
    let location = useLocation()
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
            host_business: null
        }
    });

    useEffect(() => {
        if (userRolesSuccess) {
            const rolesData = user_roles?.data || []
            if (rolesData.length === 0) {
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'ERROR',
                        message: 'No business roles found'
                    }
                });

                navigate('/profile');
                return;
            }

            const list = user_roles.data
                .filter(role => role.active_role)
                .map(role => ({ value: role.business_id, label: role.business_name }));
            
            setUserHostBusinessList(list);
            const passedBusinessId = location.state?.businessId;
            const defaultBusiness = list.find(b => b.value === passedBusinessId)
    
            if (defaultBusiness) {
                setValue('host_business', defaultBusiness);
            }
        }

    }, [dispatch, navigate, setValue, user_roles, userRolesSuccess, location.state])

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
                console.error(`uncaught error: ${Object.keys(error)}`)
            }
        }
    }

    const handleCameraClick = () => {
        setPreviewImageUrl('')
    }

    const handleClose = () => {
        // remove create event form save from localhost & go back
        localStorage.removeItem('createEventForm')
        // reset the form
        reset()
        
        navigate('/profile')
    }


    return (
        <CreateEventFormStyles>
            {
                isPending ? (
                    <LoadingSpinner />
                ) : isError ? (
                    null
                ) : <form onSubmit={handleSubmit(createNewEvent)} encType='multipart/form-data' className='standardForm'>
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
                                <TbCameraPlus onClick={handleCameraClick} className='siteIcons' color={errors.eventmedia ? 'var(--error-color)' : 'var(--text-color'} />
                            </label>

                        </div>
                        {errors.eventname ? <div className='errormessage'>{errors.eventname?.message}</div> : null}
                        {errors.eventmedia ? <div className='errormessage imageError'>{errors.eventmedia?.message}</div> : null}

                        {/* EVENT IMAGE PREVIEW RENDER */}
                        <div>
                            {
                                previewImageUrl
                                        ? (
                                            <div className='imagePreview eventImage'>
                                                <img src={previewImageUrl} alt='event promotional media' />
                                            </div>
                                        ) : (
                                            <ImageUploadAndCrop
                                                onImageCropped={onImageCropped}
                                                registerInput={register}
                                                registerName='eventmedia'
                                            />
                                        )
                            }
                        </div>

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
                                        options={userHostBusinessList}
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
                            <button className='formButton' type='submit'>Create</button>
                            <button className='formButton' onClick={handleClose}>Close</button>
                        </div>

                    </form>
            }
        </CreateEventFormStyles>
    )
}

export default EventCreateForm;
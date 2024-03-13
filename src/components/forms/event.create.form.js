import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import styled from 'styled-components';

import useAuth from '../../hooks/useAuth';
import useNotification from '../../hooks/useNotification';
import useEventImagePreview from '../../hooks/useEventImagePreview';
import { setImageForForm } from '../../helpers/setImageForForm';
import { useCreateEventMutation } from '../../hooks/useEventsApi';
import { useBusinessesQuery } from '../../hooks/useBusinessApi';
import { useUserRolesQuery } from '../../hooks/useRolesApi';
import { AddImageIcon, DateIcon, TimeIcon } from '../icons/siteIcons';
import { validateEventDate, validateEventTime } from './utils/form.validations';

import AddressForm from './address.form';

const CreateEventFormStyles = styled.div`
    .business_name_field {
        margin-top: 1rem;
    }
`;

const customSelectStyles = {
    control: (provided, state) => ({
        ...provided,
        backgroundColor: 'var(--main-color)',
        fontSize: '2.1rem',
        color: 'var(--secondary-color)',
        borderColor: state.isFocused ? 'var(--secondary-color)' : provided.borderColor,
        boxShadow: state.isFocused ? '0 0 0 1px var(--secondary-color)' : provided.boxShadow,
        '&:hover': {
            borderColor: state.isFocused ? 'var(--secondary-color)' : provided.borderColor,
        }
    }),
    input: (provided) => ({
        ...provided,
        color: 'var(--secondary-color)',
        fontSize: '2.1rem',
    }),
    singleValue: (provided) => ({
        ...provided,
        color: 'var(--secondary-color)',
        fontSize: '2.1rem',
    }),
    placeholder: (provided) => ({
        ...provided,
        color: 'var(--input-placeholder)',
        fontSize: '2.1rem',
    }),
    valueContainer: (provided) => ({
        ...provided,
        color: 'var(--secondary-color)',
        fontSize: '2.1rem',
    }),
    dropdownIndicator: (provided) => ({
        ...provided,
        color: 'var(--secondary-color)',
        fontSize: '2.1rem',
        '&:hover': {
            color: 'var(--trim-color)',
        }
    }),
    clearIndicator: (provided) => ({
        ...provided,
        color: 'var(--secondary-color)',
        '&:hover': {
            color: 'var(--error-color)',
        }
    }),
    menu: (provided) => ({
        ...provided,
        backgroundColor: 'var(--main-color)',
        border: '1px solid var(--secondary-color)',
        fontSize: '2.1rem'
    }),
    option: (provided) => ({
        ...provided,
        backgroundColor: 'var(--main-color)',
        color: 'var(--secondary-color)',
        fontSize: '2.1rem',
    })
}

const EventCreateForm = () => {
    const { auth } = useAuth();
    const { dispatch } = useNotification();
    const { editImage, imagePreview, canvas, setEditImage } = useEventImagePreview()
    const { mutateAsync: createEvent } = useCreateEventMutation()
    let user_host_business_list = []
    
    const { data: user_roles, isSuccess: userRolesSuccess } = useUserRolesQuery(auth?.user?.id)
    const { data: businesses_list, isSuccess: businessesListSuccess } = useBusinessesQuery();
    
    let navigate = useNavigate();
    
    const { register, control, handleSubmit, setError, setValue, clearErrors, reset, watch, formState: { errors } } = useForm({
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
            host_business: ''
        }
    });
    
    const [ filteredBusinessList, setFilteredBusinessList ] = useState([])

    const selectedHostBusiness = watch('host_business')

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

    useEffect(() => {
        if (businessesListSuccess) {
            const newBusinessList = businesses_list?.data
                .filter(business => business.id !== selectedHostBusiness?.value)
                .map(business => ({
                    value: business.id,
                    label: business.business_name
                }))
            setFilteredBusinessList(newBusinessList)
        }
    }, [businessesListSuccess, businesses_list, selectedHostBusiness])

    const createNewEvent = async (event_data) => {
        localStorage.setItem('createEventForm', JSON.stringify(event_data));
        try {
            // field is not needed, image comes from canvas
            delete event_data['eventmedia']

            if (event_data.hasOwnProperty('host_business')) {
                if (event_data.host_business && event_data.host_business.hasOwnProperty('value')) {
                    event_data.host_business = event_data.host_business.value
                }
            }

            if (event_data.hasOwnProperty('business_tag')) {
                if (event_data.business_tag && event_data.business_tag.hasOwnProperty('value')) {
                    event_data.business_tag = event_data.business_tag.value
                }
            }

            const formData = new FormData()

            // check for current canvas and set it to formData
            if(canvas.current === null) {
                throw new Error('missing_image')
            } else {
                let event_image = setImageForForm(canvas)

                formData.set('eventmedia', event_image)
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
                // clear the setEditImage & reset the create event form
                setEditImage(false)
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
        user_host_business_list = user_roles?.data.filter(role => role.active_role).map(role => ({
            value: role.business_id,
            label: role.business_name,
        }))
    }


    return (
        <CreateEventFormStyles>
            <div>
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
                            <AddImageIcon color={errors.eventmedia ? 'var(--error-color)' : 'var(--trim-color'} />
                            <input {...register('eventmedia')} id='eventmedia' className='inputLabelInput' type='file' accept='image/*' onChange={(e) => imagePreview(e)} />
                        </label>

                    </div>
                    {errors.eventname ? <div className='errormessage'>{errors.eventname?.message}</div> : null}
                    {errors.eventmedia ? <div className='errormessage imageError'>{errors.eventmedia?.message}</div> : null}

                    {/* EVENT IMAGE PREVIEW RENDER */}
                    {
                        editImage &&
                                <div className='formImage'>
                                    <canvas id={'eventImagePreview'} ref={canvas} />
                                </div>
                    }

                    <AddressForm
                        register={register}
                        setValue={setValue}
                        errors={errors}
                        clearErrors={clearErrors}
                    />

                    {/* EVENT DATE */}
                    <div className='dateTimeInputWrapper'>
                        <label htmlFor='eventdate'><DateIcon /></label>
                        <input {...register('eventdate', {
                            required: 'an event date is required',
                            validate: validateEventDate,
                        })} type='date' onClick={() => clearErrors('eventdate')} />
                    </div>
                    {errors.eventdate ? <div className='errormessage'>{errors.eventdate?.message}</div> : null}

                    {/* EVENT START */}
                    <div className='dateTimeInputWrapper'>
                        <label htmlFor='eventstart'><TimeIcon /></label>
                        <input {...register('eventstart', {
                            required: 'an event starting time is required',
                            validate: validateEventTime,
                        })} type='time' onClick={() => clearErrors('eventstart')} />
                    </div>
                    {errors.eventstart ? <div className='errormessage'>{errors.eventstart?.message}</div> : null}
                    
                    {/* EVENT END */}
                    <div className='dateTimeInputWrapper'>
                        <label htmlFor='eventend'><TimeIcon /></label>
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
                            defaultValue=""
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
                            required: 'event details are required'
                        })} rows='8' onClick={() => clearErrors('details')} placeholder='Event details ...'/>
                        {errors.details ? <div className='errormessage'>{errors.details?.message}</div> : null}
                    </div>

                    {/* FEATURED BUSINESS */}
                    <div className='inputWrapper' onClick={() => clearErrors('business_tag')}>
                        <label htmlFor='business_tag' className='visuallyHidden'>Featuring:</label>
                        <Controller
                            name='business_tag'
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    options={filteredBusinessList}
                                    placeholder='Tag a business'
                                    isClearable
                                    isSearchable
                                    styles={customSelectStyles}
                                    onChange={(selectedOption) => field.onChange(selectedOption)}
                                />
                            )}
                        />
                    </div>

                    <div className='formButtonWrapper'>
                        <button type='submit'>Create</button>
                        <button onClick={handleClose}>Close</button>
                    </div>

                </form>
            </div>
        </CreateEventFormStyles>
    )
}

export default EventCreateForm;
import React, { useCallback, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { format, parseISO } from 'date-fns';
import Select from 'react-select';
import styled from 'styled-components';

import useAuth from '../../hooks/useAuth';
import { reformatTime } from '../../helpers/formatTime';
import { useUpdateEventMutation, useRemoveEventMutation } from '../../hooks/useEventsApi';
import { useUserRolesQuery } from '../../hooks/useRolesApi';
import useNotification from '../../hooks/useNotification';
import { image_link } from '../../helpers/dataCleanUp';
import { AddImageIcon, DateIcon, TimeIcon } from '../icons/siteIcons';
import { validateEventDate, validateEventTime, validateNONEmptyString } from './utils/form.validations';
import ImageUploadAndCrop from '../../helpers/imageUploadAndCrop';
import AddressForm from './address.form';
import LoadingSpinner from '../loadingSpinner';


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
            color: 'var(--trim-color)',
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

const EventEditForm = () => {
    const [ croppedImage, setCroppedImage ] = useState(null);
    const [ previewImageUrl, setPreviewImageUrl ] = useState('');
    const { auth } = useAuth();
    let { event_id } = useParams()
    let user_host_business_list = []
    const { dispatch } = useNotification()
    
    const { data: user_roles, isError, isPending, isSuccess: userRoleSuccess } = useUserRolesQuery(auth?.user?.id);
    
    const { mutateAsync: updateEventMutation } = useUpdateEventMutation()
    const { mutate: removeEventMutation } = useRemoveEventMutation()
    
    let navigate = useNavigate()
    let location = useLocation();
    const event_data = location.state.event;

    const { register, control, handleSubmit, setError, clearErrors, reset, setValue, formState: { isDirty, dirtyFields, errors } } = useForm({
        mode: 'onBlur',
        defaultValues: {
            eventname: event_data.eventname,
            place_id: event_data.place_id,
            formatted_address: event_data.formatted_address,
            eventdate: format(new Date(event_data.eventdate), "yyyy-MM-dd"),
            eventstart: reformatTime(event_data.eventstart),
            eventend: reformatTime(event_data.eventend),
            eventmedia: null,
            // host_business: event_data.host_business,
            details: event_data.details,
        }
    })

    const onImageCropped = useCallback((croppedBlob) => {
        setCroppedImage(croppedBlob);

        const previewImageURL = URL.createObjectURL(croppedBlob)
        setPreviewImageUrl(previewImageURL)

        let eventmedia = new File([croppedBlob], 'eventmedia.jpeg', { type: croppedBlob.type })
        // React Hook Form for handling cropped image
        setValue('eventmedia', eventmedia, { shouldDirty: true }); // This allows you to include the cropped image in the form data
    }, [setValue]);

    const update_event = async (event_data) => {
        console.log(event_data)
        console.log(dirtyFields)
        localStorage.setItem('editEventForm', JSON.stringify(event_data))
        try {
            const formData = new FormData()

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

            // if eventmedia has a file set in formData, for some reason it does not show in dirtyFields
            if(croppedImage) {
                formData.set('eventmedia', event_data.eventmedia[0])
            } else {
                delete event_data['eventmedia']
            }


            // remove entries that are unchanged
            for (const [key] of Object.entries(event_data)) {
                if (!Object.keys(dirtyFields).includes(key)) {
                    delete event_data[key]
                }
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

            await updateEventMutation({ event_id: event_id, event_updates: formData })

        } catch (error) {
            if (error?.response?.status === 400) {

                if (error?.response?.data?.error?.type === 'media_error') {
                    setError('eventmedia', { message: error?.response?.data?.error?.message })
                }

                else if (error?.response?.data?.error?.type === 'server') {
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
                console.log(`uncaught error ${Object.keys(error)}`);
            }
        }
    }

    const sendEventDelete = async () => {
        removeEventMutation(event_id)
    }

    const handleClose = () => {
        // remove editEventForm from local storage
        localStorage.removeItem('editEventForm')
        reset()

        navigate('/profile/events');
    }

    if (userRoleSuccess) {
        user_host_business_list = user_roles?.data.filter(role => role.active_role).map(role => ({
            value: role.business_id,
            label: role.business_name,
        }))
    }

    const hostBusinessDefault = user_host_business_list.find(business => business.value === event_data.host_business)


    return (
        <EditEventFormStyles>
            {
                isPending ? (
                    <LoadingSpinner />
                ) : isError ? (
                    null
                ) : <div>
                    <form onSubmit={handleSubmit(update_event)} encType='multipart/form-data' className='standardForm'>

                        {/* EVENT NAME AND MEDIA IMAGE */}
                        <div className='formRowInputIcon'>

                            {/* EVENT NAME */}
                            <div className='inputWrapper'>
                                <input {...register('eventname', {
                                    minLength: {
                                        value: 4,
                                        message: 'an event name must have at least 4 characters'
                                    },
                                    maxLength: {
                                        value: 49,
                                        message: 'an event name must have less then 50 characters'
                                    }
                                })} type='text' onChange={() => clearErrors('eventname')} />
                            </div>

                            {/* EVENT MEDIA UPDATE */}
                            <label htmlFor='eventmedia' className='inputLabel' onClick={() => clearErrors('eventmedia')}>
                                <AddImageIcon />
                            </label>

                        </div>
                        {errors.eventname ? <div className='errormessage'>{errors.eventname?.message}</div> : null}
                        {errors.eventmedia ? <div className='errormessage imageError'>{errors.eventmedia?.message}</div>: null}

                        {
                            croppedImage
                                ? <div className='imagePreview eventImage'>
                                    <img src={previewImageUrl} alt='event media' />
                                </div>
                                : <div className='imagePreview eventImage'>
                                    <img src={image_link(event_data?.eventmedia)} alt={event_data?.eventname} />
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
                            currentValue={event_data?.formatted_address}
                        />

                        {/* EVENT DATE */}
                        <div className='dateTimeInputWrapper'>
                            <label htmlFor='eventdate'><DateIcon /></label>
                            <input {...register('eventdate', {
                                validate: {
                                    checkEmptyString: validateNONEmptyString,
                                    validateDateFormat: (value) => validateEventDate(value, false)
                                }
                            })} type='date' onChange={() => clearErrors('eventdate')} />
                        </div>
                        {errors.eventdate ? <div className='errormessage'>{errors.eventdate?.message}</div> : null}

                        {/* EVENT START TIME */}
                        <div className='dateTimeInputWrapper'>
                            <label htmlFor='eventstart'><TimeIcon /></label>
                            <input {...register('eventstart', {
                                validate: {
                                    checkEmptyString: validateNONEmptyString,
                                    validateTimeFormat: (value) => validateEventTime(value, false)
                                }
                            })} type='time' onChange={() => clearErrors('eventstart')} />
                        </div>
                        {errors.eventstart ? <div className='errormessage'>{errors.eventstart?.message}</div> : null}

                        {/* EVENT END TIME */}
                        <div className='dateTimeInputWrapper'>
                            <label htmlFor='eventend'><TimeIcon /></label>
                            <input {...register('eventend', {
                                validate: {
                                    checkEmptyString: validateNONEmptyString,
                                    validateTimeFormat: (value) => validateEventTime(value, false)
                                }
                            })} type='time' onChange={() => clearErrors('eventend')} />
                        </div>
                        {errors.eventend ? <div className='errormessage'>{errors.eventend?.message}</div> : null}

                        {/* BUSINESS NAME */}
                        <div className='inputWrapper'>
                            <label htmlFor='host_business' className='visuallyHidden'>Business Name:</label>
                            <Controller
                                name='host_business'
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={user_host_business_list}
                                        defaultValue={hostBusinessDefault}
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
                            <textarea {...register('details')} rows='8' onChange={() => clearErrors('details')} />
                            {errors.details ? <div className='errormessage'>{errors.details?.message}</div> : null}
                        </div>
                        
                        <div className='formButtonWrapper'>
                            <button type='submit' disabled={(!isDirty || Object.keys(dirtyFields).length === 0)}>Update</button>
                            <button type='button' onClick={sendEventDelete}>Delete</button>
                            <button type='button' onClick={handleClose}>Close</button>
                        </div>

                    </form>
                </div>
            }
        </EditEventFormStyles>
    )
}

export default EventEditForm;
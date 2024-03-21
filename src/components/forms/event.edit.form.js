import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { format, parseISO } from 'date-fns';
import Select from 'react-select';
import styled from 'styled-components';

import useAuth from '../../hooks/useAuth';
import useEventImagePreview from '../../hooks/useEventImagePreview';
import { setImageForForm } from '../../helpers/setImageForForm';
import { reformatTime } from '../../helpers/formatTime';
import { useUpdateEventMutation, useRemoveEventMutation } from '../../hooks/useEventsApi';
import { useUserRolesQuery } from '../../hooks/useRolesApi';
import useNotification from '../../hooks/useNotification';
import { image_link } from '../../helpers/dataCleanUp';
import { AddImageIcon, DateIcon, TimeIcon } from '../icons/siteIcons';
import { validateEventDate, validateEventTime, validateNONEmptyString } from './utils/form.validations';
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

const EventEditForm = () => {
    const { auth } = useAuth();
    let { event_id } = useParams()
    let user_host_business_list = []
    const { editImage, imagePreview, canvas, setEditImage } = useEventImagePreview()
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

    const update_event = async (event_data) => {
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
            if(canvas.current !== null) {
                let eventmediaUpload = setImageForForm(canvas)

                formData.set('eventmedia', eventmediaUpload)
            }

            delete event_data['eventmedia']

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
        // remove editEventForm if it is there so not to leave it stuck on local storage
        localStorage.removeItem('editEventForm')
        setEditImage(false)
        reset()

        navigate('/profile/events');
    }

    // useEffect(() => {

    //     // check for saved data in local storage
    //     const savedFormData = localStorage.getItem('editEventForm');
    //     if (savedFormData) {
    //         const parsedData = JSON.parse(savedFormData);
    //         for (let key in parsedData) {
    //             setValue(key, parsedData[key], { shouldDirty: true });
    //         }
    //     }
    // }, [setValue])

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
                                })} type='text' onClick={() => clearErrors('eventname')} />
                            </div>

                            {/* EVENT MEDIA UPDATE */}
                            <label htmlFor='eventmedia' className='inputLabel' onClick={() => clearErrors('eventmedia')}>
                                <AddImageIcon />
                                <input {...register('eventmedia')} id='eventmedia' className='inputLabelInput' type='file' accept='image/*' onChange={(e) => imagePreview(e)} />
                            </label>

                        </div>
                        {errors.eventname ? <div className='errormessage'>{errors.eventname?.message}</div> : null}
                        {errors.eventmedia ? <div className='errormessage imageError'>{errors.eventmedia?.message}</div>: null}

                        {
                            editImage
                                ? <div className='formImage'>
                                    <canvas
                                        id={'avatarImagePreview'}
                                        ref={canvas}
                                    />
                                </div>
                                : <div className='formImage'>
                                    <img
                                        src={image_link(event_data?.eventmedia)}
                                        alt={event_data?.eventname}
                                    />
                                </div>
                        }

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
                            })} type='date' onClick={() => clearErrors('eventdate')} />
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
                            })} type='time' onClick={() => clearErrors('eventstart')} />
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
                            })} type='time' onClick={() => clearErrors('eventend')} />
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
                            <textarea {...register('details')} rows='8' onClick={() => clearErrors('details')} />
                            {errors.details ? <div className='errormessage'>{errors.details?.message}</div> : null}
                        </div>
                        
                        <div className='formButtonWrapper'>
                            <button type='submit' disabled={(!isDirty || Object.keys(dirtyFields).length === 0) && (canvas.current === null)}>Update</button>
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
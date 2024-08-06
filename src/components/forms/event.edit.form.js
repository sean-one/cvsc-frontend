import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { format, parseISO } from 'date-fns';
import Select from 'react-select';
import styled from 'styled-components';
import { TbCameraPlus } from 'react-icons/tb';
import { Helmet } from 'react-helmet';
import { FaRegCalendarDays, FaRegClock } from 'react-icons/fa6';

import useAuth from '../../hooks/useAuth';
import { reformatTime } from '../../helpers/formatTime';
import { useEventQuery, useUpdateEventMutation, useRemoveEventMutation } from '../../hooks/useEventsApi';
import { useUserRolesQuery } from '../../hooks/useRolesApi';
import useNotification from '../../hooks/useNotification';
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

const EventEditForm = () => {
    const [ croppedImage, setCroppedImage ] = useState(null);
    const [ previewImageUrl, setPreviewImageUrl ] = useState('');
    const { auth } = useAuth();
    let { event_id } = useParams()
    const { dispatch } = useNotification()
    
    const { data: user_roles, isError, isPending, isSuccess: userRoleSuccess } = useUserRolesQuery(auth?.user?.id);
    const { data: event_data, isError: isEventError, isPending: isEventPending } = useEventQuery(event_id)

    const { mutateAsync: updateEventMutation } = useUpdateEventMutation()
    const { mutate: removeEventMutation } = useRemoveEventMutation()
    
    let navigate = useNavigate()
    
    const { register, control, handleSubmit, setError, clearErrors, reset, setValue, formState: { isDirty, dirtyFields, errors } } = useForm({
        mode: 'onBlur',
    })

    const user_host_business_list = useMemo(() => {
        if (userRoleSuccess) {
            return user_roles?.data.filter(role => role.active_role).map(role => ({
                value: role.business_id,
                label: role.business_name
            }));
        }
        return [];
    }, [user_roles, userRoleSuccess])

    const hostBusinessDefault = useMemo(() => {
        return user_host_business_list.find(business => business.value === event_data?.data.host_business);
    }, [user_host_business_list, event_data])

    const onImageCropped = useCallback((croppedBlob) => {
        setCroppedImage(croppedBlob);

        const previewImageURL = URL.createObjectURL(croppedBlob)
        setPreviewImageUrl(previewImageURL)

        let eventmedia = new File([croppedBlob], 'eventmedia.jpeg', { type: croppedBlob.type })
        // React Hook Form for handling cropped image
        setValue('eventmedia', eventmedia, { shouldDirty: true }); // This allows you to include the cropped image in the form data
    }, [setValue]);

    const update_event = async (updated_event) => {
        localStorage.setItem('editEventForm', JSON.stringify(updated_event))
        try {
            const formData = new FormData()

            if (dirtyFields?.host_business) {
                updated_event.host_business = updated_event?.host_business.value
            }

            // if eventmedia has a file set in formData, for some reason it does not show in dirtyFields
            if(croppedImage) {
                formData.set('eventmedia', updated_event?.eventmedia[0])
            } else {
                delete updated_event['eventmedia']
            }


            // remove entries that are unchanged
            for (const [key] of Object.entries(updated_event)) {
                if (!Object.keys(dirtyFields).includes(key)) {
                    delete updated_event[key]
                }
            }

            Object.keys(updated_event).forEach(key => {
                if (key === 'eventdate') {
                    formData.append(key, format(parseISO(updated_event[key]), "y-M-d"))
                } else if (key === 'eventstart' || key === 'eventend') {
                    formData.append(key, updated_event[key].replace(':', ''))
                } else {
                    formData.append(key, updated_event[key])
                }
            })

            await updateEventMutation({ event_id: event_id, event_updates: formData })

        } catch (error) {
            console.log(error)
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
                console.error(`uncaught error ${Object.keys(error)}`);
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'ERROR',
                        message: 'unable to complete request'
                    }
                })
            }
        }
    }

    const sendEventDelete = async () => {
        removeEventMutation(event_id)
        navigate('/profile/events')
    }

    const handleCameraClick = () => {
        setPreviewImageUrl('')
    }

    const handleClose = () => {
        // remove editEventForm from local storage
        localStorage.removeItem('editEventForm')
        reset()

        navigate('/profile/events');
    }

    useEffect(() => {
        if (event_data) {
            reset({
                eventname: event_data?.data?.eventname || '',
                place_id: event_data?.data?.place_id || '',
                formatted_address: event_data?.data?.formatted_address || '',
                eventdate: format(new Date(event_data?.data?.eventdate), "yyyy-MM-dd") || '',
                eventstart: reformatTime(event_data?.data?.eventstart) || '',
                eventend: reformatTime(event_data?.data?.eventend) || '',
                // eventmedia: event_data?.data?.eventmedia || '',
                details: event_data?.data?.details || '',
                host_business: hostBusinessDefault || null,
            });
            setPreviewImageUrl(`${process.env.REACT_APP_BACKEND_IMAGE_URL}${event_data?.data?.eventmedia}`)
        }
    }, [event_data, reset, hostBusinessDefault])

    useEffect(() => {
        if(isError || isEventError) {
            navigate('/')
        }
    }, [isError, isEventError, navigate])

    if (isPending && isEventPending) {
        return <LoadingSpinner />
    }


    return (
        <EditEventFormStyles>
            <Helmet>
                <title>CVSC - Edit Event</title>
            </Helmet>
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
                        <TbCameraPlus onClick={handleCameraClick} className='siteIcons' style={{ color: 'var(--text-color)' }}/>
                    </label>

                </div>
                {errors.eventname ? <div className='errormessage'>{errors.eventname?.message}</div> : null}
                {errors.eventmedia ? <div className='errormessage imageError'>{errors.eventmedia?.message}</div>: null}
                    
                <div className='formImagePreviewWrapper'>
                    {
                        previewImageUrl
                            ? (
                                <div className='imagePreview eventImage'>
                                    <img src={previewImageUrl || `${process.env.REACT_APP_BACKEND_IMAGE_URL}${event_data?.data?.eventmedia}`} alt={event_data?.data?.eventname} />
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
                    currentValue={event_data?.data?.formatted_address}
                />

                {/* EVENT DATE */}
                <div className='dateTimeInputWrapper'>
                    <label htmlFor='eventdate'><FaRegCalendarDays className='siteIcons' /></label>
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
                    <label htmlFor='eventstart'><FaRegClock className='siteIcons' /></label>
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
                    <label htmlFor='eventend'><FaRegClock className='siteIcons' /></label>
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
                                onChange={(selectedOption) => {
                                    field.onChange(selectedOption);
                                    setValue('host_business', selectedOption, { shouldDirty: true });
                                }}
                            />
                        )}
                    />
                    {errors.host_business && <div className='errormessage'>{errors.host_business.message}</div>}
                </div>

                {/* EVENT DETAILS */}
                <div className='inputWrapper'>
                    <textarea {...register('details', {
                        minLength: {
                            value: 30,
                            message: 'event details must have at least 30 characters'
                        },
                        maxLength: {
                            value: 1000,
                            message: 'event details are too long'
                        }
                    })} rows='8' onClick={() => clearErrors('details')} />
                    {errors.details ? <div className='errormessage'>{errors.details?.message}</div> : null}
                </div>
                
                <div className='formButtonWrapper'>
                    <button className='formButton' type='submit' disabled={(!isDirty || Object.keys(dirtyFields).length === 0)}>Update</button>
                    <button className='formButton' type='button' onClick={sendEventDelete}>Delete</button>
                    <button className='formButton' type='button' onClick={handleClose}>Close</button>
                </div>

            </form>
        </EditEventFormStyles>
    )
}

export default EventEditForm;
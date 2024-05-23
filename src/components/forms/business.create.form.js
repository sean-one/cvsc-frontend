import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import styled from 'styled-components'

import useNotification from '../../hooks/useNotification';
import { FaXTwitter, FaInstagram, FaPhone } from 'react-icons/fa6';
import { TbWorldWww, TbCameraPlus } from 'react-icons/tb';
import { emailformat, instagramFormat, phoneFormat, twitterFormat, websiteFormat } from '../forms/utils/form.validations';
import { useCreateBusinessMutation } from '../../hooks/useBusinessApi';

import ImageUploadAndCrop from '../../helpers/imageUploadAndCrop';
import AddressForm from './address.form';

const BusinessCreateFormStyles = styled.div`
    label {
        padding-bottom: 0.75rem;
        align-self: flex-end;
    }

    .businessCreateFormContactHeader {
        padding: 1rem 0;
        color: var(--main-highlight-color);
    }
`;

const BusinessCreateForm = () => {
    const [ croppedImage, setCroppedImage ] = useState(null);
    const [ previewImageUrl, setPreviewImageUrl ] = useState('');
    const [ formattedAddress, setFormattedAddress ] = useState('')
    const { dispatch } = useNotification();
    const { mutateAsync: createBusiness } = useCreateBusinessMutation()

    const { register, handleSubmit, reset, clearErrors, setError, setValue, formState: { errors } } = useForm({
        mode: 'onBlur',
        defaultValues: {
            business_name: null,
            business_email: null,
            business_avatar: '',
            business_description: null,
            business_instagram: '',
            business_website: '',
            business_twitter: '',
            place_id: null,
            formatted_address: formattedAddress,

        }
    });

    const onImageCropped = useCallback((croppedBlob) => {
        setCroppedImage(croppedBlob);

        const previewImageURL = URL.createObjectURL(croppedBlob)
        setPreviewImageUrl(previewImageURL)

        let business_avatar = new File([croppedBlob], 'business_avatar.jpeg', { type: croppedBlob.type })
        // React Hook Form for handling cropped image
        setValue('business_avatar', business_avatar); // This allows you to include the cropped image in the form data
    }, [setValue]);

    let navigate = useNavigate();

    const handleCameraClick = () => {
        setPreviewImageUrl('')
    }

    const create_business = async (business_data) => {
        localStorage.setItem('createBusinessForm', JSON.stringify(business_data));
        try {
            const formData = new FormData()

            // check for current canvas and set it to formData
            if(croppedImage) {
                formData.set('business_avatar', business_data.business_avatar[0])
            } else {
                throw new Error('missing_image')
            }

            // clean phone number to consist of 10 numbers only
            if(business_data.business_phone !== undefined) {
                business_data.business_phone = business_data.business_phone.replace(/\D/g, '').slice(-10)
            }

            // remove any empty strings and append to formData
            // also removes the @ symbol from the front of any inputs (twitter & instagram) if they are present
            Object.keys(business_data).forEach((key) => {
                let value = business_data[key]
                
                if(value !== '' && value !== null) {
                    if(typeof value === 'string' && value.startsWith('@')) {
                        value = value.slice(1)
                    }

                    formData.append(key, value)
                }
            })

            const new_business = await createBusiness(formData)

            if (new_business.status === 201) {
                // clear the setEditImage & reset the create business form
                reset()

                // navigate to the newly created business page
                navigate(`/business/${new_business?.data.id}`)

            }

        } catch (error) {
            // missing required business branding logo image
            if (error.message === 'missing_image') {
                setError('business_avatar', {
                    message: 'business logo is required'
                }, { shouldFocus: true })
            }
            // form data is incorrectly formatted, missing, or invalid
            else if (error?.response?.status === 400) {
                if (error?.response?.data?.error?.type === 'server') {
                    dispatch({
                        type: "ADD_NOTIFICATION",
                        payload: {
                            notification_type: 'ERROR',
                            message: error?.response?.data?.error?.message
                        }
                    })
                } else if (error?.response?.data?.error?.type === 'media_error') {
                    setError('business_avatar', {
                        message: error.response.data.error.message
                    }, { shouldFocus: true })
                } else {
                    setError(`${error.response.data.error.type}`, {
                        message: error.response.data.error.message
                    }, { shouldFocus: true })
                } 
            }
            else { console.error(`uncaught error: ${error}`) }
        }
    }

    const handleClose = () => {
        // remove create business form save from localhost & go back
        localStorage.removeItem('createBusinessForm')
        navigate('/profile')
    }

    useEffect(() => {
        // check for saved form in local storage
        const savedFormData = localStorage.getItem('createBusinessForm');
        
        // if found set values to values saved in local storage
        if (savedFormData) {
            const parsedData = JSON.parse(savedFormData);
            for (let key in parsedData) {
                setValue(key, parsedData[key]);
            }
            if (parsedData.formatted_address) {
                setFormattedAddress(parsedData.formatted_address)
            }
        }
    }, [setValue, setFormattedAddress])


    return (
        <BusinessCreateFormStyles>
            <form onSubmit={handleSubmit(create_business)} encType='multipart/form-data' className='standardForm'>
                {/* once image has been created it will show here */}
                <div className='formImagePreviewWrapper'>
                    {
                        previewImageUrl
                            ? ( <div className='imagePreview businessImage'>
                                <img src={previewImageUrl} alt='business branding' />
                            </div>
                            ) : (
                                <ImageUploadAndCrop
                                    onImageCropped={onImageCropped}
                                    registerInput={register}
                                    imageShape='round'
                                    registerName='business_avatar'
                                />
                            )
                    }
                </div>

                {/* BUSINESS NAME */}
                <div className='inputWrapper'>
                    <input {...register('business_name', {
                        required: 'business name is required',
                        minLength: {
                            value: 4,
                            message: 'business name must be at least 4 characters'
                        },
                        maxLength: {
                            value: 50,
                            message: 'business name too long'
                        }
                    })} onClick={() => clearErrors('business_name')} type='text' placeholder='Business Name' />
                    {errors.business_name ? <div className='errormessage'>{errors.business_name?.message}</div> : null}
                </div>
                
                <div className='formRowInputIcon'>
                    {/* EMAIL */}
                    <div className='inputWrapper'>
                        <input {...register('business_email', {
                            required: 'business email required',
                            pattern: {
                                value: emailformat,
                                message: 'invalid email format'
                            }
                        })} type='text' onClick={() => clearErrors('business_email')} placeholder='Email' />
                    </div>

                    {/* BUSINESS AVATAR UPLOAD */}
                    <label htmlFor='business_avatar' className='inputLabel' onClick={() => clearErrors('business_avatar')}>
                        <TbCameraPlus onClick={handleCameraClick} className='siteIcons' />
                    </label>
                </div>
                {errors.business_email ? <div className='errormessage'>{errors.business_email?.message}</div> : null}
                {errors.business_avatar ? <div className='errormessage imageError'>{errors.business_avatar?.message}</div> : null}

                {/* BUSINESS DESCRIPTION */}
                <div className='inputWrapper'>
                    <textarea {...register('business_description', {
                        required: 'business description is required',
                        minLength: {
                            value: 100,
                            message: 'business description is too short'
                        },
                        maxLength: {
                            value: 1000,
                            message: 'business description is too long'
                        }
                    })} rows='8' onClick={() => clearErrors('business_description')} placeholder='Business details' />
                    {errors.business_description ? <div className='errormessage'>{errors.business_description?.message}</div> : null}
                </div>

                <AddressForm
                    register={register}
                    setValue={setValue}
                    errors={errors}
                    clearErrors={clearErrors}
                    currentValue={formattedAddress}
                />

                <div className='subheaderText businessCreateFormContactHeader'>Business Contacts & Social Media:</div>
                {/* INSTAGRAM */}
                <div className='inputWrapper'>
                    <label htmlFor='business_instagram' className='contactLabelWrapper'>
                        <FaInstagram className='siteIcons' />
                        <input {...register('business_instagram', {
                            pattern: {
                                value: instagramFormat,
                                message: 'invalid Instagram format'
                            }
                        })} type='text' onClick={() => clearErrors('business_instagram')} placeholder='@Instagram' />
                    </label>
                    {errors.business_instagram ? <div className='errormessage'>{errors.business_instagram?.message}</div> : null}
                </div>

                {/* WEBSITE */}
                <div className='inputWrapper'>
                    <label htmlFor='business_website' className='contactLabelWrapper'>
                        <TbWorldWww className='siteIcons' />
                        <input {...register('business_website', {
                            pattern: {
                                value: websiteFormat,
                                message: 'invalid website format'
                            }
                        })} type='text' onClick={() => clearErrors('business_website')} placeholder='https://www.website.com' />
                    </label>
                    {errors.business_website ? <div className='errormessage'>{errors.business_website?.message}</div> : null}
                </div>
                
                {/* PHONE NUMBER */}
                <div className='inputWrapper'>
                    <label htmlFor='business_phone' className='contactLabelWrapper'>
                        <FaPhone className='siteIcons' />
                        <input {...register('business_phone', {
                            pattern: {
                                value: phoneFormat,
                                message: 'invalid phone number format'
                            }
                        })} type='text' onClick={() => clearErrors('business_phone')} placeholder='(760)555-0420' />
                    </label>
                    {errors.business_phone ? <div className='errormessage'>{errors.business_phone?.message}</div> : null}
                </div>
                
                {/* TWITTER */}
                <div className='inputWrapper'>
                    <label htmlFor='business_twitter' className='contactLabelWrapper'>
                        <FaXTwitter className='siteIcons' />
                        <input {...register('business_twitter', {
                            pattern: {
                                value: twitterFormat,
                                message: 'invalid Twitter format'
                            }
                        })} type='text' onClick={() => clearErrors('business_twitter')} placeholder='@Twitter' />
                    </label>
                    {errors.business_twitter ? <div className='errormessage'>{errors.business_twitter?.message}</div> : null}
                </div>

                {errors.server ? <div className='errormessage'>{errors.server?.message}</div> : null}
                
                <div className='formButtonWrapper'>
                    <button className='formButton' type='submit'>Create</button>
                    <button className='formButton' onClick={handleClose}>Close</button>
                </div>

            </form>
        </BusinessCreateFormStyles>
    )
}

export default BusinessCreateForm;
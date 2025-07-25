import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { decode } from 'he';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';

import { useUpdateBusinessMutation, useBusinessQuery } from '../../hooks/useBusinessApi';
import useNotification from '../../hooks/useNotification';
import { FaXTwitter, FaInstagram, FaPhone } from 'react-icons/fa6';
import { TbWorldWww, TbCameraPlus } from 'react-icons/tb';
import { emailformat, instagramFormat, normalizeWebsiteUrl, phoneFormat, twitterFormat, validateWebsiteUrl } from './utils/form.validations';

import LoadingSpinner from '../loadingSpinner';
import AddressForm from './address.form';
import ImageUploadAndCrop from '../../helpers/imageUploadAndCrop';

const BusinessEditFormStyles = styled.div`
    .businessImageWrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 0 0.375rem;
        padding: 2.25rem 0.75rem;
    }

    .businessEditFormHeader {
        color: var(--main-highlight-color);
    }

    .businessEditFormContactHeader {
        color: var(--main-highlight-color);
        padding: 1rem 0;
    }
`;

const BusinessEditForm = ({ userBusinessRole }) => {
    const [ croppedImage, setCroppedImage ] = useState(null);
    const [ previewImageUrl, setPreviewImageUrl ] = useState('');
    const { business_id } = useParams()
    const { dispatch } = useNotification()

    const { mutateAsync: updateBusiness } = useUpdateBusinessMutation()
    const { data: business_data, isPending, isError } = useBusinessQuery(business_id)
    
    let navigate = useNavigate()

    const { register, handleSubmit, clearErrors, reset, watch, setValue, setError, formState: { isDirty, dirtyFields, errors } } = useForm({
        mode: 'onBlur',
        defaultValues: {
            business_avatar: null,
            remove_address: false
        }
    })

    const onImageCropped = useCallback((croppedBlob) => {
        setCroppedImage(croppedBlob);

        const previewImageURL = URL.createObjectURL(croppedBlob)
        setPreviewImageUrl(previewImageURL)

        let business_avatar = new File([croppedBlob], 'business_avatar.jpeg', { type: croppedBlob.type })
        // React Hook Form for handling cropped image
        setValue('business_avatar', business_avatar, { shouldDirty: true }); // This allows you to include the cropped image in the form data
    }, [setValue]);

    const handleCameraClick = () => {
        setPreviewImageUrl('')
    }

    const addressStrike = watch('remove_address');

    const update_business = async (business_updates) => {
        localStorage.setItem('editBusinessForm', JSON.stringify(business_updates))
        try {
            const formData = new FormData()
            
            if (croppedImage) {
                formData.set('business_avatar', business_updates.business_avatar[0])
            } else {
                delete business_updates.business_avatar;
            }

            // remove entries that are unchanged
            for (const [key] of Object.entries(business_updates)) {
                if (!Object.keys(dirtyFields).includes(key)) {
                    delete business_updates[key]
                }
            }

            // clean instagram format to check for and remove @ symbol
            // mark to be removed if input chnaged from data to empty string
            if (business_updates.business_instagram !== undefined) {
                if (business_updates.business_instagram === '') {
                    delete business_updates.business_instagram
                    business_updates.remove_instagram = true
                } else if (typeof business_updates.business_instagram === 'string' && business_updates.business_instagram.startsWith('@')) {
                    business_updates.business_instagram = business_updates.business_instagram.slice(1)
                }
            }

            // clean phone number to consist of 10 numbers only
            // mark to be removed if input changed from data to empty string
            if (business_updates.business_phone !== undefined) {
                if (business_updates.business_phone === '') {
                    delete business_updates.business_phone
                    business_updates.remove_phone = true
                } else {
                    business_updates.business_phone = business_updates.business_phone.replace(/\D/g, '').slice(-10)
                }
            }

            // normalize website url if present
            // mark to be removed if input changed form data to empty string
            if (business_updates.business_website !== undefined) {
                if (business_updates.business_website === '') {
                    delete business_updates.business_website
                    business_updates.remove_website = true;
                } else {
                    business_updates.business_website = normalizeWebsiteUrl(business_updates.business_website)
                }
            }

            if (business_updates.business_twitter !== undefined) {
                if (business_updates.business_twitter === '') {
                    delete business_updates.business_twitter
                    business_updates.remove_twitter = true
                } else if (typeof business_updates.business_twitter === 'string' && business_updates.business_twitter.startsWith('@')) {
                    business_updates.business_twitter = business_updates.business_twitter.slice(1)
                }
            }

            // append eveything left changed to formData
            Object.keys(business_updates).forEach(key => {
                let value = business_updates[key]

                formData.append(key, value)
            })
            await updateBusiness({ business_updates: formData, business_id: business_id })

        } catch (error) {
            // incorrectly formated, missing or invalid data
            if(error?.response?.status === 400) {
                if (error?.response?.data?.error?.type === 'server') {
                    dispatch({
                        type: "ADD_NOTIFICATION",
                        payload: {
                            notification_type: 'ERROR',
                            message: error?.response?.data?.error?.message
                        }
                    })
                } else if (error?.response?.data?.error?.type === 'media_error') {
                    setError(`business_avatar`, {
                        message: error?.response?.data?.error?.message
                    }, { shouldFocus: true })

                } else {
                    setError(`${error?.response?.data?.error?.type}`, {
                        message: error?.response?.data?.error?.message
                    }, { shouldFocus: true })
                }
            }

            else { console.error(`uncaught error: ${error}`) }
        }

    }

    const handleClose = () => {
        reset()

        navigate(`/business/${business_id}`)
    }

    useEffect(() => {
        if (business_data) {
            reset({
                business_email: business_data.data?.business_email,
                business_description: decode(business_data.data?.business_description),
                place_id: business_data.data?.place_id || '',
                formatted_address: business_data.data?.formatted_address || '',
                business_instagram: business_data.data?.business_instagram || '',
                business_website: business_data.data?.business_website || '',
                business_phone: business_data.data?.business_phone || '',
                business_twitter: business_data.data?.business_twitter || '',
                remove_address: false
            });
            setPreviewImageUrl(`${process.env.REACT_APP_BACKEND_IMAGE_URL}${business_data?.data?.business_avatar}`);
        }
    }, [business_data, reset])

    useEffect(() => {
        if (isError) {
            navigate('/businesses')
        }
    }, [isError, navigate])

    if (isPending) {
        return <LoadingSpinner />
    }


    return (
        <BusinessEditFormStyles>
            <Helmet>
                <title>CVSC - Edit Business</title>
            </Helmet>
            <form onSubmit={handleSubmit(update_business)} encType='multipart/form-data' className='standardForm'>
                <div className='formRowInputIcon'>
                    <div className='headerText businessEditFormHeader'>{decode(business_data?.data?.business_name)}</div>
                    {/* BUSINESS AVATAR UPLOAD */}
                    <label htmlFor='business_avatar' className='inputLabel removeInputLabelPadding' onClick={() => clearErrors('business_avatar')}>
                        <TbCameraPlus onClick={handleCameraClick} className='siteIcons' />
                    </label>
                </div>

                <div className='formImagePreviewWrapper'>
                    {
                        previewImageUrl
                            ? (
                                <div className='imagePreview businessImage'>
                                    <img
                                        src={previewImageUrl || `${process.env.REACT_APP_BACKEND_IMAGE_URL}${business_data?.data?.business_avatar}`}
                                        alt={decode(business_data?.data?.business_name)}
                                    />
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
                

                <div className='formRowInputIcon'>
                    {/* EMAIL - ADMIN ONLY allowed to update */}
                    {
                        (userBusinessRole?.role_type === 'admin') &&
                            <div className='inputWrapper'>
                                <input {...register('business_email', {
                                    pattern: {
                                        value: emailformat,
                                        message: 'invalid email format'
                                    }
                                })} type='text' onClick={() => clearErrors('business_email')} />
                                {errors.business_email ? <div className='errormessage'>{errors.business_email?.message}</div> : null}
                            </div>
                    }

                </div>

                {/* BUSINESS DESCRIPTION */}
                <div className='inputWrapper'>
                    <textarea {...register('business_description', {
                        minLength: {
                            value: 100,
                            message: 'business description is too short'
                        },
                        maxLength: {
                            value: 1000,
                            message: 'business description is too long'
                        }
                    })} rows='8' onClick={() => clearErrors('business_description')} />
                    {errors.business_description ? <div className='errormessage'>{errors.business_description?.message}</div> : null}
                </div>

                {/* ADDRESS INPUT */}
                {
                    (userBusinessRole?.role_type === 'admin') &&
                        <AddressForm
                            register={register}
                            setValue={setValue}
                            clearErrors={clearErrors}
                            errors={errors}
                            strikethrough={addressStrike}
                            currentValue={business_data?.data?.formatted_address}
                        />
                }
                
                <div className='subheaderText businessEditFormContactHeader'>Contacts & Social Media:</div>
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
                            validate: validateWebsiteUrl,
                            // pattern: {
                            //     value: websiteFormat,
                            //     message:  "must be in 'https://www.yourwebsite.com' format"
                            // }
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
                    <button className='formButton' type='submit' disabled={(!isDirty || Object.keys(dirtyFields).length === 0)}>Update</button>
                    <button className='formButton' type='button' onClick={handleClose}>Close</button>
                </div>

            </form>
        </BusinessEditFormStyles>
    )
}

export default BusinessEditForm;
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';

import { image_link } from '../../helpers/dataCleanUp';
import useImagePreview from '../../hooks/useImagePreview';
import { setImageForForm } from '../../helpers/setImageForForm';
import { useUpdateBusinessMutation } from '../../hooks/useBusinessApi';
import useNotification from '../../hooks/useNotification';
import { AddImageIcon, InstagramIcon, WebSiteIcon, FacebookIcon, PhoneIcon, TwitterIcon } from '../icons/siteIcons';
import { emailformat, instagramFormat, websiteFormat, facebookFormat, phoneFormat, twitterFormat } from './utils/form.validations';
import AxiosInstance from '../../helpers/axios';

import AddressForm from './address.form';

const BusinessEditFormStyles = styled.div`
    .businessImageWrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 0 0.375rem;
        padding: 2.25rem 0.75rem;
    }

    .businessImage {
        position: relative;
        min-width: 225px;
        max-width: 450px;

        canvas {
            max-width: 100%;
            border: 1px solid var(--trim-color);
            display: block;
            border-radius: 50%;
        }
        
        img {
            width: 100%;
            border: 1px solid var(--trim-color);
            display: block;
            border-radius: 50%;
        }}
    
    .editImageButton {
        position: absolute;
        right: 15%;
        bottom: 0;
        border: 1px solid var(--secondary-color);
        border-radius: 50%;
        color: var(--trim-color);
        background-color: var(--main-color);
        padding: 0.75rem;
    }
`;

const BusinessEditForm = ({ userBusinessRole }) => {
    const [ businessData, setBusinessData ] = useState(null)
    const { business_id } = useParams()
    const { dispatch } = useNotification()

    const { mutateAsync: updateBusiness } = useUpdateBusinessMutation()
    
    const { editImage, imagePreview, canvas, setEditImage } = useImagePreview()

    let navigate = useNavigate()

    const { register, handleSubmit, clearErrors, reset, watch, setValue, setError, formState: { isDirty, dirtyFields, errors } } = useForm({
        mode: 'onBlur',
        defaultValues: {
            business_avatar: null,
            remove_address: false
        }
    })

    const addressStrike = watch('remove_address');

    const update_business = async (business_updates) => {
        localStorage.setItem('editBusinessForm', JSON.stringify(business_updates))
        try {
            const formData = new FormData()
            
            // remove entries that are unchanged
            for (const [key] of Object.entries(business_updates)) {
                if (!Object.keys(dirtyFields).includes(key)) {
                    delete business_updates[key]
                }
            }

            // clean phone number to consist of 10 numbers only
            if (business_updates.business_phone !== undefined) {
                business_updates.business_phone = business_updates.business_phone.replace(/\D/g, '').slice(-10)
            }
            // if current cavas set image to business_avatar if not do nothing
            if (canvas.current !== null) {
                let business_avatar = setImageForForm(canvas)
                formData.set('business_avatar', business_avatar)
            }

            // append eveything left changed to formData
            Object.keys(business_updates).forEach(key => {
                let value = business_updates[key]

                if(value !== '') {
                    if(typeof value === 'string' && value.startsWith('@')) {
                        value = value.slice(1)
                    }

                    formData.append(key, value)
                }
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

            else { console.log(`uncaught error: ${error}`) }
        }

    }

    const handleClose = () => {
        setEditImage(false)
        reset()

        navigate(`/business/${business_id}`)
    }

    useEffect(() => {
        const getBusinessDetails = async () => {
            try {
                const businessResponse = await AxiosInstance.get(`/businesses/${business_id}`)

                setBusinessData(businessResponse.data)

                reset({
                    business_email: businessResponse.data?.business_email,
                    business_description: businessResponse.data?.business_description,
                    place_id: businessResponse.data?.place_id || '',
                    formatted_address: businessResponse.data?.formatted_address,
                    business_instagram: businessResponse.data?.business_instagram || '',
                    business_website: businessResponse.data?.business_website || '',
                    business_facebook: businessResponse.data?.business_facebook || '',
                    business_phone: businessResponse.data?.business_phone || '',
                    business_twitter: businessResponse.data?.business_twitter || '',
                    remove_address: false
                })
            } catch (error) {
                console.log(error)
            }
        }

        getBusinessDetails()
    }, [business_id, reset])


    console.log(businessData)
    return (
        <BusinessEditFormStyles>
            <div>
                <form onSubmit={handleSubmit(update_business)} encType='multipart/form-data' className='standardForm'>
                    <h1>{businessData?.business_name}</h1>
                    
                    <div className='businessImageWrapper'>
                        <div className='businessImage'>
                            {
                                editImage
                                    ? <canvas
                                        // className=''
                                        id={'avatarImagePreview'}
                                        ref={canvas}
                                    />
                                    : <img
                                        // className=''
                                        src={image_link(businessData?.business_avatar)}
                                        alt={businessData?.business_name}
                                    />
                            }
                            {/* BUSINESS AVATAR UPLOAD */}
                            <div className='editImageButton'>
                                <label htmlFor='business_avatar' className='inputLabel removeInputLabelPadding' onClick={() => clearErrors('business_avatar')}>
                                    <AddImageIcon />
                                    <input {...register('business_avatar')} id='business_avatar' className='inputLabelInput' type='file' accept='image/*' onChange={(e) => imagePreview(e)} />
                                </label>
                            </div>
                        </div>

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
                                currentValue={businessData?.formatted_address}
                            />
                    }
                    
                    <div className='subheaderText'>Contacts & Social Media:</div>
                    {/* INSTAGRAM */}
                    <div className='inputWrapper'>
                        <label htmlFor='business_instagram' className='contactLabelWrapper'>
                            <InstagramIcon />
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
                            <WebSiteIcon />
                            <input {...register('business_website', {
                                pattern: {
                                    value: websiteFormat,
                                    message: 'invalid website format'
                                }
                            })} type='text' onClick={() => clearErrors('business_website')} placeholder='https://www.website.com' />
                        </label>
                        {errors.business_website ? <div className='errormessage'>{errors.business_website?.message}</div> : null}
                    </div>

                    {/* FACEBOOK */}
                    <div className='inputWrapper'>
                        <label htmlFor='business_facebook' className='contactLabelWrapper'>
                            <FacebookIcon />
                            <input {...register('business_facebook', {
                                pattern: {
                                    value: facebookFormat,
                                    message: 'only need username portion (exp. https://www.facebook.com/{USERNAME}'
                                }
                            })} type='text' onClick={() => clearErrors('business_facebook')} placeholder='Facebook username' />
                        </label>
                        {errors.business_facebook ? <div className='errormessage'>{errors.business_facebook?.message}</div> : null}
                    </div>

                    {/* PHONE NUMBER */}
                    <div className='inputWrapper'>
                        <label htmlFor='business_phone' className='contactLabelWrapper'>
                            <PhoneIcon />
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
                            <TwitterIcon />
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
                        <button type='submit' disabled={(!isDirty || Object.keys(dirtyFields).length === 0) && (canvas.current === null)}>Update</button>
                        <button type='button' onClick={handleClose}>Close</button>
                    </div>

                </form>
            </div>
        </BusinessEditFormStyles>
    )
}

export default BusinessEditForm;
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
import { businessTypeList, emailformat, instagramFormat, websiteFormat, facebookFormat, phoneFormat, twitterFormat } from './form.validations';

import AddressForm from './address.form';
import AxiosInstance from '../../helpers/axios';

const BusinessEditFormStyles = styled.div`
`;

const BusinessEditForm = () => {
    const [ businessData, setBusinessData ] = useState(null)
    const { business_id } = useParams()
    const { dispatch } = useNotification()

    const { mutateAsync: updateBusiness } = useUpdateBusinessMutation()
    
    const { editImage, imagePreview, canvas, setEditImage } = useImagePreview()

    let navigate = useNavigate()

    const { register, handleSubmit, clearErrors, reset, setValue, setError, formState: { isDirty, dirtyFields, errors } } = useForm({
        mode: 'onBlur',
    })

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

            const update_response = await updateBusiness({ business_updates: formData, business_id: business_id })
            
            if (update_response.status === 201) {
                // remove saved form from local storage
                localStorage.removeItem('editBusinessForm')

                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'SUCCESS',
                        message: `${update_response.data.business_name} has been updated`

                    }
                })

                navigate(`/business/${update_response.data.id}`)
            }

        } catch (error) {
            console.log(error.response)
            // missing all or portion of address
            if(error.message === 'location_required') {
                setError('address', {
                    message: 'address is required for business venues'
                })
            }
            // incorrectly formated, missing or invalid data
            else if(error.response.status === 400) {
                setError(`${error.response.data.error.type}`, {
                    message: error.response.data.error.message
                }, { shouldFocus: true })
            }
            // missing, expired, or invalid token
            else if(error.response.status === 401) {
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'ERROR',
                        message: error.response.data.error.message
                    }
                })

                navigate('/login', { state: { from: `/business/admin/${business_id}` } })

                return null
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
                    business_avatar: '',
                    business_type: businessResponse.data?.business_type,
                    business_instagram: businessResponse.data?.business_instagram || '',
                    business_website: businessResponse.data?.business_website || '',
                    business_facebook: businessResponse.data?.business_facebook || '',
                    business_phone: businessResponse.data?.business_phone || '',
                    business_twitter: businessResponse.data?.business_twitter || '',
                })
                
            } catch (error) {
                console.log(error)
            }
        }

        getBusinessDetails()

    }, [business_id, reset])


    return (
        <BusinessEditFormStyles>
            <div>
                <form onSubmit={handleSubmit(update_business)} encType='multipart/form-data' className='standardForm'>
                    <h1>{businessData?.business_name}</h1>
                    
                    <div className='formImage formCirclePreview'>
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
                    </div>

                    <div className='formRowInputIcon'>
                        {/* EMAIL - ADMIN ONLY allowed to update */}
                        <div className='inputWrapper'>
                            <input {...register('business_email', {
                                pattern: {
                                    value: emailformat,
                                    message: 'invalid email format'
                                }
                            })} type='text' onClick={() => clearErrors('business_email')} />
                            {errors.business_email ? <div className='errormessage'>{errors.business_email?.message}</div> : null}
                        </div>

                        {/* BUSINESS AVATAR UPLOAD */}
                        <label htmlFor='business_avatar' className='inputLabel' onClick={() => clearErrors('business_avatar')}>
                            <AddImageIcon />
                            <input {...register('business_avatar')} id='business_avatar' className='inputLabelInput' type='file' accept='image/*' onChange={(e) => imagePreview(e)} />
                        </label>
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

                    {/* BUSINESS TYPE SELECTOR - ADMIN ONLY allowed to update */}
                    <div className='inputWrapper'>
                        <select {...register('business_type', {
                            pattern: {
                                value: businessTypeList,
                                message: 'invalid business type'
                            }
                        })} onClick={() => clearErrors('business_type')}>
                            <option value='brand'>Brand</option>
                            <option value='venue'>Dispensary</option>
                            <option value='both'>{`Brand & Dispensary`}</option>
                        </select>
                        {errors.business_type ? <div className='errormessage'>{errors.business_type?.message}</div> : null}
                    </div>

                    {/* ADDRESS INPUT - ADMIN ONLY allowed to update */}
                    <AddressForm
                        register={register}
                        setValue={setValue}
                        clearErrors={clearErrors}
                        errors={errors}
                        businessValue={businessData?.formatted_address}
                    />
                    
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
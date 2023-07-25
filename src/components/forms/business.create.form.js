import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import styled from 'styled-components'

import useAuth from '../../hooks/useAuth';
import { businessTypeList, emailformat, facebookFormat, instagramFormat, phoneFormat, twitterFormat, websiteFormat } from '../forms/form.validations';
import { useCreateBusinessMutation } from '../../hooks/useBusinessApi';
import useNotification from '../../hooks/useNotification';
import useImagePreview from '../../hooks/useImagePreview';
import { setImageForForm } from '../../helpers/setImageForForm';
import { AddImageIcon, AddLocationIcon, RemoveLocationIcon, InstagramIcon, WebSiteIcon, FacebookIcon, PhoneIcon, TwitterIcon } from '../icons/siteIcons';

import AddressForm from './address.form';

const BusinessCreateFormStyles = styled.div`
`;

const BusinessCreateForm = () => {
    const { auth, logout_user, setAuth } = useAuth()
    const { editImage, imagePreview, canvas, setEditImage } = useImagePreview()
    const { mutateAsync: createBusiness } = useCreateBusinessMutation()
    const { dispatch } = useNotification()

    const { register, handleSubmit, watch, reset, clearErrors, setError, setValue, formState: { errors } } = useForm({
        mode: 'onBlur',
        defaultValues: {
            business_name: null,
            business_email: null,
            business_avatar: '',
            business_description: null,
            business_type: 'brand',
            business_instagram: '',
            business_facebook: '',
            business_website: '',
            business_twitter: ''

        }
    });

    const business_location = watch('business_location', false);
    const watchBusinessType = watch('business_type')

    let navigate = useNavigate();

    const create_business = async (business_data) => {
        try {
            const formData = new FormData()

            // check for current canvas and set it to formData
            if(canvas.current === null) {
                throw new Error('missing_image')
            } else {
                let business_avatar = setImageForForm(canvas)

                formData.set('business_avatar', business_avatar)
            }

            // delete business_location boolean - no longer needed
            delete business_data.business_location

            // check business type and confirm business address when required
            if (business_data.business_type === 'both' || business_data.business_type === 'venue' && !business_data.place_id) {
                // if business type is not brand business address is required
                throw new Error('location_required')
            }

            // clean phone number to consist of 10 numbers only
            if(business_data.business_phone !== undefined) {
                business_data.business_phone = business_data.business_phone.replace(/\D/g, '').slice(-10)
            }

            // remove any empty strings and append to formData
            // also removes the @ symbol from the front of any inputs (twitter & instagram) if they are present
            Object.keys(business_data).forEach((key) => {
                let value = business_data[key]
                
                if(value !== '') {
                    if(typeof value === 'string' && value.startsWith('@')) {
                        value = value.slice(1)
                    }

                    formData.append(key, value)
                }
            })

            const new_business = await createBusiness(formData)

            if (new_business.status === 201) {

                // add new business to user auth roles
                setAuth({ ...auth, roles: [
                    ...auth.roles, 
                    { 
                        active_role: true,
                        business_id: new_business.data.id,
                        business_name: new_business.data.business_name,
                        id: new_business.data.admin_role_id,
                        role_type: new_business.data.role_type,
                    }
                ]})

                // alert user of successful business creation
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'SUCCESS',
                        message: `${new_business.data.business_name} business request submitted`
                    }
                })

                // clear the setEditImage & reset the create business form
                setEditImage(false)
                reset()

                // navigate to the newly created business page
                navigate(`/business/${new_business.data.id}`)

            }

        } catch (error) {
            // missing required business branding logo image
            if (error.message === 'missing_image') {
                setError('business_avatar', {
                    message: 'business brand logo is required'
                }, { shouldFocus: true })
            }
            // business type was venue or both but did not include required address components
            else if (error.message === 'location_required') {
                setError('address', {
                    message: 'address required for business venues'
                })
            }
            // invalid business type attempted to be submitted
            else if (error.message === 'invalid_business_type') {
                setError('business_type', {
                    message: 'invalid business type'
                }, { shouldFocus: true })
            }
            // 
            else if (error.response.status === 400) {
                setError(`${error.response.data.error.type}`, {
                    message: error.response.data.error.message
                }, { shouldFocus: true })
            }

            else if (error.response.status === 401) {
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'ERROR',
                        message: error.response.data.error.message
                    }
                })

                logout_user()
            }

            else {
                console.log(`uncaught error: ${error}`)
            }

        }

    }

    useEffect(() => {
        if (watchBusinessType !== 'brand') {
            setValue('business_location', true); // Set business_location to true for non-'brand' type
        } else {
            setValue('business_location', false); // Reset business_location for 'brand' type
            setValue('place_id', ''); // Reset place_id field when business_type changes to 'brand'
        }
    }, [watchBusinessType, setValue])


    return (
        <BusinessCreateFormStyles>
            <div>
                <form onSubmit={handleSubmit(create_business)} encType='multipart/form-data' className='standardForm'>
                    
                    {/* BUSINESS NAME */}
                    <div className='inputWrapper'>
                        <input {...register('business_name', {
                            required: 'business name is required',
                            minLength: {
                                value: 4,
                                message: 'business name must be at least 4 characters'
                            },
                            maxLength: {
                                value: 25,
                                message: 'business name too long'
                            }
                        })} className='formInput' onClick={() => clearErrors('business_name')} type='text' placeholder='Business Name' />
                        {errors.business_name ? <div className='errormessage'>{errors.business_name?.message}</div> : null}
                    </div>

                    {/* once image has been created it will show here */}
                    {
                        editImage &&
                            <div className='formImage formCirclePreview'>
                                <canvas id={'businessImagePreview'} ref={canvas} />
                            </div>
                    }

                    {errors.business_avatar ? <div className='errormessage'>{errors.business_avatar?.message}</div> : null}
                    <div className='formRowInputIcon'>
                        {/* EMAIL */}
                        <div className='inputWrapper'>
                            <input {...register('business_email', {
                                required: 'business email required',
                                pattern: {
                                    value: emailformat,
                                    message: 'invalid email format'
                                }
                            })} className='formInput' type='text' onClick={() => clearErrors('business_email')} placeholder='Email' />
                            {errors.business_email ? <div className='errormessage'>{errors.business_email?.message}</div> : null}
                        </div>

                        {/* BUSINESS AVATAR UPLOAD */}
                        <label htmlFor='business_avatar' className='formInput inputLabel' onClick={() => clearErrors('business_avatar')}>
                            <AddImageIcon />
                            <input {...register('business_avatar')} id='business_avatar' className='inputLabelInput' type='file' accept='image/*' onChange={(e) => imagePreview(e)} />
                        </label>
                    </div>

                    {/* BUSINESS DESCRIPTION */}
                    <div className='inputWrapper'>
                        <textarea {...register('business_description', {
                            required: 'business description is required'
                        })} className='formInput' rows='8' onClick={() => clearErrors('business_description')} placeholder='Business details' />
                        {errors.business_description ? <div className='errormessage'>{errors.business_description?.message}</div> : null}
                    </div>

                    <div className='formRowInputIcon'>
                        {/* BUSINESS TYPE SELECTOR */}
                        <div className='inputWrapper'>
                            <select {...register('business_type', {
                                required: 'business type required',
                                pattern: {
                                    value: businessTypeList,
                                    message: 'invalid business type'
                                }
                            })} className='formInput' onClick={() => clearErrors('business_type')} type='text'>
                                <option value='brand'>Brand</option>
                                <option value='venue'>Dispensary</option>
                                <option value='both'>{`Brand & Dispensary`}</option>
                            </select>
                            {errors.business_type ? <div className='errormessage'>{errors.business_type?.message}</div> : null}
                        </div>
                        
                        {/* BUSINESS LOCATION CHECKBOX */}
                        <label htmlFor='business_location' className='formInput inputLabel'>
                            {
                                business_location ? <RemoveLocationIcon /> : <AddLocationIcon />
                            }
                            <input
                                {...register('business_location')}
                                id='business_location'
                                className='inputLabelInput'
                                type='checkbox'
                                name='business_location'
                                disabled={watchBusinessType !== 'brand'}
                            />
                        </label>
                    </div>

                    {
                        (business_location) &&
                            <AddressForm register={register} setValue={setValue} errors={errors} clearErrors={clearErrors} />
                    }

                    <div>Business Contacts & Social Media:</div>
                    {/* INSTAGRAM */}
                    <div className='inputWrapper contactWrapper'>
                        <label htmlFor='business_instagram' className='contactLabelWrapper'>
                            <div className='contactIcon'><InstagramIcon /></div>
                            <input {...register('business_instagram', {
                                pattern: {
                                    value: instagramFormat,
                                    message: 'invalid Instagram format'
                                }
                            })} className='formInput' type='text' onClick={() => clearErrors('business_instagram')} placeholder='@Instagram' />
                        </label>
                        {errors.business_instagram ? <div className='errormessage'>{errors.business_instagram?.message}</div> : null}
                    </div>

                    {/* WEBSITE */}
                    <div className='inputWrapper contactWrapper'>
                        <label htmlFor='business_website' className='contactLabelWrapper'>
                            <div className='contactIcon'><WebSiteIcon /></div>
                            <input {...register('business_website', {
                                pattern: {
                                    value: websiteFormat,
                                    message: 'invalid website format'
                                }
                            })} className='formInput' type='text' onClick={() => clearErrors('business_website')} placeholder='https://www.website.com' />
                        </label>
                        {errors.business_website ? <div className='errormessage'>{errors.business_website?.message}</div> : null}
                    </div>
                    
                    {/* FACEBOOK */}
                    <div className='inputWrapper contactWrapper'>
                        <label htmlFor='business_facebook' className='contactLabelWrapper'>
                            <div className='contactIcon'><FacebookIcon /></div>
                            <input {...register('business_facebook', {
                                pattern: {
                                    value: facebookFormat,
                                    message: 'only need username portion (exp. https://www.facebook.com/{USERNAME}'
                                }
                            })} className='formInput' type='text' onClick={() => clearErrors('business_facebook')} placeholder='Facebook username' />
                        </label>
                        {errors.business_facebook ? <div className='errormessage'>{errors.business_facebook?.message}</div> : null}
                    </div>
                    
                    {/* PHONE NUMBER */}
                    <div className='inputWrapper contactWrapper'>
                        <label htmlFor='business_phone' className='contactLabelWrapper'>
                            <div className='contactIcon'><PhoneIcon /></div>
                            <input {...register('business_phone', {
                                pattern: {
                                    value: phoneFormat,
                                    message: 'invalid phone number format'
                                }
                            })} className='formInput' type='text' onClick={() => clearErrors('business_phone')} placeholder='(760)555-0420' />
                        </label>
                        {errors.business_phone ? <div className='errormessage'>{errors.business_phone?.message}</div> : null}
                    </div>
                    
                    {/* TWITTER */}
                    <div className='inputWrapper contactWrapper'>
                        <label htmlFor='business_twitter' className='contactLabelWrapper'>
                            <div className='contactIcon'><TwitterIcon /></div>
                            <input {...register('business_twitter', {
                                pattern: {
                                    value: twitterFormat,
                                    message: 'invalid Twitter format'
                                }
                            })} className='formInput' type='text' onClick={() => clearErrors('business_twitter')} placeholder='@Twitter' />
                        </label>
                        {errors.business_twitter ? <div className='errormessage'>{errors.business_twitter?.message}</div> : null}
                    </div>

                    {errors.server ? <div className='errormessage'>{errors.server?.message}</div> : null}
                    
                    <div className='formButtonWrapper'>
                        <button type='submit'>Create</button>
                        <button onClick={() => navigate(-1)} variant='secondary'>Close</button>
                    </div>

                </form>
            </div>
        </BusinessCreateFormStyles>
    )
}

export default BusinessCreateForm;
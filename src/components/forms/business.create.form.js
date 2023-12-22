import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import styled from 'styled-components'

import { businessTypeList, emailformat, facebookFormat, instagramFormat, phoneFormat, twitterFormat, websiteFormat } from '../forms/form.validations';
import { useCreateBusinessMutation } from '../../hooks/useBusinessApi';
import useImagePreview from '../../hooks/useImagePreview';
import { setImageForForm } from '../../helpers/setImageForForm';
import { AddImageIcon, InstagramIcon, WebSiteIcon, FacebookIcon, PhoneIcon, TwitterIcon } from '../icons/siteIcons';

import AddressForm from './address.form';

const BusinessCreateFormStyles = styled.div`
    label {
        padding-bottom: 0.5rem;
        align-self: flex-end;
    }
`;

const BusinessCreateForm = () => {
    const { editImage, imagePreview, canvas, setEditImage } = useImagePreview()
    const { mutateAsync: createBusiness } = useCreateBusinessMutation()

    const { register, control, handleSubmit, reset, clearErrors, setError, setValue, formState: { errors } } = useForm({
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
            business_twitter: '',
            place_id: null,
            formatted_address: '',

        }
    });

    let navigate = useNavigate();

    const create_business = async (business_data) => {
        localStorage.setItem('createBusinessForm', JSON.stringify(business_data));
        try {
            const formData = new FormData()

            // check for current canvas and set it to formData
            if(canvas.current === null) {
                throw new Error('missing_image')
            } else {
                let business_avatar = setImageForForm(canvas)

                formData.set('business_avatar', business_avatar)
            }

            // check business type and confirm business address when required
            if ((business_data.business_type === 'both' || business_data.business_type === 'venue') && !business_data.place_id) {
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
                setEditImage(false)
                reset()

                // navigate to the newly created business page
                navigate(`/business/${new_business?.data.id}`)

            }

        } catch (error) {
            console.log(error)
            // missing required business branding logo image
            if (error.message === 'missing_image') {
                setError('business_avatar', {
                    message: 'Business branding (logo) is required'
                }, { shouldFocus: true })
            }
            // business type was venue or both but did not include required address components
            else if (error.message === 'location_required') {
                setError('formatted_address', {
                    message: 'Business address required for venue business type'
                })
            }
            // form data is incorrectly formatted, missing, or invalid 
            else if (error.response.status === 400) {
                setError(`${error.response.data.error.type}`, {
                    message: error.response.data.error.message
                }, { shouldFocus: true })
            }

            else { console.log(`uncaught error: ${error}`) }
        }
    }

    const handleClose = () => {
        // remove create business form save from localhost & go back
        localStorage.removeItem('createBusinessForm')
        navigate(-1)
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
        }
    }, [setValue])


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
                                value: 50,
                                message: 'business name too long'
                            }
                        })} onClick={() => clearErrors('business_name')} type='text' placeholder='Business Name' />
                        {errors.business_name ? <div className='errormessage'>{errors.business_name?.message}</div> : null}
                    </div>

                    {/* once image has been created it will show here */}
                    {
                        editImage &&
                            <div className='formImage formCirclePreview'>
                                <canvas id={'businessImagePreview'} ref={canvas} />
                            </div>
                    }

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
                            <AddImageIcon />
                            <input {...register('business_avatar')} id='business_avatar' className='inputLabelInput' type='file' accept='image/*' onChange={(e) => imagePreview(e)} />
                        </label>
                    </div>
                    {errors.business_email ? <div className='errormessage'>{errors.business_email?.message}</div> : null}
                    {errors.business_avatar ? <div className='errormessage'>{errors.business_avatar?.message}</div> : null}

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

                    {/* BUSINESS TYPE SELECTOR */}
                    <div className='inputWrapper'>
                        <label htmlFor='business_type' className='visuallyHidden'>Business type:</label>
                        <Controller
                            name='business_type'
                            control={control}
                            defaultValue=""
                            rules={{ required: 'business type is required', pattern: { value: businessTypeList, message: 'invalid business type'}}}
                            render={({ field }) => (
                                <select {...field} onClick={() => clearErrors(['brand_id', 'role_rights'])}>
                                    <option value="" disabled>Select business type...</option>
                                    <option value='brand'>Brand</option>
                                    <option value='venue'>Dispensary</option>
                                    <option value='both'>{`Brand & Dispensary`}</option>
                                </select>
                            )}
                        />
                        {errors.business_type ? <div className='errormessage'>{errors.business_type?.message}</div> : null}
                    </div>

                    <AddressForm
                        register={register}
                        setValue={setValue}
                        errors={errors}
                        clearErrors={clearErrors}
                    />

                    <div className='subheaderText'>Business Contacts & Social Media:</div>
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
                        <button type='submit'>Create</button>
                        <button onClick={handleClose}>Close</button>
                    </div>

                </form>
            </div>
        </BusinessCreateFormStyles>
    )
}

export default BusinessCreateForm;
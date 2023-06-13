import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import styled from 'styled-components'

import useAuth from '../../hooks/useAuth';
import { createBusinessSchema } from '../../helpers/validationSchemas';
import { useCreateBusinessMutation } from '../../hooks/useBusinessApi';
import useNotification from '../../hooks/useNotification';
import useImagePreview from '../../hooks/useImagePreview';
import { setImageForForm } from '../../helpers/setImageForForm';
import { AddImageIcon, AddLocationIcon, InstagramIcon, WebSiteIcon, FacebookIcon, PhoneIcon, TwitterIcon } from '../icons/siteIcons';

const BusinessCreateFormStyles = styled.div`
`;

const BusinessCreateForm = () => {
    const { logout_user } = useAuth()
    const { editImage, imagePreview, canvas, setEditImage } = useImagePreview()
    const { mutateAsync: createBusiness } = useCreateBusinessMutation()
    const { dispatch } = useNotification()

    const { register, handleSubmit, watch, reset, clearErrors, setError, formState: { errors } } = useForm({
        mode: 'onBlur',
        resolver: yupResolver(createBusinessSchema),
        defaultValues: {
            business_name: null,
            business_email: null,
            business_avatar: '',
            business_description: null,
            business_type: 'brand',
            street_address: '',
            city: '',
            state: '',
            zip: '',
            business_instagram: '',
            business_facebook: '',
            business_website: '',
            business_twitter: ''

        }
    });

    const business_location = watch('business_location', false) || watch('business_type') !== 'brand';
    let navigate = useNavigate();

    const create_business = async (business_data) => {
        try {
            const formData = new FormData()

            if(canvas.current === null) {
                throw new Error('missing_image')
                // setError('business_avatar', { message: 'business image required' })
            } else {
                let business_avatar = setImageForForm(canvas)

                formData.set('business_avatar', business_avatar)
            }

            Object.keys(business_data).forEach(key => {
                formData.append(key, business_data[key])
            })

            const new_business = await createBusiness(formData)

            if (new_business.status === 201) {

                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'SUCCESS',
                        message: `${new_business.data.business_name} business request submitted`
                    }
                })

                setEditImage(false)
                reset()

                navigate(`/business/${new_business.data.id}`)

            }

        } catch (error) {
            // console.log(error)
            if (error.message === 'missing_image') {
                setError('business_avatar', { message: 'required'})
                throw Error;
            }

            if (error.response.status === 400) {
                setError(`${error.response.data.error.type}`, {
                    type: 'server',
                    message: error.response.data.error.message
                })
            }

            if (error.response.status === 401) {
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'ERROR',
                        message: error.response.data.error.message
                    }
                })

                logout_user()
                // navigate('/login')

            }

        }

    }


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
                        })} className='formInput' type='text' onFocus={() => clearErrors('business_name')} placeholder='Business Name' />
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
                            <input {...register('business_email')} className='formInput' type='text' onFocus={() => clearErrors('business_email')} placeholder='Email' />
                            {errors.business_email ? <div className='errormessage'>{errors.business_email?.message}</div> : null}
                        </div>

                        {/* BUSINESS AVATAR UPLOAD */}
                        <label htmlFor='business_avatar' className='formInput inputLabel'>
                            <AddImageIcon />
                            <input {...register('business_avatar')} id='business_avatar' className='inputLabelInput' type='file' accept='image/*' onChange={(e) => imagePreview(e)} />
                        </label>
                    </div>

                    {/* BUSINESS DESCRIPTION */}
                    <div className='inputWrapper'>
                        <textarea {...register('business_description')} className='formInput' rows='8' onFocus={() => clearErrors('business_description')} placeholder='Business details' />
                        {errors.business_description ? <div className='errormessage'>{errors.business_description?.message}</div> : null}
                    </div>

                    <div className='formRowInputIcon'>
                        {/* BUSINESS TYPE SELECTOR */}
                        <div className='inputWrapper'>
                            <select {...register('business_type')} className='formInput' onFocus={() => clearErrors('business_type')} type='text'>
                                <option value='brand'>Brand</option>
                                <option value='venue'>Dispensary</option>
                                <option value='both'>{`Brand & Dispensary`}</option>
                            </select>
                            {errors.business_type ? <div className='errormessage'>{errors.business_type?.message}</div> : null}
                        </div>
                        
                        {/* BUSINESS LOCATION CHECKBOX */}
                        <label htmlFor='business_location' className='formInput inputLabel'>
                            <AddLocationIcon />
                            <input {...register('business_location')} id='business_location' className='inputLabelInput' type='checkbox' name='business_location' />
                        </label>
                    </div>

                    {
                        (business_location) &&
                            <div className='standardForm'>
                                <div>Business Location Details:</div>
                                {/* STREET ADDRESS */}
                                <div className='inputWrapper'>
                                    <input {...register('street_address')} className='formInput' type='text' onFocus={() => clearErrors('street_address')} placeholder='Street Address' />
                                    {errors.street_address ? <div className='errormessage'>{errors.street_address?.message}</div> : null}
                                </div>

                                {/* CITY */}
                                <div className='inputWrapper'>
                                    <input {...register('city')} className='formInput' type='text' onFocus={() => clearErrors('city')} placeholder='City' />
                                    {errors.city ? <div className='errormessage'>{errors.city?.message}</div> : null}
                                </div>

                                <div className='formRowSplit'>
                                    {/* STATE */}
                                    <div className='inputWrapper'>
                                        <input {...register('state')} className='formInput' type='text' onFocus={() => clearErrors('state')} placeholder='State' />
                                        {errors.state ? <div className='errormessage'>{errors.state?.message}</div> : null}
                                    </div>

                                    {/* ZIP */}
                                    <div className='inputWrapper'>
                                        <input {...register('zip')} className='formInput' type='text' onFocus={() => clearErrors('zip')} placeholder='Zip' />
                                        {errors.zip ? <div className='errormessage'>{errors.zip?.message}</div> : null}
                                    </div>
                                </div>
                            </div>
                    }

                    <div>Business Contacts & Social Media:</div>
                    {/* INSTAGRAM */}
                    <div className='inputWrapper contactWrapper'>
                        <label htmlFor='business_instagram' className='contactLabelWrapper'>
                            <div className='contactIcon'><InstagramIcon /></div>
                            <input {...register('business_instagram')} className='formInput' type='text' onFocus={() => clearErrors('business_instagram')} placeholder='Instagram' />
                        </label>
                        {errors.business_instagram ? <div className='errormessage'>{errors.business_instagram?.message}</div> : null}
                    </div>

                    {/* WEBSITE */}
                    <div className='inputWrapper contactWrapper'>
                        <label htmlFor='business_website' className='contactLabelWrapper'>
                            <div className='contactIcon'><WebSiteIcon /></div>
                            <input {...register('business_website')} className='formInput' type='text' onFocus={() => clearErrors('business_website')} placeholder='Website' />
                        </label>
                        {errors.business_website ? <div className='errormessage'>{errors.business_website?.message}</div> : null}
                    </div>
                    
                    {/* FACEBOOK */}
                    <div className='inputWrapper contactWrapper'>
                        <label htmlFor='business_facebook' className='contactLabelWrapper'>
                            <div className='contactIcon'><FacebookIcon /></div>
                            <input {...register('business_facebook')} className='formInput' type='text' onFocus={() => clearErrors('business_facebook')} placeholder='Facebook' />
                        </label>
                        {errors.business_facebook ? <div className='errormessage'>{errors.business_facebook?.message}</div> : null}
                    </div>
                    
                    {/* PHONE NUMBER */}
                    <div className='inputWrapper contactWrapper'>
                        <label htmlFor='business_phone' className='contactLabelWrapper'>
                            <div className='contactIcon'><PhoneIcon /></div>
                            <input {...register('business_phone')} className='formInput' type='text' onFocus={() => clearErrors('business_phone')} placeholder='Phone' />
                        </label>
                        {errors.business_phone ? <div className='errormessage'>{errors.business_phone?.message}</div> : null}
                    </div>
                    
                    {/* TWITTER */}
                    <div className='inputWrapper contactWrapper'>
                        <label htmlFor='business_twitter' className='contactLabelWrapper'>
                            <div className='contactIcon'><TwitterIcon /></div>
                            <input {...register('business_twitter')} className='formInput' type='text' onFocus={() => clearErrors('business_twitter')} placeholder='Twitter' />
                        </label>
                        {errors.business_twitter ? <div className='errormessage'>{errors.business_twitter?.message}</div> : null}
                    </div>

                    {/* <div className='d-flex justify-content-around pt-3'> */}
                    <div>
                        <button type='submit'>Create</button>
                        <button onClick={() => navigate(-1)} variant='secondary'>Close</button>
                    </div>

                </form>
            </div>
        </BusinessCreateFormStyles>
    )
}

export default BusinessCreateForm;
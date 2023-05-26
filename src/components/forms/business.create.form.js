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
import { BusinessTypeSelect, ContactInput, FormInput, ImageInput, TextAreaInput } from './formInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationArrow } from '@fortawesome/free-solid-svg-icons';

const Styles = styled.div`
    .businessCreateForm {
        width: 100%;
    }

    .formRow {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 10px;

    }
    
    .locationCheckbox {
        cursor: pointer;
        padding: 0.5rem;
        border: none;
        color: var(--main-text-color);
        border-radius: 5px;
        border-bottom: 1px solid black;
        background-color: var(--input-background-color);
        box-shadow: 3px 2px 1px 0 var(--box-shadow-color);
        outline: none;
        text-align: center;

        input {
            display: none;
        }
    }
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

    const business_location = watch('business_location', false)
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
        <Styles>
            <div>
                <form onSubmit={handleSubmit(create_business)} encType='multipart/form-data' className='businessCreateForm'>
                    
                    {/* once image has been created it will show here */}
                    {
                        editImage &&
                            <div className='formImage formCirclePreview'>
                                <canvas id={'businessImagePreview'} ref={canvas} />
                            </div>
                    }

                    <div className='formRow'>
                        <FormInput id='business_name'
                            register={register}
                            onfocus={clearErrors}
                            placeholder='Business Name'
                            error={errors.business_name}
                        />

                        <ImageInput id='business_avatar'
                            register={register}
                            onfocus={clearErrors}
                            error={errors.business_avatar}
                            change={imagePreview}
                        />

                    </div>

                    <FormInput id='business_email'
                        register={register}
                        onfocus={clearErrors}
                        type='email'
                        placeholder='Email'
                        error={errors.business_email}
                    />

                    {/* business description input */}
                    <TextAreaInput register={register} id='business_description' onfocus={() => clearErrors('business_description')} error={errors.business_description} placeholder='Business details...' />

                    <div className='formRow'>
                        <BusinessTypeSelect
                            register={register}
                            onfocus={clearErrors}
                            error={errors.business_type}
                        />
                        <label htmlFor='business_location' className='locationCheckbox'>
                            <input
                                {...register('business_location')}
                                type='checkbox'
                                name='business_location'
                            />
                            <FontAwesomeIcon icon={faLocationArrow} />
                        </label>
                        {/* <CheckBox id='business_location'
                            register={register}
                            boxlabel='Location'
                        /> */}
                    </div>

                    {
                        (business_location) &&
                        <div>
                            {/* street address input for location */}
                            <FormInput id='street_address'
                                register={register}
                                onfocus={clearErrors}
                                placeholder='Street Address'
                                error={errors.street_address}
                            />
                            {/* city input for location */}
                            <FormInput id='city'
                                register={register}
                                onfocus={clearErrors}
                                placeholder='City'
                                error={errors.city}
                            />
                            <div className='d-flex justify-content-between'>
                                {/* state input for location */}
                                <FormInput id='state'
                                    register={register}
                                    onfocus={clearErrors}
                                    placeholder='State'
                                    error={errors.state}
                                />
                                {/* zip code input for location */}
                                <FormInput id='zip'
                                    register={register}
                                    onfocus={clearErrors}
                                    placeholder='Zip'
                                    error={errors.zip}
                                />
                            </div>
                        </div>
                    }

                    {/* instagram input */}
                    <ContactInput id='instagram'
                        register={register}
                        onfocus={clearErrors}
                        error={errors.business_instagram}
                    />
                    {/* website input */}
                    <ContactInput id='website'
                        register={register}
                        onfocus={clearErrors}
                        error={errors.business_website}
                    />
                    {/* facebook input */}
                    <ContactInput id='facebook'
                        register={register}
                        onfocus={clearErrors}
                        error={errors.business_facebook}
                    />
                    {/* phone input */}
                    <ContactInput id='phone'
                        register={register}
                        onfocus={clearErrors}
                        error={errors.business_phone}
                    />
                    {/* twitter input */}
                    <ContactInput id='twitter'
                        register={register}
                        onfocus={clearErrors}
                        error={errors.business_twitter}
                    />

                    <div className='d-flex justify-content-around pt-3'>
                        <button type='submit'>Create</button>
                        <button onClick={() => navigate(-1)} variant='secondary'>Close</button>
                    </div>

                </form>
            </div>
        </Styles>
    )
}

export default BusinessCreateForm;
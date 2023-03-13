import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import styled from 'styled-components';

import useAuth from '../../../hooks/useAuth';
import { createBusinessSchema } from '../../../helpers/validationSchemas';
import { useCreateBusinessMutation } from '../../../hooks/useBusinessApi';
import useNotification from '../../../hooks/useNotification';
import useImagePreview from '../../../hooks/useImagePreview';
// import { image_link } from '../../../helpers/dataCleanUp';
import { BusinessTypeSelect, CheckBox, FormInput, ImageInput, TextAreaInput } from '../../forms/formInput';

const Styles = styled.div`
    .businessImage {
        width: 100%;
        max-width: 350px;
        margin: 1rem auto;
        
        @media (min-width: 500px) {
            width: 100%;
        }

        canvas {
            max-width: 100%;
            border: 1px solid #dcdbc4;
            display: block;
            box-shadow: 5px 5px 5px #010a00;
        }

        img {
            width: 100%;
            border: 1px solid #dcdbc4;
            display: block;
            box-shadow: 5px 5px 5px #010a00;
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
                let canvas_image = canvas.current.toDataURL("image/webp", 1.0)

                let [mime, image_data] = canvas_image.split(',')
                mime = mime.match(/:(.*?);/)[1]

                let data_string = atob(image_data)
                let data_length = data_string.length
                let image_array = new Uint8Array(data_length)

                while(data_length--) { image_array[data_length] = data_string.charCodeAt(data_length) }

                let business_avatar = new File([image_array], 'business_avatar.jpeg', { type: mime })
                
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
                throw('error')
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
            <form onSubmit={handleSubmit(create_business)} encType='multipart/form-data'>
                
                <FormInput register={register} id='business_name' onfocus={() => clearErrors('business_name')} type='text' placeholder='Business Name' error={errors.business_name} />

                <FormInput register={register} id='business_email' onfocus={() => clearErrors('business_email')} type='email' placeholder='Email' error={errors.business_email} />

                <div className='businessImage'>
                    {
                        editImage &&
                            <canvas id={'businessImagePreview'} ref={canvas} />
                            // : <img src={image_link(imageFile)} alt='your business branding' />
                    }
                </div>

                <ImageInput register={register} id='business_avatar' onfocus={() => clearErrors('business_avatar')} error={errors.business_avatar} change={imagePreview} />

                {/* business description input */}
                <TextAreaInput register={register} id='business_description' onfocus={() => clearErrors('business_description')} error={errors.business_description} placeholder='Business details...' />

                <div className='d-flex'>
                    <BusinessTypeSelect register={register} onfocus={() => clearErrors('business_type')} error={errors.business_type} />

                    <CheckBox register={register} id='business_location' boxlabel='Location' />
                </div>

                {
                    (business_location) &&
                    <div>
                        {/* street address input for location */}
                        <FormInput register={register} id='street_address' onfocus={() => clearErrors('street_address')} type='text' placeholder='Street Address' error={errors.street_address} />

                        {/* city input for location */}
                        <FormInput register={register} id='city' onfocus={() => clearErrors('city')} type='text' placeholder='City' error={errors.city} />

                        <div className='d-flex justify-content-between'>
                            {/* state input for location */}
                            <FormInput register={register} id='state' onfocus={() => clearErrors('state')} type='text' placeholder='State' error={errors.state} />

                            {/* zip code input for location */}
                            <FormInput register={register} id='zip' onfocus={() => clearErrors('zip')} type='text' placeholder='Zip' error={errors.zip} />
                        </div>
                    </div>
                }

                {/* instagram input */}
                <FormInput register={register} id='business_instagram' onfocus={() => clearErrors('business_instagram')} type='text' placeholder='Instagram' error={errors.business_instagram} />

                {/* website input */}
                <FormInput register={register} id='business_website' onfocus={() => clearErrors('business_website')} type='text' placeholder='Website' error={errors.business_website} />

                {/* facebook input */}
                <FormInput register={register} id='business_facebook' onfocus={() => clearErrors('business_facebook')} type='text' placeholder='Facebook' error={errors.business_facebook} />

                {/* phone input */}
                <FormInput register={register} id='business_phone' onfocus={() => clearErrors('business_phone')} type='text' placeholder='Phone' error={errors.business_phone} />

                {/* twitter input */}
                <FormInput register={register} id='business_twitter' onfocus={() => clearErrors('business_twitter')} type='text' placeholder='Twitter' error={errors.business_twitter} />

                <div className='d-flex justify-content-around pt-3'>
                    <button type='submit'>Create</button>
                    <button onClick={() => navigate(-1)} variant='secondary'>Close</button>
                </div>

            </form>
        </Styles>
    )
}

export default BusinessCreateForm;
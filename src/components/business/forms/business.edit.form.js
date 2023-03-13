import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';
import styled from 'styled-components';

import useAuth from '../../../hooks/useAuth';
import { image_link } from '../../../helpers/dataCleanUp';
import useImagePreview from '../../../hooks/useImagePreview';
// import { businessFormSchema } from '../../../helpers/validationSchemas';
import { useUpdateBusinessMutation } from '../../../hooks/useBusinessApi';
import useNotification from '../../../hooks/useNotification';
import { BusinessTypeSelect, CheckBox, ContactInput, FormInput, ImageInput, TextAreaInput } from '../../forms/formInput';

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

    /* used in contact input of forminput.js */
    .labelWrapper {
        display: flex;
        align-items: center;
        
        div {
            width: 15%;
            
            @media(min-width: 400px) {
                width: 10%;
            }
        }
    }
    
    /* used in contact input of forminput.js */
    .labelIcon {
        margin: 0 0.5rem;
        width: 1rem;
    }

    .locationWrapper {
        display: flex;
        flex-direction: column;
        
        @media(min-width: 350px) {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            gap: 10px;
        }
    }

    .stateZipWrapper {
        display: flex;
        flex-direction: column;
        align-items: space-between;

        @media(min-width: 275px) {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            gap: 10px;
        }
    }

    .buttonWrapper {
        display: flex;
        justify-content: space-around;
        padding-top: 0.75rem;
    }

`;

const BusinessEditForm = () => {
    const { auth } = useAuth()
    const { business_id } = useParams()
    const { mutateAsync: updateBusiness } = useUpdateBusinessMutation()
    const { dispatch } = useNotification()
    const { state: business } = useLocation()
    const { editImage, imagePreview, canvas, setEditImage } = useImagePreview()
    let business_role = {}

    let navigate = useNavigate()

    const { register, handleSubmit, clearErrors, watch, reset, formState: { isDirty, dirtyFields, errors } } = useForm({
        mode: 'onBlur',
        // resolver: yupResolver(businessFormSchema),
        defaultValues: {
            business_email: business?.business_email,
            business_description: business?.business_description,
            business_avatar: '',
            business_type: business?.business_type,
            business_instagram: business?.business_instagram,
            business_website: business?.business_website,
            business_facebook: business?.business_facebook,
            business_phone: business?.business_phone,
            business_twitter: business?.business_twitter,
            street_address: business?.street_address,
            city: business?.location_city,
            state: business?.location_state,
            zip: business?.zip_code,
            business_location: false,
            image_attached: false,
        }
    })

    if(auth?.roles) {
        business_role = auth.roles.find(role => role.business_id === business_id )
    }

    const image_attached = watch('image_attached', false)
    const business_location = watch('business_location', false)

    const update_business = async (data) => {
        try {
            const formData = new FormData()

            // if updatelocation is true append new address
            if ((data.business_location !== false) && (business_role.role_type === process.env.REACT_APP_ADMIN_ACCOUNT)) {
                formData.append('location_id', business?.location_id || 'new_location')
                formData.append('street_address', data.street_address)
                formData.append('city', data.city)
                formData.append('state', data.state)
                formData.append('zip', data.zip)
            }

            // remove location fields
            delete data['street_address']
            delete data['city']
            delete data['state']
            delete data['zip']
            delete data['business_location']

            // if updateimage is true set updated file
            if (image_attached && (business_role.role_type === process.env.REACT_APP_ADMIN_ACCOUNT)) {
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

            delete data['image_attached']

            // remove entries that are unchanged
            for (const [key] of Object.entries(data)) {
                if (!Object.keys(dirtyFields).includes(key)) {
                    delete data[key]
                }
            }

            // append eveything left changed to formData
            Object.keys(data).forEach(key => {
                formData.append(key, data[key])
            })

            const update_response = await updateBusiness({ business_updates: formData, business_id: business.id })
            
            if (update_response.status === 201) {
                dispatch({
                    type: "ADD_NOTIFICATION",
                    payload: {
                        notification_type: 'SUCCESS',
                        message: `${update_response.data.business_name} has been updated`

                    }
                })

                navigate(`/business/${update_response.data.id}`)
            }

        } catch (err) {
            console.log('inside the catch of the update function')
            console.log(err)
        }

    }

    const close_edit_view = () => {
        setEditImage(false)
        reset()

        navigate(`/business/${business.id}`)
    }
    
    
    return (
        <Styles>
            <h1>{business?.business_name}</h1>
            <form onSubmit={handleSubmit(update_business)} encType='multipart/form-data'>

                {
                    (business_role?.role_type === process.env.REACT_APP_ADMIN_ACCOUNT) &&
                        <FormInput register={register} id='business_email' onfocus={() => clearErrors('business_email')} error={errors?.business_email} />
                }

                <div className='businessImage'>
                    {
                        editImage
                            ? <canvas
                                id={'avatarImagePreview'}
                                ref={canvas}
                            />
                            : <img
                                src={image_link(business?.business_avatar)}
                                alt={business.business_name}
                            />
                    }
                </div>

                {
                    ((business_role?.role_type === process.env.REACT_APP_ADMIN_ACCOUNT) && !image_attached) &&
                        <CheckBox register={register} id='image_attached' boxlabel='Update Image' />
                }

                {
                    (image_attached) &&
                        <ImageInput register={register} id='business_avatar' onfocus={() => clearErrors('business_avatar')} error={errors.business_avatar} change={imagePreview} />
                }

                {/* business description input */}
                <TextAreaInput register={register} id='business_description' onfocus={() => clearErrors('business_description')} error={errors.business_description} placehold='Business details...' />

                {
                    (business_role?.role_type === process.env.REACT_APP_ADMIN_ACCOUNT) &&
                        <div className='locationWrapper'>
                            <BusinessTypeSelect register={register} onfocus={() => clearErrors('business_type')} error={errors.business_type} />

                            <CheckBox register={register} id='business_location' boxlabel='Update Location' />
                        </div>
                }

                {
                    (business_location) &&
                        <div>
                            {/* street address input for location */}
                            <FormInput register={register} id='street_address' onfocus={() => clearErrors('street_address')} type='text' error={errors.street_address} />

                            {/* city input for location */}
                            <FormInput register={register} id='city' onfocus={() => clearErrors('city')} type='text' error={errors.city} />

                            <div className='stateZipWrapper'>
                                {/* state input for location */}
                                <FormInput register={register} id='state' onfocus={() => clearErrors('state')} type='text' error={errors.state} />

                                {/* zip code input for location */}
                                <FormInput register={register} id='zip' onfocus={() => clearErrors('zip')} type='text' error={errors.zip} />
                            </div>
                        </div>
                }

                {/* instagram input */}
                <ContactInput register={register} id='instagram' onfocus={() => clearErrors('business_instagram')} error={errors.business_instagram} placeholder='Instagram' />

                {/* website input */}
                <ContactInput register={register} id='website' onfocus={() => clearErrors('business_website')} error={errors.business_website} placehold='Website' />

                {/* facebook input */}
                <ContactInput register={register} id='facebook' onfocus={() => clearErrors('business_facebook')} error={errors.business_facebook} placeholder='Facebook' />

                {/* phone input */}
                <ContactInput register={register} id='phone' onfocus={() => clearErrors('business_phone')} error={errors.business_phone} placeholder='Phone' />

                {/* twitter input */}
                <ContactInput register={register} id='twitter' onfocus={() => clearErrors('business_twitter')} error={errors.business_twitter} placeholder='Twitter' />

                <div className='buttonWrapper'>
                    <button type='submit' disabled={!isDirty}>Update</button>
                    <button onClick={() => close_edit_view()}>Close</button>
                </div>

            </form>
        </Styles>
    )
}

export default BusinessEditForm;
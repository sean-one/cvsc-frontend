import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';
import styled from 'styled-components';

import useAuth from '../../hooks/useAuth';
import { image_link } from '../../helpers/dataCleanUp';
import useImagePreview from '../../hooks/useImagePreview';
import { setImageForForm } from '../../helpers/setImageForForm';
// import { businessFormSchema } from '../../../helpers/validationSchemas';
import { useUpdateBusinessMutation } from '../../hooks/useBusinessApi';
import useNotification from '../../hooks/useNotification';
import { LocationIcon } from '../icons/siteIcons';
import { BusinessTypeSelect, ContactInput, FormInput, ImageInput, TextAreaInput } from './formInput';

const Styles = styled.div`
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

    .formContainer {
        display: flex;
        flex-direction: column;

        @media (min-width: 500px) {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
        }
    }

    .leftFormColumn, .rightFormColumn {
        width: 100%;
        padding: 0.5rem;
        max-width: 100%;
    }

    .leftFormColumn {
        display: flex;
        justify-content: center;

        @media (min-width: 500px) {
            width: 35%;
        }
    }
    
    .rightFormColumn {

        @media (min-width: 500px) {
            width: 65%;
        }
    }

    .sectionRow {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
    }

    .sectionRowLeft {
        flex-grow: 1;
    }

    .sectionRowRight {
        flex-shrink: 0;
    }

    .locationIconWrapper {
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
    }

    .imageParent {
        max-width: 350px;
        
        @media (min-width: 500px) {
            width: 100%;
        }
        
        img, canvas {
            max-width: 100%;
            border: 1px solid #DCDBC4;
            border-radius: 50%;
            display: block;
            box-shadow: 5px 5px 5px #010A00;
        }
    }

    .businessContacts {
        display: flex;
        flex-direction: column;
        border: 1px solid yellow;
        padding: 0 0.5rem;

        @media (min-width: 500px) {
            flex-direction: row;
            justify-content: space-between;
            flex-wrap: wrap;
        }
    }

    .businessContact {
        margin-bottom: 0.5rem;
        width: 100%;
        
        @media (min-width: 500px) {
            width: 49%;
            flex-basis: 50;
        }
    }

    .noclick {
        color: grey;
        pointer-events: none;
    }

`;

const BusinessEditForm = () => {
    const [ showLocation, setShowLocation ] = useState(false)
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

    if(auth?.roles) { business_role = auth.roles.find(role => role.business_id === business_id ) }

    const image_attached = watch('image_attached', false)
    const business_type = watch('business_type')

    const update_business = async (data) => {
        try {
            const formData = new FormData()

            //! check for address
            // if updatelocation is true append new address
            // if ((data.business_location !== false) && (business_role.role_type === process.env.REACT_APP_ADMIN_ACCOUNT)) {
            //     formData.append('location_id', business?.location_id || 'new_location')
            //     formData.append('street_address', data.street_address)
            //     formData.append('city', data.city)
            //     formData.append('state', data.state)
            //     formData.append('zip', data.zip)
            // }

            // remove location fields
            delete data['street_address']
            delete data['city']
            delete data['state']
            delete data['zip']
            delete data['business_location']

            // if updateimage is true set updated file
            if (image_attached && (business_role.role_type === process.env.REACT_APP_ADMIN_ACCOUNT)) {
                
                let business_avatar = setImageForForm(canvas)

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
            <form onSubmit={handleSubmit(update_business)} encType='multipart/form-data'>
                <h1>{business?.business_name}</h1>
                <div className='formContainer'>
                    <div className='leftFormColumn'>
                        <div className='imageParent'>
                            {
                                editImage
                                    ? <canvas
                                        // className=''
                                        id={'avatarImagePreview'}
                                        ref={canvas}
                                    />
                                    : <img
                                        // className=''
                                        src={image_link(business?.business_avatar)}
                                        alt={business.business_name}
                                    />
                            }
                        </div>
                    </div>
                    <div className='rightFormColumn'>
                        {
                            (business_role?.role_type === process.env.REACT_APP_ADMIN_ACCOUNT) &&
                                <div className='sectionRow'>
                                    <div className='sectionRowLeft'>
                                        <FormInput register={register} id='business_email' onfocus={clearErrors} error={errors?.business_email} />
                                    </div>
                                    <div className='sectionRowRight'>
                                        <ImageInput id='business_avatar'
                                            register={register}
                                            onfocus={clearErrors}
                                            error={errors.business_avatar}
                                            change={imagePreview}
                                        />
                                    </div>
                                </div>
                        }

                        {/* business description input */}
                        <TextAreaInput register={register} id='business_description' onfocus={() => clearErrors('business_description')} error={errors.business_description} placehold='Business details...' />

                        {
                            (business_role?.role_type === process.env.REACT_APP_ADMIN_ACCOUNT) &&
                                <div className='sectionRow'>
                                    <div className='sectionRowLeft'>
                                        <BusinessTypeSelect register={register} onfocus={() => clearErrors('business_type')} error={errors.business_type} />
                                    </div>

                                    <div className={`sectionRowRight ${(business_type !== 'brand') ? 'noclick' : ''}`} onClick={() => setShowLocation(!showLocation)} >
                                        <div className='locationIconWrapper'>
                                            <LocationIcon />
                                        </div>
                                    </div>
                                </div>
                        }

                        {
                            (showLocation || business_type === 'venue' || business_type === 'both') &&
                                <div>
                                    {/* street address input for location */}
                                    <FormInput id='street_address'
                                        register={register}
                                        onfocus={clearErrors}
                                        error={errors.street_address}
                                        placeholder='Street Address'
                                    />
                                    {/* city input for location */}
                                    <FormInput id='city'
                                        register={register}
                                        onfocus={clearErrors}
                                        error={errors.city}
                                        placeholder='City'
                                    />
                                    <div className='stateZipWrapper'>
                                        {/* state input for location */}
                                        <FormInput id='state'
                                            register={register}
                                            onfocus={clearErrors}
                                            error={errors.state}
                                            placeholder='State'
                                        />
                                        {/* zip code input for location */}
                                        <FormInput id='zip'
                                            register={register}
                                            onfocus={clearErrors}
                                            error={errors.zip}
                                            placeholder='Zip'
                                        />
                                    </div>
                                </div>
                        }

                    </div>
                </div>
                <div className='businessContacts'>
                    {/* instagram input */}
                    <div className='businessContact'>
                        <ContactInput id='instagram'
                            register={register}
                            onfocus={clearErrors}
                            error={errors.business_instagram}
                        />
                    </div>
                    {/* website input */}
                    <div className='businessContact'>
                        <ContactInput id='website'
                            register={register}
                            onfocus={clearErrors}
                            error={errors.business_website}
                        />
                    </div>
                    {/* facebook input */}
                    <div className='businessContact'>
                        <ContactInput id='facebook'
                            register={register}
                            onfocus={clearErrors}
                            error={errors.business_facebook}
                        />
                    </div>
                    {/* phone input */}
                    <div className='businessContact'>
                        <ContactInput id='phone'
                            register={register}
                            onfocus={clearErrors}
                            error={errors.business_phone}
                        />
                    </div>
                    {/* twitter input */}
                    <div className='businessContact'>
                        <ContactInput id='twitter'
                            register={register}
                            onfocus={clearErrors}
                            error={errors.business_twitter}
                        />
                    </div>
                </div>

                <div className='buttonWrapper'>
                    <button type='submit' disabled={!isDirty}>Update</button>
                    <button onClick={() => close_edit_view()}>Close</button>
                </div>

            </form>
        </Styles>
    )
}

export default BusinessEditForm;
import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';
import { Image } from 'react-bootstrap';

import useAuth from '../../../hooks/useAuth';
import { image_link } from '../../../helpers/dataCleanUp';
// import { businessFormSchema } from '../../../helpers/validationSchemas';
import { useUpdateBusinessMutation } from '../../../hooks/useBusinessApi';
import useNotification from '../../../hooks/useNotification';


const BusinessEditForm = () => {
    const { auth } = useAuth()
    const { business_id } = useParams()
    const { mutateAsync: updateBusiness } = useUpdateBusinessMutation()
    const { dispatch } = useNotification()
    const { state: business } = useLocation()
    const [ imageFile, setImageFile ] = useState(business?.business_avatar)
    let business_role = {}

    let navigate = useNavigate()

    const { register, handleSubmit, clearErrors, watch, formState: { isDirty, dirtyFields, errors } } = useForm({
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
            if (image_attached && data?.business_avatar[0] && (business_role.role_type === process.env.REACT_APP_ADMIN_ACCOUNT)) {
                formData.set('business_avatar', data['business_avatar'][0])
            }

            delete data['business_avatar']
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

    const image_preview = (e) => {
        if(e.target.files.length !== 0) {
            setImageFile(URL.createObjectURL(e.target.files[0]))
        } else {
            setImageFile(imageFile)
        }
    }
    
    
    return (
        <>
            <h1>{business?.business_name}</h1>
            <form onSubmit={handleSubmit(update_business)} encType='multipart/form-data'>

                {
                    (business_role?.role_type === process.env.REACT_APP_ADMIN_ACCOUNT) &&
                        <input
                            className={errors.business_email ? 'inputError' : ''}
                            {...register('business_email')}
                            onFocus={() => clearErrors('business_email')}
                            type='text'
                            name='business_email'
                        />
                }
                <div className='errormessage'>{errors.business_email?.message}</div>

                <div className='d-flex justify-content-center mb-2'>
                    <Image
                        src={image_link(imageFile)}
                        alt={business.business_name}
                        thumbnail
                    />
                </div>

                {
                    ((business_role?.role_type === process.env.REACT_APP_ADMIN_ACCOUNT) && !image_attached) &&
                        <label for='image_attached' className='updateCheckbox'>
                            <input
                                {...register('image_attached')}
                                type='checkbox'
                                name='image_attached'
                            />
                            Update Image
                        </label>
                }
                {
                    (image_attached) &&
                        <input
                            className={errors.business_avatar ? 'inputError' : ''}
                            {...register('business_avatar')}
                            onFocus={() => clearErrors('business_avatar')}
                            type='file'
                            name='business_avatar'
                            accept='image/*'
                            onChange={(e) => image_preview(e)}
                        />
                }
                <div className='errormessage'>{errors.business_avatar?.message}</div>

                {/* business description input */}
                <input
                    className={errors.business_description ? 'inputError' : ''}
                    {...register('business_description')}
                    onFocus={() => clearErrors('business_description')}
                    as='textarea'
                    name='business_description'
                    style={{ height: '200px' }}
                />
                <div className='errormessage'>{errors.business_description?.message}</div>

                {
                    (business_role?.role_type === process.env.REACT_APP_ADMIN_ACCOUNT) &&
                        <div className='d-flex'>
                            <select
                                className={errors.business_type ? 'inputError' : ''}
                                {...register('business_type')}
                                onFocus={() => clearErrors('business_type')}
                                type='text'
                                name='business_type'
                            >
                                <option value='brand'>Brand</option>
                                <option value='venue'>Dispensary</option>
                                <option value='both'>{`Brand & Dispensary`}</option>
                            </select>
                            <div className='errormessage'>{errors.business_type?.message}</div>

                            <label for='business_location' className='updateCheckbox'>
                                <input
                                    {...register('business_location')}
                                    type='checkbox'
                                    name='business_location'
                                />
                                Update Location
                            </label>
                        </div>
                }

                {
                    (business_location) &&
                        <div>
                            {/* street address input for location */}
                            <input
                                className={errors.street_address ? 'inputError' : ''}
                                {...register('street_address')}
                                onFocus={() => clearErrors('street_address')}
                                type='text'
                                name='street_address'
                            />
                            <div className='errormessage'>{errors.street_address?.message}</div>

                            {/* city input for location */}
                            <input
                                className={errors.city ? 'inputError' : ''}
                                {...register('city')}
                                onFocus={() => clearErrors('city')}
                                type='text'
                                name='city'
                            />
                            <div className='errormessage'>{errors.city?.message}</div>

                            <div className='d-flex justify-content-between'>
                                {/* state input for location */}
                                <input
                                    className={errors.state ? 'inputError' : ''}
                                    {...register('state')}
                                    onFocus={() => clearErrors('state')}
                                    type='text'
                                    name='state'
                                />
                                <div className='errormessage'>{errors.state?.message}</div>

                                {/* zip code input for location */}
                                <input
                                    className={errors.zip ? 'inputError' : ''}
                                    {...register('zip')}
                                    onFocus={() => clearErrors('zip')}
                                    type='text'
                                    name='zip'
                                />
                                <div className='errormessage'>{errors.zip?.message}</div>
                            </div>
                        </div>
                }

                {/* instagram input */}
                <input
                    className={errors.business_instagram ? 'inputError' : ''}
                    {...register('business_instagram')}
                    onFocus={() => clearErrors('business_instagram')}
                    type='text'
                    name='business_instagram'
                />
                <div className='errormessage'>{errors.business_instagram?.message}</div>

                {/* website input */}
                <input
                    className={errors.business_website ? 'inputError' : ''}
                    {...register('business_website')}
                    onFocus={() => clearErrors('business_website')}
                    type='text'
                    name='business_website'
                />
                <div className='errormessage'>{errors.business_website?.message}</div>

                {/* facebook input */}
                <input
                    className={errors.business_facebook ? 'inputError' : ''}
                    {...register('business_facebook')}
                    onFocus={() => clearErrors('business_facebook')}
                    type='text'
                    name='business_facebook'
                />
                <div className='errormessage'>{errors.business_facebook?.message}</div>

                {/* phone input */}
                <input
                    className={errors.business_phone ? 'inputError' : ''}
                    {...register('business_phone')}
                    onFocus={() => clearErrors('business_phone')}
                    type='text'
                    name='business_phone'
                />
                <div className='errormessage'>{errors.business_phone?.message}</div>

                {/* twitter input */}
                <input
                    className={errors.business_twitter ? 'inputError' : ''}
                    {...register('business_twitter')}
                    onFocus={() => clearErrors('business_twitter')}
                    type='text'
                    name='business_twitter'
                />
                <div className='errormessage'>{errors.business_twitter?.message}</div>

                <div className='d-flex justify-content-around pt-3'>
                    <button type='submit' disabled={!isDirty}>Update</button>
                    <button onClick={() => navigate(`/business/${business.id}`)}>Close</button>
                </div>

            </form>
        </>
    )
}

export default BusinessEditForm;
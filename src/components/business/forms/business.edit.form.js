import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faGlobe, faPhone } from '@fortawesome/free-solid-svg-icons';
import { faInstagram, faFacebook, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { useForm } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';
import styled from 'styled-components';

import useAuth from '../../../hooks/useAuth';
import { image_link } from '../../../helpers/dataCleanUp';
import useImagePreview from '../../../hooks/useImagePreview';
// import { businessFormSchema } from '../../../helpers/validationSchemas';
import { useUpdateBusinessMutation } from '../../../hooks/useBusinessApi';
import useNotification from '../../../hooks/useNotification';

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

    .selectWrapper {
        display: flex;
        flex-direction: column;
    }

    .locationUpdate {
        padding-right: 0.5rem;
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
                        <input
                            {...register('business_email')}
                            className={errors.business_email ? 'inputError' : ''}
                            onFocus={() => clearErrors('business_email')}
                            type='text'
                            name='business_email'
                        />
                }
                <div className='errormessage'>{errors.business_email?.message}</div>

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
                        <label for='business_avatar' className='imageUpdateInput'>
                            Select Image
                            <FontAwesomeIcon icon={faCamera} className='cameraIcon' />
                            <input
                                {...register('business_avatar')}
                                className={errors.business_avatar ? 'inputError' : ''}
                                onFocus={() => clearErrors('business_avatar')}
                                type='file'
                                id='business_avatar'
                                name='business_avatar'
                                accept='image/*'
                                onChange={(e) => imagePreview(e)}
                            />
                        </label>
                }
                <div className='errormessage'>{errors.business_avatar?.message}</div>

                {/* business description input */}
                <textarea
                    {...register('business_description')}
                    className={errors.business_description ? 'inputError' : ''}
                    onFocus={() => clearErrors('business_description')}
                    name='business_description'
                    rows='8'
                />
                <div className='errormessage'>{errors.business_description?.message}</div>

                {
                    (business_role?.role_type === process.env.REACT_APP_ADMIN_ACCOUNT) &&
                        <div className='locationWrapper'>
                            <div className='inputErrorWrapper'>
                                <select
                                    {...register('business_type')}
                                    className={errors.business_type ? 'inputError' : ''}
                                    onFocus={() => clearErrors('business_type')}
                                    type='text'
                                    name='business_type'
                                >
                                    <option value='brand'>Brand</option>
                                    <option value='venue'>Dispensary</option>
                                    <option value='both'>{`Brand & Dispensary`}</option>
                                </select>
                                <div className='errormessage'>{errors.business_type?.message}</div>
                            </div>

                            <div className='locationUpdate'>
                                <label for='business_location' className='updateCheckbox'>
                                    <input
                                        {...register('business_location')}
                                        type='checkbox'
                                        name='business_location'
                                    />
                                    Update Location
                                </label>
                            </div>
                        </div>
                }

                {
                    (business_location) &&
                        <div>
                            {/* street address input for location */}
                            <input
                                {...register('street_address')}
                                className={errors.street_address ? 'inputError' : ''}
                                onFocus={() => clearErrors('street_address')}
                                type='text'
                                name='street_address'
                            />
                            <div className='errormessage'>{errors.street_address?.message}</div>

                            {/* city input for location */}
                            <input
                                {...register('city')}
                                className={errors.city ? 'inputError' : ''}
                                onFocus={() => clearErrors('city')}
                                type='text'
                                name='city'
                            />
                            <div className='errormessage'>{errors.city?.message}</div>

                            <div className='stateZipWrapper'>
                                {/* state input for location */}
                                <div className='inputErrorWrapper'>
                                    <input
                                        {...register('state')}
                                        className={errors.state ? 'inputError' : ''}
                                        onFocus={() => clearErrors('state')}
                                        type='text'
                                        name='state'
                                    />
                                    <div className='errormessage'>{errors.state?.message}</div>
                                </div>

                                {/* zip code input for location */}
                                <div className='inputErrorWrapper'>
                                    <input
                                        {...register('zip')}
                                        className={errors.zip ? 'inputError' : ''}
                                        onFocus={() => clearErrors('zip')}
                                        type='text'
                                        name='zip'
                                    />
                                    <div className='errormessage'>{errors.zip?.message}</div>
                                </div>
                            </div>
                        </div>
                }

                {/* instagram input */}
                <label for='business_instagram' className='labelWrapper'>
                    <div className='labelIcon'>
                        <FontAwesomeIcon icon={faInstagram} size='2x' />
                    </div>
                    <input
                        {...register('business_instagram')}
                        className={errors.business_instagram ? 'inputError' : ''}
                        onFocus={() => clearErrors('business_instagram')}
                        type='text'
                        name='business_instagram'
                    />
                </label>
                <div className='errormessage'>{errors.business_instagram?.message}</div>

                {/* website input */}
                <label for='business_website' className='labelWrapper'>
                    <div className='labelIcon'>
                        <FontAwesomeIcon icon={faGlobe} size='2x' />
                    </div>
                    <input
                        {...register('business_website')}
                        className={errors.business_website ? 'inputError' : ''}
                        onFocus={() => clearErrors('business_website')}
                        type='text'
                        name='business_website'
                    />
                </label>
                <div className='errormessage'>{errors.business_website?.message}</div>

                {/* facebook input */}
                <label for='business_facebook' className='labelWrapper'>
                    <div className='labelIcon'>
                        <FontAwesomeIcon icon={faFacebook} size='2x' />
                    </div>
                    <input
                        {...register('business_facebook')}
                        className={errors.business_facebook ? 'inputError' : ''}
                        onFocus={() => clearErrors('business_facebook')}
                        type='text'
                        name='business_facebook'
                    />
                </label>
                <div className='errormessage'>{errors.business_facebook?.message}</div>

                {/* phone input */}
                <label for='business_phone' className='labelWrapper'>
                    <div className='labelIcon'>
                        <FontAwesomeIcon icon={faPhone} size='2x' />
                    </div>
                    <input
                        {...register('business_phone')}
                        className={errors.business_phone ? 'inputError' : ''}
                        onFocus={() => clearErrors('business_phone')}
                        type='text'
                        name='business_phone'
                    />
                </label>
                <div className='errormessage'>{errors.business_phone?.message}</div>

                {/* twitter input */}
                <label for='business_twitter' className='labelWrapper'>
                    <div className='labelIcon'>
                        <FontAwesomeIcon icon={faTwitter} size='2x' />
                    </div>
                    <input
                        {...register('business_twitter')}
                        className={errors.business_twitter ? 'inputError' : ''}
                        onFocus={() => clearErrors('business_twitter')}
                        type='text'
                        name='business_twitter'
                    />
                </label>
                <div className='errormessage'>{errors.business_twitter?.message}</div>

                <div className='buttonWrapper'>
                    <button type='submit' disabled={!isDirty}>Update</button>
                    <button onClick={() => close_edit_view()}>Close</button>
                </div>

            </form>
        </Styles>
    )
}

export default BusinessEditForm;
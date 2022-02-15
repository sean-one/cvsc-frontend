import React, { useState } from 'react';
// import { withRouter, useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// import AxiosInstance from '../../helpers/axios';

import { addBusinessSchema } from '../../helpers/validationSchemas';
// import { addBusiness } from '../../helpers/dataCleanUp';
// import useImagePreviewer from '../../hooks/useImagePreviewer';

const CreateBusiness = (props) => {
    // const { editImage, imagePreview, canvas } = useImagePreviewer()
    const [serverError, setServerError] = useState(false)
    const { register, handleSubmit, setError, watch, reset, formState: { errors } } = useForm({
        mode: 'onBlur',
        resolver: yupResolver(addBusinessSchema)
    });

    const businessType = watch('business_type')
    // let history = useHistory();

    const sendRequest = (data) => {
        setServerError(false)
        console.log(data)
    //     AxiosInstance.post('/business/create', cleanData, {
    //         headers: { 'Authorization': 'Bearer ' + token }
    //     })
    //         .then(response => {
    //             if (response.status === 201) {
    //                 reset()
    //                 props.toggleView()
    //                 alert('request sent')
    //                 history.push({
    //                     pathname: '/profile',
    //                 });
    //             }
    //             console.log(response)
    //         })
    //         .catch(err => {
    //             if (!err.response) {
    //                 setServerError(true)
    //             } else if (err.response.status === 400) {
    //                 setError(`${err.response.data.type}`, {
    //                     type: 'server',
    //                     message: err.response.data.message
    //                 })
    //             }
    //         })
    }


    return (
        <div className='componentWrapper'>
            {/* name, email, avatar, description, [brand, venue, both], contact, requestOpen */}
            {/* contact -- instagram, phone, website*/}
            <div className='businessFormWrapper'>
                <form className='businessRequestForm' onSubmit={handleSubmit(sendRequest)}>

                    <label htmlFor='business_name'>Business Name:</label>
                    <input {...register('business_name')}
                        type='text'
                        id='business_name'
                        required
                    />
                    <p className='errormessage'>{errors.business_name?.message}</p>

                    <label htmlFor='email'>Business Email:</label>
                    <input {...register('email')}
                        type='email'
                        id='email'
                        required
                    />
                    <p className='errormessage'>{errors.email?.message}</p>

                    {/* {
                        editImage && <canvas id={'avatarCanvas'} ref={canvas} height={200} width={200} />
                    }
                    <label htmlFor='business_avatar'>Business Branding:</label>
                    <input {...register('business_avatar')}
                        type='file'
                        id='business_avatar'
                        accept='image/*'
                        onChange={imagePreview}
                        required
                    />
                    <p className='errormessage'>{errors.business_avatar?.message}</p> */}

                    <label htmlFor='business_description'>Business Bio:</label>
                    <textarea {...register('business_description')}
                        type='text'
                        id='business_description'
                        rows='10'
                    />
                    <p className='errormessage'>{errors.business_description?.message}</p>

                    {/* if dispensary or both is selected, need to insert new address input */}
                    <label htmlFor='business_type'>Business Type:</label>
                    <select {...register('business_type')} value='brand' required >
                        <option value='brand'>Brand</option>
                        <option value='venue'>Dispensary</option>
                        <option value='both'>{`Brand & Dispensary`}</option>
                    </select>
                    <p className='errormessage'>{errors.business_type?.message}</p>

                    {
                        (businessType !== 'brand') && (
                            <div>
                                <label htmlFor='street_address'>Street Address:</label>
                                <input {...register('street_address')}
                                    type='text'
                                    id='street_address'
                                    required
                                />
                                <p className='errormessage'>{errors.street_address?.message}</p>

                                <label htmlFor='city'>City:</label>
                                <input {...register('city')}
                                    type='text'
                                    id='city'
                                    required
                                />
                                <p className='errormessage'>{errors.city?.message}</p>

                                <label htmlFor='state'>State:</label>
                                <input {...register('state')}
                                    type='text'
                                    id='state'
                                    required
                                />
                                <p className='errormessage'>{errors.state?.message}</p>

                                <label htmlFor='zip'>Zip:</label>
                                <input {...register('zip')}
                                    type='text'
                                    id='zip'
                                    required
                                />
                                <p className='errormessage'>{errors.zip?.message}</p>
                            </div>
                        )
                    }

                    <label htmlFor='instagram'>Instagram:</label>
                    <input {...register('instagram')}
                        type='text'
                        id='instagram'
                    />
                    <p className='errormessage'>{errors.instagram?.message}</p>

                    <label htmlFor='phone'>Phone:</label>
                    <input {...register('phone')}
                        type='tel'
                        id='phone'
                    />
                    <p className='errormessage'>{errors.phone?.message}</p>

                    <label htmlFor='website'>Website:</label>
                    <input {...register('website')}
                        type='url'
                        id='website'
                    />
                    <p className='errormessage'>{errors.website?.message}</p>

                    {serverError && <p className='errormessage'>network error, please wait a moment and try again</p>}
                    <input type='submit' value='submit' />

                </form>
            </div>
        </div>
    )
}

// export default withRouter(CreateBusiness);
export default CreateBusiness;
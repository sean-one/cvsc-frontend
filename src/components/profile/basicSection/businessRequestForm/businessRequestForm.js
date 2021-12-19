import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretLeft } from '@fortawesome/free-solid-svg-icons';
import AxiosInstance from '../../../../helpers/axios';

import { yupResolver } from '@hookform/resolvers/yup';
import { addBusinessSchema } from '../../../../helpers/validationSchemas';
import { addBusiness } from '../../../../helpers/dataCleanUp';


const BusinessRequestForm = (props) => {
    const [ editImage, setEditImage ] = useState(false)
    const [ serverError, setServerError ] = useState(false)
    const [ businessLogo, setBusinessLogo ] = useState()
    const { register, handleSubmit, setError, watch, reset, formState:{ errors } } = useForm({
        mode: 'onBlur',
        resolver: yupResolver(addBusinessSchema)
    });
    const canvas = useRef(null)
    const businessType = watch('business_type')

    const showPreview = (event) => {
        setEditImage(true)
        let fileToUpload = event.target.files
        let reader = new FileReader()
        const previewImage = new Image()
        reader.onload = function(e) {
            previewImage.src = e.target.result
            previewImage.onload = () => setBusinessLogo(previewImage)
        }
        reader.readAsDataURL(fileToUpload[0])
    }

    const sendRequest = (data) => {
        setServerError(false)
        canvas.current.toBlob(async function(blob) {
            
            const token = localStorage.getItem('token')
            const cleanData = addBusiness(data)

            const url = await AxiosInstance.get('/s3', {
                headers: { 'Authorization': 'Bearer ' + token }
            })
                .then(response => {
                    return response.data.url
                })
                .catch(err => console.log(err))

            await AxiosInstance.put(url, blob, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })

            const imageUrl = url.split('?')[0]

            data.business.avatar = imageUrl
            
            AxiosInstance.post('/business/add', cleanData, {
                headers: { 'Authorization': 'Bearer ' + token }
            })
                .then(response => {
                    if (response.status === 201) {
                        reset()
                        props.toggleView()
                        setEditImage(false)
                        alert('request sent')
                        // console.log(response)
                    }
                })
                .catch(err => {
                    if(!err.response) {
                        setServerError(true)
                    } else if (err.response.status === 400) {
                        setError(`${err.response.data.type}`, {
                            type: 'server',
                            message: err.response.data.message
                        })
                    }
                })
        })

    }

    useEffect(() => {
        let mounted = true
        if (mounted) {
            if (businessLogo && canvas) {
                const ctx = canvas.current.getContext('2d')
                const MAX_WIDTH = 200
                const MAX_HEIGHT = 200
                let width = businessLogo.width
                let height = businessLogo.height

                ctx.clearRect(0, 0, canvas.current.width, canvas.current.height);
                if (width > height) {
                    width *= MAX_HEIGHT / height;
                    height = MAX_HEIGHT;
                } else {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH
                }
                ctx.drawImage(businessLogo, (canvas.current.width / 2) - (width / 2), (canvas.current.height / 2) - (height / 2), width, height)
            }
        }
        return () => {
            mounted = false
        }

    }, [businessLogo, canvas]);

    return (
        <div className='newBusinessSection'>
            <div className='tabHeader'>
                <p>Add New Business Request</p>
                {
                    (props.viewable) ?
                        <FontAwesomeIcon className='tabIcon' icon={faCaretDown} size='1x' onClick={props.toggleView} />
                        : <FontAwesomeIcon className='tabIcon' icon={faCaretLeft} size='1x' onClick={props.toggleView} />
                }
            </div>
            {/* name, email, avatar, description, [brand, venue, both], contact, requestOpen */}
            {/* contact -- instagram, phone, website*/}
            <div className={props.viewable ? 'businessFormWrapper' : 'inactive'}>
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

                    {
                        editImage && <canvas id={'avatarCanvas'} ref={canvas} height={200} width={200} />
                    }
                    <label htmlFor='business_avatar'>Business Branding:</label>
                    <input {...register('business_avatar')}
                        type='file'
                        id='business_avatar'
                        accept='image/*'
                        onChange={showPreview}
                        required
                    />
                    <p className='errormessage'>{errors.business_avatar?.message}</p>

                    <label htmlFor='business_description'>Business Bio:</label>
                    <textarea {...register('business_description')}
                        type='text'
                        id='business_description'
                        rows='10'
                    />
                    <p className='errormessage'>{errors.business_description?.message}</p>

                    {/* if dispensary or both is selected, need to insert new address input */}
                    <label htmlFor='business_type'>Business Type:</label>
                    <select {...register('business_type')} required >
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

                    { serverError && <p className='errormessage'>network error, please wait a moment and try again</p> }
                    <input type='submit' value='submit' />

                </form>
            </div>
        </div>
    )
}

export default BusinessRequestForm;
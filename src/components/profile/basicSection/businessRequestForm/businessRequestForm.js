import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretLeft } from '@fortawesome/free-solid-svg-icons';

import { yupResolver } from '@hookform/resolvers/yup';
import { addBusinessSchema } from '../../../../helpers/validationSchemas';


const BusinessRequestForm = (props) => {
    const [ editImage, setEditImage ] = useState(false)
    const [ businessLogo, setBusinessLogo ] = useState()
    const { register, handleSubmit, watch, formState:{ errors } } = useForm({
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
        console.log(data)
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

                    <label htmlFor='business_email'>Business Email:</label>
                    <input {...register('business_email')}
                        type='email'
                        id='business_email'
                        required
                    />
                    <p className='errormessage'>{errors.business_email?.message}</p>

                    {
                        editImage && <canvas id={'avatarCanvas'} ref={canvas} height={200} width={200} />
                    }
                    <label htmlFor='business_avatar'>Business Branding:</label>
                    <input {...register('business_avatar')}
                        type='file'
                        id='business_avatar'
                        accept='image/*'
                        onChange={showPreview}
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
                                <label htmlFor='location_street'>Street Address:</label>
                                <input {...register('location_street')}
                                    type='text'
                                    id='location_street'
                                    required
                                />
                                <p className='errormessage'>{errors.location_street?.message}</p>
                                
                                <label htmlFor='location_city_state'>City, State:</label>
                                <input {...register('location_city_state')}
                                    type='text'
                                    id='location_city_state'
                                    required
                                />
                                <p className='errormessage'>{errors.location_city_state?.message}</p>
                                
                                <label htmlFor='location_zip'>Zip:</label>
                                <input {...register('location_zip')}
                                    type='text'
                                    id='location_zip'
                                    required
                                />
                                <p className='errormessage'>{errors.location_zip?.message}</p>
                            </div>
                        )
                    }

                    <label htmlFor='contact_instagram'>Instagram:</label>
                    <input {...register('contact_instagram')}
                        type='text'
                        id='contact_instagram'
                    />
                    <p className='errormessage'>{errors.contact_instagram?.message}</p>
                    
                    <label htmlFor='contact_phone'>Phone:</label>
                    <input {...register('contact_phone')}
                        type='tel'
                        id='contact_phone'
                    />
                    <p className='errormessage'>{errors.contact_phone?.message}</p>

                    <label htmlFor='contact_website'>Website:</label>
                    <input {...register('contact_website')}
                        type='url'
                        id='contact_website'
                    />
                    <p className='errormessage'>{errors.contact_website?.message}</p>

                    <input type='submit' value='submit' />

                </form>
            </div>
        </div>
    )
}

export default BusinessRequestForm;
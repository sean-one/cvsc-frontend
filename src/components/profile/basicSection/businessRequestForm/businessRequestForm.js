import React from 'react';
import { useForm } from 'react-hook-form';

const BusinessRequestForm = () => {
    const { register, handleSubmit } = useForm()

    const sendRequest = (data) => {
        console.log(data)
    }

    return (
        <div className='newBusinessSection'>
            <div className='tabHeader'>
                <p>Add New Business Request</p>
                {/* add fontawesome carets here to make fold unfold */}
            </div>
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

                    <label htmlFor='business_email'>Business Email:</label>
                    <input {...register('business_email')}
                        type='email'
                        id='business_email'
                        required
                    />

                    <label htmlFor='business_avatar'>Business Branding:</label>
                    <input {...register('business_avatar')}
                        type='file'
                        id='business_avatar'
                        accept='image/*'
                    />

                    <label htmlFor='business_description'>Business Bio:</label>
                    <textarea {...register('business_description')}
                        type='text'
                        id='business_description'
                        rows='10'
                    />

                    {/* if dispensary or both is selected, need to insert new address input */}
                    <label htmlFor='business_type'>Business Type:</label>
                    <select {...register('business_type')} required >
                        <option value='brand'>Brand</option>
                        <option value='venue'>Dispensary</option>
                        <option value='both'>{`Brand & Dispensary`}</option>
                    </select>

                    <label htmlFor='contact_instagram'>Instagram:</label>
                    <input {...register('contact_instagram')}
                        type='text'
                        id='contact_instagram'
                    />
                    
                    <label htmlFor='contact_phone'>Phone:</label>
                    <input {...register('contact_phone')}
                        type='tel'
                        id='contact_phone'
                    />

                    <label htmlFor='contact_website'>Website:</label>
                    <input {...register('contact_website')}
                        type='url'
                        id='contact_website'
                    />

                    <input type='submit' value='submit' />

                </form>
            </div>
        </div>
    )
}

export default BusinessRequestForm;
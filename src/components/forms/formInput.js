import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faGlobe, faPhone } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';

const contact_icons = {
    'instagram' : faInstagram,
    'website' : faGlobe,
    'facebook' : faFacebook,
    'phone' : faPhone,
    'twitter' : faTwitter
}


export const FormInput = ({ register, id, onfocus, type='text', placeholder, error }) => {
    return (
        <div className='inputErrorWrapper'>
            <input
                {...register(id)}
                className={error ? 'inputError' : ''}
                onFocus={() => onfocus(id)}
                type={type}
                name={id}
                placeholder={placeholder}
            />
            <div className='errormessage'>{error?.message}</div>
        </div>
    )
}

export const CheckBox = ({ register, id, boxlabel }) => {
    return (
        <label htmlFor={id} className='updateCheckbox'>
            <input
                {...register(id)}
                type='checkbox'
                name={id}
            />
            {boxlabel}
        </label>
    )
}

export const ImageInput = ({ register, id, onfocus, error, change }) => {
    return (
        <div onClick={() => onfocus(id)}>
            <label htmlFor={`${id}`} className='imageLabel'>
                <FontAwesomeIcon icon={faCamera} />
                <input
                    {...register(id)}
                    className={error ? 'inputError' : ''}
                    type='file'
                    id={id}
                    accept='image/*'
                    onChange={(e) => change(e)}
                />
            </label>
            <div className='errormessage'>{error?.message}</div>
        </div>
    )
}

export const BusinessSelect = ({ register, id, onfocus, role_error, business_error, business_list, selectFor }) => {
    return (
        <>
            <select
                className={`inputErrorWrapper ${business_error || role_error ? 'inputError' : ''}`}
                {...register(id)}
                onFocus={onfocus}
                type='text'
                name={id}
            >
                <option value=''>{selectFor}</option>
                {
                    business_list.map(business => (
                        <option key={business.id} value={business.id}>{business.business_name}</option>
                    ))
                }
            </select>
            <div className='errormessage'>{business_error?.message}</div>
            <div className='errormessage'>{role_error?.message}</div>
        </>
    )
}

export const BusinessTypeSelect = ({register, onfocus, error }) => {
    return (
        <div className='inputErrorWrapper'>
            <select
                className={error ? 'inputError' : ''}
                {...register('business_type')}
                onFocus={() => onfocus('business_type')}
                type='text'
                name='business_type'
            >
                <option value='brand'>Brand</option>
                <option value='venue'>Dispensary</option>
                <option value='both'>{`Brand & Dispensary`}</option>
            </select>
            <div className='errormessage'>{error?.message}</div>
        </div>
    )
}

export const TextAreaInput = ({ register, id, onfocus, error, placeholder }) => {
    return (
        <>
            <textarea
                {...register(id)}
                className={error ? 'inputError' : ''}
                onFocus={() => onfocus(id)}
                name={id}
                rows='8'
                placeholder={placeholder}
            />
            <div className='errormessage'>{error?.message}</div>
        </>
    )
}

export const ContactInput = ({ register, id, onfocus, error }) => {
    return (
        <>
            <label htmlFor={`business_${id}'`} className='labelWrapper'>
                <div className='labelIcon'>
                    <FontAwesomeIcon icon={contact_icons[id]} size='2x' />
                </div>
                <input
                {...register(`business_${id}`)}
                className={error ? 'inputError' : ''}
                onFocus={() => onfocus(`business_${id}`)}
                type='text'
                id={`business_${id}`}
                placeholder={id.charAt(0).toUpperCase() + id.slice(1)}
                />
            </label>
            <div className='errormessage'>{error?.message}</div>
        </>
    )
}
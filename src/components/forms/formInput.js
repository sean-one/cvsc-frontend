import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';


export const FormInput = ({ register, id, onfocus, type, placeholder, error }) => {
    return (
        <div className='inputErrorWrapper'>
            <input
                {...register(id)}
                className={error ? 'inputError' : ''}
                onFocus={onfocus}
                type={type}
                name={id}
                placeholder={placeholder}
            />
            <div className='errormessage'>{error?.message}</div>
        </div>
    )
}

//! not working
export const ImageInput = ({ register, id, onfocus, error, change }) => {
    return (
        <>
            <label for={id} className='imageUpdateInput'>
                Select Image
                <FontAwesomeIcon icon={faCamera} className='cameraIcon' />
                <input
                    {...register(id)}
                    className={error ? 'inputError' : ''}
                    onFocus={onfocus}
                    type='file'
                    name={id}
                    accept='image/*'
                    onChange={change}
                />
            </label>
            <div className='errormessage'>{error?.message}</div>
        </>
    )
}

export const BusinessSelect = ({ register, id, onfocus, role_error, business_error, business_list, selectFor }) => {
    return (
        <>
            <select
                className={business_error || role_error ? 'inputError' : ''}
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

export const TextAreaInput = ({ register, id, onfocus, error, placeholder }) => {
    return (
        <>
            <textarea
                {...register(id)}
                className={error ? 'inputError' : ''}
                onFocus={onfocus}
                name={id}
                rows='8'
                placeholder={placeholder}
            />
            <div className='errormessage'>{error?.message}</div>
        </>
    )
}
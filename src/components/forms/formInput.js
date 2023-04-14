import React from 'react';
import styled from 'styled-components';
import { 
    AddImageIcon,
    InstagramIcon,
    WebSiteIcon,
    FacebookIcon,
    PhoneIcon,
    TwitterIcon
} from '../icons/siteIcons';

const InputStyles = styled.div`
    input, select, textarea {
        /* margin: 0.5rem 0; */
        width: 100%;
        padding: 0.5rem;
        border: none;
        color: var(--input-text-color);
        border-radius: 5px;
        border-bottom: 1px solid black;
        background-color: var(--input-background-color);
        box-shadow: 3px 2px 1px 0 var(--box-shadow-color);
        outline: none;
        
        ::placeholder {
            color: var(--main-text-color);
        }
    }
    
    .inputWrapper {
        border-radius: 5px;
        border-bottom: 1px solid black;
        box-shadow: 3px 2px 1px 0 var(--box-shadow-color);
        display: flex;
        flex-direction: column;
        margin: 0.5rem 0;
    }

    .updateCheckbox {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        width: 100%;
        
        input[type=checkbox] {
            width: 1rem;
            height: 1rem;
            margin: 0;
            margin-right: 0.25rem;
            padding: 0;
        }
    }

    .imageLabel {
        /* margin: 0.5rem 0; */
        cursor: pointer;
        /* width: 100%; */
        padding: 0.5rem;
        border: none;
        color: var(--main-text-color);
        border-radius: 5px;
        /* border-radius: 50%; */
        border-bottom: 1px solid black;
        background-color: var(--input-background-color);
        box-shadow: 3px 2px 1px 0 var(--box-shadow-color);
        outline: none;
        text-align: center;

        input {
            display: none;
        }
    }

    .labelWrapper {
        display: flex;
        align-items: center;
        
        div {
            /* border: 1px solid red; */
            /* width: 15%;
            
            @media(min-width: 400px) {
                width: 10%;
            } */
        }
    }
    
    .labelIcon {
        padding: 0.5rem;
        /* width: 1rem; */
    }

    .contactWrapper {
        background-color: var(--input-background-color);
        border-radius: 5px;
        box-shadow: 3px 2px 1px 0 var(--box-shadow-color);
        border-bottom: 1px solid black;

        input {
            border-bottom: none;
            box-shadow: none;
        }
    }

    .inputIcon {

    }

    .inputError {
        border-bottom: 2px solid var(--error-text-color);
    }

    .errormessage {
        width: 100%;
        text-align: left;
        /* padding: 0.25rem; */
        /* color: #8f0c0c; */
        color: var(--error-text-color);
        /* font-weight: bold; */
    }
`;

const contact_icons = {
    'instagram' : <InstagramIcon />,
    'website' : <WebSiteIcon />,
    'facebook' : <FacebookIcon />,
    'phone' : <PhoneIcon />,
    'twitter' : <TwitterIcon />
}

export const FormInput = ({ register, id, onfocus, type='text', placeholder, error }) => {
    return (
        <InputStyles>
            <input
                {...register(id)}
                className={error ? 'inputError' : ''}
                onFocus={() => onfocus(id)}
                type={type}
                name={id}
                placeholder={placeholder}
            />
            <div className='errormessage'>{error?.message}</div>
        </InputStyles>
    )
}

export const CheckBox = ({ register, id, boxlabel }) => {
    return (
        <InputStyles>
            <label htmlFor={id} className='updateCheckbox'>
                <input
                    {...register(id)}
                    type='checkbox'
                    name={id}
                />
                {boxlabel}
            </label>
        </InputStyles>
    )
}

export const ImageInput = ({ register, id, onfocus, error, change }) => {
    return (
        <InputStyles>
            <div onClick={() => onfocus(id)}>
                <label htmlFor={`${id}`} className='imageLabel'>
                    <AddImageIcon />
                    {/* <FontAwesomeIcon icon={faCamera} /> */}
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
        </InputStyles>
    )
}

export const BusinessSelect = ({ register, id, onfocus, role_error, business_error, business_list, selectFor }) => {
    return (
        <InputStyles>
            <select
                className={`inputWrapper ${business_error || role_error ? 'inputError' : ''}`}
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
        </InputStyles>
    )
}

export const BusinessTypeSelect = ({register, onfocus, error }) => {
    return (
        <InputStyles>
            <div className='inputWrapper'>
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
        </InputStyles>
    )
}

export const TextAreaInput = ({ register, id, onfocus, error, placeholder }) => {
    return (
        <InputStyles>
            <div className='inputWrapper'>
                <textarea
                    {...register(id)}
                    className={error ? 'inputError' : ''}
                    onFocus={() => onfocus(id)}
                    name={id}
                    rows='8'
                    placeholder={placeholder}
                />
                <div className='errormessage'>{error?.message}</div>
            </div>
        </InputStyles>
    )
}

export const ContactInput = ({ register, id, onfocus, error }) => {
    return (
        <InputStyles>
            <div className='contactWrapper'>
                <label htmlFor={`business_${id}'`} className='labelWrapper'>
                    <div className='labelIcon'>
                        {contact_icons[id]}
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
            </div>
        </InputStyles>
    )
}
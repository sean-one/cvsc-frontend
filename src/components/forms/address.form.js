import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import AutoComplete from 'react-google-autocomplete';

import { AddressIcon } from '../icons/siteIcons';

const AddressFormStyles = styled.div`
    .addressInputWrapper {
        margin: 0.25rem 0 0.1rem;
        display: flex;
        align-items: center; 
    }
`

const AddressForm = ({ register, setValue, errors, clearErrors, defaultValue=''}) => {
    const [ inputValue, setInputValue ] = useState(defaultValue)

    useEffect(() => {
        setValue('formatted_address', inputValue)
    }, [setValue, inputValue])

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    }

    const handleSelect = (place) => {
        setValue('formatted_address', place.formatted_address, { shouldDirty: true });
        setValue('place_id', place.place_id, { shouldDirty: true });
        setInputValue(place.formatted_address);
        clearErrors('formatted_address');
    }

    return (
        <AddressFormStyles>
            <div className='addressInputWrapper'>
                <label htmlFor="formatted_address"><AddressIcon /></label>
                <AutoComplete
                    apiKey={process.env.REACT_APP_GOOGLE_API_KEY}
                    {...register('formatted_address')}
                    name='formatted_address'
                    value={inputValue}
                    onChange={handleInputChange}
                    onClick={() => clearErrors('formatted_address')}
                    onPlaceSelected={handleSelect}
                    options={{
                        types: ['address'],
                    }}
                />
                {errors.formatted_address ? <div className='errormessage'>{errors.formatted_address?.message}</div> : null}
                {errors.place_id ? <div className='errormessage'>{errors.place_id?.message}</div> : null}
            </div>
        </AddressFormStyles>
    )
};

export default AddressForm;
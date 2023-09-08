import React, { useEffect, useState } from 'react';
import AutoComplete from 'react-google-autocomplete';


const AddressForm = ({ register, setValue, errors, clearErrors, defaultValue=null}) => {
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
        <div className='inputWrapper'>
            <label htmlFor="formatted_address">Address Search:</label>
            <AutoComplete
                apiKey={process.env.REACT_APP_GOOGLE_API_KEY}
                {...register('formatted_address')}
                name='formatted_address'
                className='formInput'
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
    )
};

export default AddressForm;
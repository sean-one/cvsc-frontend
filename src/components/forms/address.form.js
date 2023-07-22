import React, { useState } from 'react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';


const AddressForm = ({ register }) => {
    const [ value, setValue ] = useState(null)

    const handleAddressSelect = (data) => {
        console.log(data)
        setValue(data.label)
    }

    return (
        <div>
            <div>
                <label htmlFor="address">Address Search:</label>
                <GooglePlacesAutocomplete
                    apiKey={process.env.REACT_APP_GOOGLE_API_KEY}
                    {...register('address')}
                    selectProps={{
                        value,
                        onChange: handleAddressSelect,
                    }}
                    debounce={300}
                    types={['address']}
                />
            </div>
        </div>
    )
};

export default AddressForm;
import React, { useCallback, useEffect, useRef, useState } from 'react';


const AddressAutocomplete = ({ register, clearErrors, onAddressChange }) => {
    const inputRef = useRef(null);
    const [ suggestions, setSuggestions ] = useState([]);
    
    const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
    
    const clearFormErrors = useCallback(() => {
        if (clearErrors) {
            clearErrors();
        }
    }, [clearErrors]);

    const initializeAutocomplete = useCallback(() => {
        const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current);

        const handlePlaceChanged = () => {
            const place = autocomplete.getPlace();
            const address = place && place.formatted_address;

            if (address) {
                onAddressChange(address);
                setSuggestions([])
            }
        };

        autocomplete.addListener('place_changed', handlePlaceChanged);

        // clear form errors on input focus
        inputRef?.current?.addEventListener('focus', clearFormErrors);

        return () => {
            inputRef?.current?.removeEventListener('focus', clearFormErrors);
        };
    }, [onAddressChange, clearFormErrors]);

    useEffect(() => {
        const loadGoogleMapScript = () => {
            if (!window.google || !window.google.maps) {
                const script = document.createElement('script');
                script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
                script.async = true;
                script.defer = true;
                script.onload = () => { initializeAutocomplete() };

                script.onerror = () => { console.error('Failed to load Google Maps JavaScript API') };
                document.head.appendChild(script);
            } else {
                initializeAutocomplete()
            }
        };

        loadGoogleMapScript();

        // clean up
        return () => {};
    }, [apiKey, initializeAutocomplete]);

    const handleInputChange = (event) => {
        const { value } = event.target;
        const service = new window.google.maps.places.AutocompleteService();

        if (value) {
            service.getPlacePredictions({ input: value }, (predictions, status) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                    setSuggestions(predictions);
                } else {
                    setSuggestions([]);
                }
            });
        } else {
            setSuggestions([]);
        }
    };

    const handleSelectChange = (event) => {
        const { value } = event.target;

        const selectedSuggestion = suggestions.find((suggestion) => suggestion.description === value);

        if (selectedSuggestion) {
            onAddressChange(selectedSuggestion.description);
        } else {
            onAddressChange(value);
        }
    };


    return (
        <div>
            <input
                type='text'
                ref={inputRef}
                onChange={handleInputChange}
                placeholder='Enter an address'
                {...register('address')}
            />
            {suggestions.length > 0 && (
                <ul>
                    {suggestions.map((suggestion) => (
                        <li key={suggestion.place_id} onClick={() => handleSelectChange({ target: { value: suggestion.description } })}>
                            {suggestion.description}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AddressAutocomplete;
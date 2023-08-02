export const emailformat = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// ensures that the Instagram username consists of valid characters and meets length requirements
// optional @ symbol at the front
export const instagramFormat = /^@?[a-zA-Z0-9._]{1,30}$/

// allowing for optional "http" and "www" prefixes while accounting for valid TLDs
export const websiteFormat = /^(?:(?:https?:\/\/)?(?:www\.)?)?[\w-]+(\.[\w-]+)+[\w.,@?^=%&:/~+#-]*$/

// allows for alphanumeric characters, dots, underscores, and hyphens
// min of 5 characters for the username.
export const facebookFormat = /^[a-zA-Z0-9._-]{5,}$/

// allows phone numbers, including variations with or without parentheses, dashes, dots, or spaces
// validates 10-digit U.S. phone numbers.
export const phoneFormat = /^(?:\(\d{3}\)|\d{3})[-.]?\d{3}[-.]?\d{4}$/

// allows for alphanumeric characters and underscores. min of 1 character, max of 15 characters for the username.
// optional @ symbol at the front
export const twitterFormat = /^@?[a-zA-Z0-9_]{1,15}$/

export const uuidPattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

export const businessTypeList = /^(?:BRAND|VENUE|BOTH)$/i;


export const validateUsername = (value) => {
    const alphanumeric = /^[a-zA-Z0-9*@_.\-!$]+$/;
    const repeatingspecial = /^(?!.*([*@_.\-!$])\1)[a-zA-Z0-9*@_.\-!$]+$/;

    if(!alphanumeric.test(value)) {
        return 'can only contain alphanumeric, *, _, -, ., $, !, and @';
    }

    if(!repeatingspecial.test(value)) {
        return 'special characters cannot be repeated back to back';
    }

    return true;
}

export const validatePassword = (value, isRequired) => {
    if(!value) {
        return isRequired ? 'password is required' : true;
    }
    const passwordneeds = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$%^&*()_+-=,./?;:'"[\]{}|\\]).{8,}$/;
    
    if(value.length < 8) {
        return 'password is too short - must be at least 8 characters'
    }

    if(value.length >= 49) {
        return 'password is too long - must be under 50 characters'
    }

    if(!passwordneeds.test(value)) {
        return 'password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    }

    return true;
}

export const validateEventName = (value, isRequired) => {
    if(!value) {
        return isRequired ? 'event name is required' : true
    }

    if(value.length < 2) {
        return 'event name is too short'
    }

    if(value.length >= 49) {
        return 'event name is too long'
    }

    return true
}
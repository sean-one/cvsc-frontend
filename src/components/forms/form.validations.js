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

export const validateEmail = (value) => {
    const emailformat = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if(!emailformat.test(value)) {
        return 'invalid email format'
    }

    return true;
}

export const validatePassword = (value) => {
    // const passwordneeds = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$%^&*()_+-=,./?;:'"[\]{}|\\]).{8,}$/;
    
    // if(value.length < 8) {
    //     return 'password must be at least 8 characters'
    // }

    // if(value.length >= 49) {
    //     return 'password is too long'
    // }

    // if(!passwordneeds.test(value)) {
    //     return 'password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    // }

    return true;
}

export const validateBusinessType = (value) => {
    const businessType = ['brand', 'venue', 'both']

    if(!businessType.includes(value)) {
        return 'invalid business type'
    }

    return true;
}

export const validateStreetAddress = (value) => {
    const streetAddressFormat = /^[a-zA-Z0-9\s\-.,#&]*$/;

    if(!streetAddressFormat.test(value)) {
        return 'invalid street address'
    }

    return true;
}

export const validateCity = (value) => {
    const cityFormat = /^[a-zA-Z\s.'-]+(?:,\s*[a-zA-Z\s.'-]+)*$/;

    if(!cityFormat.test(value)) {
        return 'invalid city'
    }

    return true;
}

export const validateZip = (value) => {
    // validate a 5-digit ZIP code format commonly used in the United States
    // optional include a hyphen and four additional digits
    const zipFormat = /^\d{5}(?:-\d{4})?$/;

    if(!zipFormat.test(value)) {
        return 'invalid zip code'
    }

    return true;
}

export const validateInstagram = (value) => {
    // ensures that the Instagram username consists of valid characters and meets length requirements
    const instagramFormat = /^[a-zA-Z0-9._]{1,30}$/

    if(!instagramFormat.test(value)) {
        return 'invalid instagram'
    }

    return true;
}

export const validateWebsite = (value) => {
    // allowing for optional "http" and "www" prefixes while accounting for valid TLDs
    const websiteFormat = /^(?:(?:https?:\/\/)?(?:www\.)?)?[\w-]+(\.[\w-]+)+[\w.,@?^=%&:/~+#-]*$/

    if(!websiteFormat.test(value)) {
        return 'invalid url format'
    }

    return true;
}

export const validateFacebook = (value) => {
    // allows for alphanumeric characters, dots, underscores, and hyphens
    // min of 5 characters for the username.
    const facebookFormat = /^[a-zA-Z0-9._-]{5,}$"/

    if(!facebookFormat.test(value)) {
        return 'invalid Facebook'
    }

    return true;
}

export const validatePhone = (value) => {
    // allows phone numbers, including variations with or without parentheses, dashes, dots, or spaces
    // validates 10-digit U.S. phone numbers.
    const phoneFormat = /^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$"/

    if(!phoneFormat.test(value)) {
        return 'invalid phone number'
    }

    return true;
}

export const validateTwitter = (value) => {
    // allows for alphanumeric characters and underscores. min of 1 character, max of 15 characters for the username.
    // excludes the words "admin" and "support" from being used as usernames.
    const twitterFormat = /^(?!.*\b(admin|support)\b)[a-zA-Z0-9_]{1,15}$"/

    if(!twitterFormat.test(value)) {
        return 'invalid twitter'
    }

    return true;
}
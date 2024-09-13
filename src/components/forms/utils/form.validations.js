export const emailformat = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// ensures that the Instagram username consists of valid characters and meets length requirements
// optional @ symbol at the front
export const instagramFormat = /^@?[a-zA-Z0-9._]{1,30}$/

// allowing for optional "http" and "www" prefixes while accounting for valid TLDs
// export const websiteFormat = /^(?:(?:https?:\/\/)?(?:www\.)?)?[\w-]+(\.[\w-]+)+[\w.,@?^=%&:/~+#-]*$/
export const websiteFormat = /^(https?:\/\/)(www\.)?[\w-]+(\.[a-zA-Z]{2,})+$/;


// allows phone numbers, including variations with or without parentheses, dashes, dots, or spaces
// validates 10-digit U.S. phone numbers.
export const phoneFormat = /^(?:\(\d{3}\)|\d{3})[-.]?\d{3}[-.]?\d{4}$/

// allows for alphanumeric characters and underscores. min of 1 character, max of 15 characters for the username.
// optional @ symbol at the front
export const twitterFormat = /^@?[a-zA-Z0-9_]{1,15}$/

export const uuidPattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;


export const validateUsername = (value) => {
    const alphanumeric = /^[a-zA-Z0-9*@_.\-!$]+$/;
    const repeatingspecial = /^(?!.*([*@_.\-!$])\1)[a-zA-Z0-9*@_.\-!$]+$/;
    const noSpaces = /^[^\s]+$/;

    if(!noSpaces.test(value)) {
        return 'no spaces permitted in usernames'
    }

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

// validate event date is no earlier then today and not past 60 days
export const validateEventDate = (value, isRequired) => {
    // confirm that a value has been inputed
    if(!value) {
        return isRequired ? 'an event date is required' : true;
    }

    // get event date and todays date to compare
    const eventDate = new Date(value + 'T00:00:00')
    const todaysDate = new Date()

    // set todays hours to the morning
    todaysDate.setHours(0, 0, 0, 0);
    
    const maxDate = new Date();
    maxDate.setDate(todaysDate.getDate() + 60);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    if (eventDate >= todaysDate && eventDate <= maxDate) {
        return true;
    } else {
        return `current event dates must be between ${months[todaysDate.getMonth()]}. ${todaysDate.getDate()} - ${months[maxDate.getMonth()]}. ${maxDate.getDate()}`;
        
    }
}

// validate event time is 'hh:mm' in 24 hour format
export const validateEventTime = (value, isRequired) => {
    // confirm that a value has been inputed
    if (!value) { return isRequired ? 'an event starting & ending time is required' : true; }

    // create regex pattern for hh:mm in 24 hour format
    const timePattern = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/

    // check to see the input pattern matches 24-hour time format
    if (timePattern.test(value)) {
        return
    } else {
        return 'event time formatting is invalid'
    }
}

// validate business identifier is uuid format
export const validateEventBusiness = (value, isRequired) => {
    // confirm that a value has been inputed
    if (!value) { return isRequired ? 'a business name is required' : true; }

    // create regex pattern for uuid format
    const uuidPattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/

    // check to see the input pattern matches the uuid formatting
    if (uuidPattern.test(value)) {
        return true
    } else {
        return 'business name is invalid'
    }
}

// validate not an empty string - check for an empty string / used on input validation on non required fields
export const validateNONEmptyString = (value) => {
    if (value.trim() === '') {
        return 'empty string is not allowed'
    } else {
        return
    }
}
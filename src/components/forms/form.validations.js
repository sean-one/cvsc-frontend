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
    const emailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

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
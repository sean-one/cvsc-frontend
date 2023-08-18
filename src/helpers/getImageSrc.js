import default_profile from '../assets/default_user.png';

export const getImageSrc = (imageValue) => {
    if(!imageValue) {
        return default_profile;
    }

    if(imageValue.startsWith('http')) {
        return imageValue
    }

    return `${process.env.REACT_APP_BACKEND_IMAGE_URL}${imageValue}`
}
import default_profile from '../assets/default_user.png';

export const getImageSrc = (imageValue) => {
    const s3Base = 'https://coachellavalleysmokers-images.s3.amazonaws.com/'

    if(!imageValue) {
        return default_profile;
    }

    else if(imageValue.startsWith('http')) {
        return imageValue
    }

    else {
        return `${s3Base}${imageValue}`
    }

}
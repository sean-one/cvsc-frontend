import default_user from '../assets/default_user_icon.webp';

export const image_link = (db_image) => {
    // error handling for null or undefined that sneak thru
    if (!db_image) return default_user
    // check for db return to be image url
    const http_link = /^(blob|http|https)/g
    // if not url, image should be found on s3
    if(db_image.match(http_link) === null) {
        return `https://coachellavalleysmokers-images.s3.amazonaws.com/${db_image}`
    } else {
        return db_image
    }
}
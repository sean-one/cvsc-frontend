
export const update_event = (data, df) => {
    // save venue_id & brand_id and reattach if needed after checking for update change
    const venue_id = data.venue_id
    const brand_id = data.brand_id

    //remove unchanged fields
    const dirtyList = Object.keys(df)
    for (const [key] of Object.entries(data)) {
        if(!dirtyList.includes(key)) {
            delete data[key]
        }
    }

    data['venue_id'] = venue_id
    data['brand_id'] = brand_id
    // check for updated venue id and attach current if nothing new
    // if(!data.hasOwnProperty('venue_id')){
    //     data['venue_id'] = venue_id
    // }
    
    // // check for updated brand id and attach current if nothing new
    // if(data.hasOwnProperty('brand_id')){
    //     data['brand_id'] = brand_id
    // }

    return data;
}

export const image_link = (db_image) => {
    // check for db return to be image url
    const http_link = /^(http|https)/g
    // if not url, image should be found on s3
    if(db_image.match(http_link) === null) {
        return `${process.env.REACT_APP_BACKEND_IMAGE_URL}${db_image}`
    } else {
        return db_image
    }
}

export const role_types = {
    [process.env.REACT_APP_BASIC_ACCOUNT]: 'basic',
    [process.env.REACT_APP_CREATOR_ACCOUNT]: 'creator',
    [process.env.REACT_APP_MANAGER_ACCOUNT]: 'manager',
    [process.env.REACT_APP_ADMIN_ACCOUNT]: 'admin'
}
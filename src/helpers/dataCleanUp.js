
export const update_Business = (data, df) => {
    
    // removed unchanged fields
    const dirtyList = Object.keys(df)
    for (const [key] of Object.entries(data)) {
        if(!dirtyList.includes(key)) {
            delete data[key]
        }
    }

    // createContact(data)
    // createBusiness(data)
    
    return data
}

export const update_event = (data, df) => {
    const venue_id = data.venue_id
    const brand_id = data.brand_id

    //remove unchanged fields
    const dirtyList = Object.keys(df)
    for (const [key] of Object.entries(data)) {
        if(!dirtyList.includes(key)) {
            delete data[key]
        }
    }

    // check for updated venue id and attach current if nothing new
    if(!data.hasOwnProperty('venue_id')){
        data['venue_id'] = venue_id
    }
    
    // check for updated brand id and attach current if nothing new
    if(data.hasOwnProperty('brand_id')){
        data['brand_id'] = brand_id
    }

    return data;
}

export const createBusiness = (data) => {
    data.business = {
        ...(data['business_name'] && { ...data.business, name: data['business_name'] }),
        ...(data['business_description'] && { ...data.business, description: data['business_description'] }),
        ...(data['business_type'] && { ...data.business, businesstype: data['business_type'] }),
        ...(data['business_avatar'] && { ...data.business, avatar: data['business_avatar'] })
    }

    delete data['business_name']
    delete data['business_description']
    delete data['business_type']
    delete data['business_avatar']

    return data;
}

export const createContact = (data) => {
    data.contact = {
        ...(data['email'] && { ...data.contact, email: data['email']}),
        ...(data['instagram'] && { ...data.contact, instagram: data['instagram']}),
        ...(data['facebook'] && { ...data.contact, facebook: data['facebook']}),
        ...(data['website'] && { ...data.contact, website: data['website'] }),
        ...(data['phone'] && { ...data.contact, phone: data['phone'] })
    }

    delete data['email']
    delete data['instagram']
    delete data['facebook']
    delete data['website']
    delete data['phone']

    return data
}

export const createLocation = (data) => {
    data.location = {
        ...(data['street_address'] && { ...data.location, street: data['street_address']}),
        ...(data['city'] && { ...data.location, city: data['city']}),
        ...(data['state'] && { ...data.location, state: data['state']}),
        ...(data['zip'] && { ...data.location, zip: data['zip']})
    }

    delete data['street_address']
    delete data['city']
    delete data['state']
    delete data['zip']

    return data
}

export const addBusiness = (data) => {
    if (data['business_type'] !== 'brand') {
        createLocation(data)
    }

    createContact(data)
    createBusiness(data)

    return data
}

export const update_Business = (data, df) => {
    
    // removed unchanged fields
    const dirtyList = Object.keys(df)
    for (const [key] of Object.entries(data)) {
        if(!dirtyList.includes(key)) {
            delete data[key]
        }
    }

    createContact(data)
    createBusiness(data)
    
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

export const registerCleanUp = (user) => {
    let contact = {}
    
    if(user['instagram'] === '') {
        contact = { email: user['email'] }
    } else {
        contact = { email: user['email'], instagram: user['instagram'] }
    }

    delete user['instagram']
    delete user['email']
    delete user['confirmation']
    
    return { user, contact }
}

export const roleRequestStatusUpdate = (data, requestList) => {
    const approvedRequest = []
    const rejectedRequest = []

    for (const dataline in data) {
        if (data[dataline] === "approved") {
            const approvedRequestLine = requestList.filter(request => request.id === Number(dataline))
            approvedRequest.push({ requestId: approvedRequestLine[0].id, user_id: approvedRequestLine[0].user_id, business_id: approvedRequestLine[0].business_id, roletype: approvedRequestLine[0].request_for })
        } else if (data[dataline] === "rejected") {
            const rejectedRequestLine = requestList.filter(request => request.id === Number(dataline))
            rejectedRequest.push({ id: rejectedRequestLine[0].id, business_id: rejectedRequestLine[0].business_id })
        }
    }
    return { approved: approvedRequest, rejected: rejectedRequest }
}

export const roleEditUpdate = (data) => {
    const toBeDeleted = []

    for (const dataline in data) {
        if(data[dataline] === 'delete') {
            // this may need to be changed with addition of uuid
            toBeDeleted.push(Number(dataline))
        }
    }

    return toBeDeleted;
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
    console.log(data)
    if (data['business_type'] !== 'brand') {
        createLocation(data)
        // console.log('no location')
        // data.location = {
        //     street_address: data['location_street'],
        //     city_state: data['location_city_state'],
        //     zip: data['location_zip']
        // }
        // delete data['location_street']
        // delete data['location_city_state']
        // delete data['location_zip']
    }

    createContact(data)
    // data.contact = {
    //     instagram: data['contact_instagram']
    // }

    // delete data['contact_instagram']

    // data.contact = {
    //     ...(data['contact_website'] && { ...data.contact, website: data['contact_website']}),
    //     ...(data['contact_phone'] && { ...data.contact, phone: data['contact_phone']})
    // }

    // delete data['contact_website']
    // delete data['contact_phone']

    return data
}
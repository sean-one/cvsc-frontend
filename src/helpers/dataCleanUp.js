
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
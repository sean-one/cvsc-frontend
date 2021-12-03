
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

export const requestSubmit = (data, requestList) => {
    const approvedRequest = []
    const rejectedRequest = []

    for (const dataline in data) {
        if (data[dataline] === "approved") {
            const approvedRequestLine = requestList.filter(request => request.id === Number(dataline))
            approvedRequest.push({ requestId: approvedRequestLine[0].id, user_id: approvedRequestLine[0].user_id, business_id: approvedRequestLine[0].business_id, roletype: approvedRequestLine[0].request_for})
        } else if (data[dataline] === "rejected") {
            const rejectedRequestLine = requestList.filter(request => request.id === Number(dataline))
            rejectedRequest.push({ id: rejectedRequestLine[0].id })
        }
    }
    return { approved: approvedRequest, rejected: rejectedRequest }
}
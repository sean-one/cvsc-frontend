
export const requestSubmit = (data, requestList) => {
    const approvedRequest = []
    const rejectedRequest = []

    for (const dataline in data) {
        if (data[dataline] === "approved") {
            const approvedRequestLine = requestList.filter(request => request.id === Number(dataline))
            approvedRequest.push(approvedRequestLine[0])
        } else if (data[dataline] === "rejected") {
            const rejectedRequestLine = requestList.filter(request => request.id === Number(dataline))
            rejectedRequest.push(rejectedRequestLine[0])
        }
    }

    // console.log(approvedRequest)
    // console.log(rejectedRequest)
    // console.log(data)
    // console.log(requestList)
    return { approved: approvedRequest, rejected: rejectedRequest }
}
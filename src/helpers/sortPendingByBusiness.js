const sortPendingByBusiness = (pending) => {
    if (pending === undefined) return {}
    return pending.reduce((obj, role) => {
        if(!obj.hasOwnProperty(role.business_name)) {
            obj[role.business_name] = []
        }

        obj[role.business_name].push(role)

        return obj;
    }, {});
}

export default sortPendingByBusiness;
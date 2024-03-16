export const userKeys = {
    all: ['users'],
    detail: (user_id) => [...userKeys.all, 'detail', user_id],
};

export const eventKeys = {
    all: ['events'],
    list: (filter) => [...eventKeys.all, { filter }],
    detail: (event_id) => [...eventKeys.all, 'detail', event_id],
    relatedToEvent: (event_id) => [...eventKeys.all, 'relatedToEvent', event_id],
    relatedToBusiness: (business_id) => [...eventKeys.all, 'relatedToBusiness', business_id],
    relatedToUser: (user_id) => [...eventKeys.all, 'relatedToUser', user_id],
};

export const businessKeys = {
    all: ['businesses'],
    list: (filter) => [...businessKeys.all, { filter }],
    detail: (business_id) => [...businessKeys.all, 'details', business_id],
    userManagedBusinesses: (user_id) => [...businessKeys.all, 'managedByUser', user_id],
};

export const roleKeys = {
    all: ['roles'],
    relatedToUser: (user_id) => [...roleKeys.all, 'relatedToUser', user_id],
    userAccountRole: (user_id) => [...roleKeys.relatedToUser(user_id), 'accountRole'],
    userRoles: (user_id) => [...roleKeys.relatedToUser(user_id), 'allRoles',],
    relatedToBusiness: (business_id) => [...roleKeys.all, 'relatedToBusiness', business_id],
    businessRoles: (business_id) => [...roleKeys.relatedToBusiness(business_id), 'allRoles'],
    managerRoles: (business_id) => [...roleKeys.relatedToBusiness(business_id), 'managementRoles'],
};

export const businessTagKeys = {
    all: ['business_tags'],
    relatedToBusiness: (business_id) => [...businessTagKeys.all, 'relatedToBusiness', business_id],

}
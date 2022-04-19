import { useContext } from 'react';

import { SiteContext } from '../context/site/site.provider';
import { UsersContext } from '../context/users/users.provider';

const useBusinessFilter = (business_id = null) => {
    const { businessList } = useContext(SiteContext);
    const { useBusinessIdRoles } = useContext(UsersContext)
    const userRolesIdArray = useBusinessIdRoles()

    let business_filtered = businessList
    let business


    // remove inactive and request closed businesses
    business_filtered = business_filtered.filter(business => (business.requestOpen === true) && (business.activeBusiness === true))

    // brand and venue list for current active businesses
    const venue_list = business_filtered.filter(business => (business.businesstype === 'venue' || business.businesstype === 'both') && business.activeBusiness === true)
    const brand_list = business_filtered.filter(business => (business.businesstype === 'brand' || business.businesstype === 'both') && business.activeBusiness === true)

    // remove business with current creator or admin roles
    if (userRolesIdArray.length > 0) {
        business_filtered = business_filtered.filter(business => !userRolesIdArray.includes(business.id))
    }

    // return single business from business id input
    if (business_id) {
        business = businessList.find(business => business.id === Number(business_id))
    }

    // return a list based on business type
    const venue_filtered = business_filtered.filter(business => (business.businesstype === 'venue') || (business.businesstype === 'both'))
    const brand_filtered = business_filtered.filter(business => business.businesstype === 'brand')

    return { business, business_filtered, venue_filtered, brand_filtered, venue_list, brand_list }
}

export default useBusinessFilter;
import { useContext } from 'react';

import { SiteContext } from '../context/site/site.provider';
import { UsersContext } from '../context/users/users.provider';

const useBusinessListFilter = () => {
    const { businessList } = useContext(SiteContext);
    const { useBusinessIdRoles } = useContext(UsersContext)
    const userRolesIdArray = useBusinessIdRoles()
    let business_filtered = businessList

    // remove inactive and request closed businesses
    business_filtered = business_filtered.filter(business => (business.requestOpen === true) && (business.activeBusiness === true))

    // brand and venue list for current active businesses
    const venue_list = business_filtered.filter(business => (business.businesstype === 'venue' || business.businesstype === 'both') && business.activeBusiness === true)
    const brand_list = business_filtered.filter(business => (business.businesstype === 'brand' || business.businesstype === 'both') && business.activeBusiness === true)


    if (userRolesIdArray.length > 0) {
        business_filtered = business_filtered.filter(business => !userRolesIdArray.includes(business.id))
    }

    const venue_filtered = business_filtered.filter(business => (business.businesstype === 'venue') || (business.businesstype === 'both'))
    const brand_filtered = business_filtered.filter(business => business.businesstype === 'brand')
    
    return { business_filtered, venue_filtered, brand_filtered, venue_list, brand_list }
}

export default useBusinessListFilter;
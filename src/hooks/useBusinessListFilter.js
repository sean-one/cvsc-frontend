import { useContext } from 'react';

import { SiteContext } from '../context/site/site.provider';
import { UsersContext } from '../context/users/users.provider';

const useBusinessListFilter = () => {
    const { businessList } = useContext(SiteContext);
    const { useBusinessIdRoles } = useContext(UsersContext)
    const userRolesIdArray = useBusinessIdRoles()
    let filteredBusiness = businessList

    if (userRolesIdArray.length > 0) {
        filteredBusiness.filter(business => !userRolesIdArray.includes(Number(business.id)))
    }
    console.log(filteredBusiness)
    return filteredBusiness
}

export default useBusinessListFilter;
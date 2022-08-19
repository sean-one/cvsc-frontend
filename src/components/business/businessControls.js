import React, { useContext } from 'react'

import { UsersContext } from '../../context/users/users.provider';

const BusinessContols = ({ business_id }) => {
    const { getBusinessRole } = useContext(UsersContext)
    const user_role = getBusinessRole(business_id)

    
    return (
        <div className='d-flex justify-content-around'>
            <div>veiw</div>
            {
                (user_role.role_type === 'admin') &&
                    <div>deactivate</div>
            }
            <div>edit</div>
            {
                (user_role.role_type === 'admin') &&
                    <div>delete</div>
            }
        </div>
    )
}

export default BusinessContols;
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { role_types } from '../../helpers/dataCleanUp';
import { useUserRolesQuery } from '../../hooks/useRolesApi';
import RemoveUserRole from './buttons/remove.user.role';
import LoadingSpinner from '../loadingSpinner';


const UserRoles = ({ user_id }) => {
    const { data: user_roles, isLoading, isSuccess } = useUserRolesQuery(user_id)

    let navigate = useNavigate()
    
    if(isLoading) {
        return <LoadingSpinner/>
    }
    
    if(isSuccess) {
        user_roles.data.sort((a,b) => b.active_role - a.active_role)
    }


    
    return (
        <div className='bg-light rounded p-1 mb-2'>
            <h6 className='mb-0'>CURRENT ROLES</h6>
            {
                user_roles.data.map(role =>
                    <div key={role.id} className={`d-flex justify-content-between align-items-end ps-2 pb-1 border-bottom rounded-bottom ${role.active_role ? '' : 'text-danger'}`}>
                        <div className='me-2'>
                            {role_types[role.role_type].charAt().toUpperCase()}
                        </div>
                        <div onClick={() => navigate(`/business/${role.business_id}`)}className='text-start flex-fill'>
                            {role.business_name}
                        </div>
                        <div className='mx-1'>
                            {role.active_role ? 'Active' : 'pending'}
                        </div>
                        <div className='mx-1'>
                            <RemoveUserRole role_id={role.id} role_type={role.role_type}/>
                        </div>
                    </div>
                ) 
            }
        </div>
    )
}

export default UserRoles;
import React from 'react';

import { useRoleDelete } from '../../../hooks/useRolesApi';
import { DeleteIcon } from '../../icons/siteIcons';


const DeleteRole = ({ role }) => {
    const { mutateAsync: deleteRole } = useRoleDelete();

    const sendRoleDelete = async (role_id) => {
        try {
            await deleteRole(role_id)

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='deleteButton' onClick={() => sendRoleDelete(role.id)}>
            <DeleteIcon />
        </div>
    )
}

export default DeleteRole;
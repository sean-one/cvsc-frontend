import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Accordion } from 'react-bootstrap';

import { role_types } from '../../../helpers/dataCleanUp';
import RemoveUserRole from '../../roles/buttons/remove.user.role';


const UserRoles = ({ roles }) => {

    let navigate = useNavigate()
    
    if(roles) {
        roles.sort((a,b) => b.active_role - a.active_role)
    }

    
    return (
        <div className='bg-light rounded p-1 mb-2'>
            <Accordion flush>
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Current Roles</Accordion.Header>
                    <Accordion.Body className='p-1'>
                        {
                            roles.map(role =>
                                <div key={role.id} className={`d-flex justify-content-between align-items-end ps-2 pb-1 border-bottom rounded-bottom ${role.active_role ? '' : 'text-danger'}`}>
                                    <div className='me-2'>
                                        {role_types[role.role_type].charAt().toUpperCase()}
                                    </div>
                                    <div onClick={() => navigate(`/business/${role.business_id}`)} className='text-start flex-fill'>
                                        {role.business_name}
                                    </div>
                                    <div className='mx-1'>
                                        {role.active_role ? 'Active' : 'pending'}
                                    </div>
                                    <div className='mx-1'>
                                        <RemoveUserRole role_id={role.id} role_type={role.role_type} />
                                    </div>
                                </div>
                            )
                        }
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </div>
    )
}

export default UserRoles;
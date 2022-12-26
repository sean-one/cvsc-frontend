import React from 'react';

import ApproveRole from './buttons/approve.role';
import UpgradeRole from './buttons/upgrade.role';
import DowngradeRole from './buttons/downgrade.role';
import RemoveRole from './buttons/remove.role';


const RolesList = ({ roles_list, list_type }) => {


    return (
        <div>
          {
              roles_list.map(role =>
                <div key={role.id} className='d-flex justify-content-between align-items-end px-3 py-1 border-bottom rounded-bottom'>
                  <div>{role.username}</div>
                  <div className='d-flex'>
                    <div className='text-center me-4'>
                        { (list_type === 'pending') && <ApproveRole role_id={role.id} /> }
                        { (list_type === 'creator') && <UpgradeRole role_id={role.id} /> }
                        { (list_type === 'manager') && <DowngradeRole role_id={role.id} /> }
                    </div>
                    <div className='text-center'>
                        <RemoveRole role_id={role.id} />
                    </div>
                  </div>
                </div>
            )
          }
        </div>
    )
}

export default RolesList;
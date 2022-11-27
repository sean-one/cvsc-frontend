import React from 'react';

import ApproveRequestButton from './buttons/approveRequestButton';
import DeleteRequestButton from './buttons/deleteRequestButton';
import UpgradeButton from './buttons/upgradeButton';
import DowngradeButton from './buttons/downgradeButton';
import RemoveRoleButton from './buttons/removeRoleButton';

const RolesList = ({ roles_list, list_type }) => {


    return (
        <div>
          {
              roles_list.map(role =>
                <div key={role.id} className='d-flex justify-content-between align-items-end px-3 py-1 border-bottom rounded-bottom'>
                  <div>{role.username}</div>
                  <div className='d-flex'>
                    <div className='text-center me-4'>
                        { (list_type === 'pending') && <ApproveRequestButton role_id={role.id} /> }
                        { (list_type === 'creator') && <UpgradeButton role_id={role.id} /> }
                        { (list_type === 'manager') && <DowngradeButton role_id={role.id} /> }
                    </div>
                    <div className='text-center'>
                        { (list_type === 'pending') && <DeleteRequestButton role_id={role.id} /> }
                        { (list_type === 'creator') && <DeleteRequestButton role_id={role.id} /> }
                        { (list_type === 'manager') && <RemoveRoleButton role_id={role.id} /> }
                    </div>
                  </div>
                </div>
            )
          }
        </div>
    )
}

export default RolesList;
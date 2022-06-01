import React from 'react'
import { ListGroup } from 'react-bootstrap'

const ManagerRoleList = ({ manager_roles }) => {
  return (
    <ListGroup variant='flush'>
          {
              manager_roles.map(role =>
                <ListGroup.Item key={role.id}>{`${role.username} / ${role.role_type}`}</ListGroup.Item>
            )
          }
    </ListGroup>
  )
}

export default ManagerRoleList
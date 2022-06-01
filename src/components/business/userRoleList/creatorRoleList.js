import React from 'react'
import { ListGroup } from 'react-bootstrap'

const CreatorRoleList = ({ creator_roles }) => {
  return (
    <ListGroup variant='flush'>
          {
                creator_roles.map(role => 
                    <ListGroup.Item key={role.id}>{`${role.username} / ${role.role_type}`}</ListGroup.Item>
                )
          }
    </ListGroup>
  )
}

export default CreatorRoleList
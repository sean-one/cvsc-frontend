import React, { useContext } from 'react'
import { Button, Col, ListGroup } from 'react-bootstrap'

import { SiteContext } from '../../../../context/site/site.provider'

const ManagerRoleList = () => {
  const { useManagers } = useContext(SiteContext)
  const manager_roles = useManagers
  
  
  return (
    <ListGroup variant='flush'>
          {
              manager_roles.map(role =>
                <ListGroup.Item key={role.id} className='d-flex'>
                  <Col sm={10}>{role.username}</Col>
                  <Col sm={2}>
                    <Button size='sm' variant='danger'>remove</Button>
                  </Col>
                </ListGroup.Item>
            )
          }
    </ListGroup>
  )
}

export default ManagerRoleList
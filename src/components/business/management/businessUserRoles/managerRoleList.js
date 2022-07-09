import React from 'react'
import { Button, Col, ListGroup } from 'react-bootstrap'

const ManagerRoleList = ({ manager_roles }) => {
  

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
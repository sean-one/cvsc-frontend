import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { Button, Col, ListGroup } from 'react-bootstrap'
import { useManagerDowngradeMutation } from '../../../../hooks/useBusinessApi'

import { NotificationsContext } from '../../../../context/notifications/notifications.provider'

const ManagerRoleList = ({ manager_roles }) => {
  const { dispatch } = useContext(NotificationsContext);
  let history = useHistory()
  const { mutateAsync: managerDowngradeMutation } = useManagerDowngradeMutation()
  
  const downgradeManagerRole = async (e) => {
    const downgrade_response = await managerDowngradeMutation(e.currentTarget.value)

    if(downgrade_response.status === 200) {
      dispatch({
        type: "ADD_NOTIFICATION",
        payload: {
          notification_type: 'SUCCESS',
          message: `${downgrade_response.data.username} has been downgraded to creator privileges`
        }
      })
    } else {
      dispatch({
        type: "ADD_NOTIFICATION",
        payload: {
          notification_type: 'ERROR',
          message: 'something is not right'
        }
      })
      history.push('/login')
    }
  }

  return (
    <ListGroup variant='flush'>
          {
              manager_roles.map(role =>
                <ListGroup.Item key={role.id} className='d-flex'>
                  <Col sm={8}>{role.username}</Col>
                  <Col sm={2}>
                    <Button size='sm' variant='info' onClick={(e) => downgradeManagerRole(e)} value={role.id}>downgrade</Button>
                  </Col>
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
import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { Button, Col, ListGroup } from 'react-bootstrap'
import { useManagerDowngradeMutation, useManagerRoleDeleteMutation } from '../../../../hooks/useBusinessApi'

import { NotificationsContext } from '../../../../context/notifications/notifications.provider'

const ManagerRoleList = ({ manager_roles }) => {
  const { dispatch } = useContext(NotificationsContext);
  let history = useHistory()
  
  const { mutateAsync: managerDowngradeMutation } = useManagerDowngradeMutation()
  const { mutateAsync: managerDeleteMutation } = useManagerRoleDeleteMutation()
  
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

  const removeManagerRole = async (e) => {
    const removed_manager = await managerDeleteMutation(e.currentTarget.value)

    if(removed_manager.status === 200) {
      dispatch({
        type: "ADD_NOTIFICATION",
        payload: {
          notification_type: 'SUCCESS',
          message: `manager role has been deleted`
        }
      })
    } else {
      dispatch({
        type: "ADD_NOTIFICATION",
        payload: {
          notification_type: 'ERROR',
          message: 'error inside manager remove'
        }
      })
    }
  }

  return (
    <ListGroup variant='flush'>
          {
              manager_roles.map(role =>
                <ListGroup.Item key={role.id} className='d-flex px-3'>
                  <Col xs={6}>{role.username}</Col>
                  <Col xs={3} className='text-center'>
                    <Button size='sm' variant='outline-danger' onClick={(e) => downgradeManagerRole(e)} value={role.id}>downgrade</Button>
                  </Col>
                  <Col xs={3} className='text-center'>
                    <Button size='sm' variant='danger' onClick={(e) => removeManagerRole(e)} value={role.id}>remove</Button>
                  </Col>
                </ListGroup.Item>
            )
          }
    </ListGroup>
  )
}

export default ManagerRoleList
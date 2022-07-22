import React, { useContext } from 'react';
import { Button, Col, ListGroup } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

import { useCreatorUpgradeMutation, useUserRoleDeleteMutation } from '../../../../hooks/useBusinessApi';
import { NotificationsContext } from '../../../../context/notifications/notifications.provider'

const CreatorRoleList = ({ creator_roles }) => {
  const { dispatch } = useContext(NotificationsContext)
  let history = useHistory()

  const { mutateAsync: creatorUpgradeMutation } = useCreatorUpgradeMutation()
  const { mutateAsync: creatorDeleteMutation } = useUserRoleDeleteMutation()

  const upgradeCreator = async (e) => {
    const upgrade_response = await creatorUpgradeMutation(e.currentTarget.value)
    
    if(upgrade_response.status === 200) {
      dispatch({
        type: "ADD_NOTIFICATION",
        payload: {
          notification_type: 'SUCCESS',
          message: `${upgrade_response.data.username} now has ${upgrade_response.data.role_type} privileges`
        }
      })
    } else {
      dispatch({
          type: "ADD_NOTIFICATION",
          payload: {
              notification_type: 'ERROR',
              message: 'token authorization error, please sign in'
          }
      })
      history.push('/login')
    }
  }

  const removeCreator = async (e) => {
    const removal_response = await creatorDeleteMutation(e.currentTarget.value)
    
    if (removal_response.status === 200) {
      dispatch({
        type: "ADD_NOTIFICATION",
        payload: {
          notification_type: 'SUCCESS',
          message: `creator role has been deleted`
        }
      })
    } else {
      dispatch({
          type: "ADD_NOTIFICATION",
          payload: {
              notification_type: 'ERROR',
              message: 'token authorization error, please sign in'
          }
      })
      history.push('/login')
    }
  }


  return (
    <ListGroup variant='flush'>
          {
                creator_roles.map(role => 
                    <ListGroup.Item key={role.id} className='d-flex px-3'>
                      <Col xs={6}>{role.username}</Col>
                      <Col xs={3} className='text-center'>
                        <Button size='sm' variant='outline-success' onClick={(e) => upgradeCreator(e)} value={role.id}>upgrade</Button>
                      </Col>
                      <Col xs={3} className='text-center'>
                        <Button size='sm' variant='danger' onClick={(e) => removeCreator(e)} value={role.id}>remove</Button>
                      </Col>
                    </ListGroup.Item>
                )
          }
    </ListGroup>
  )
}

export default CreatorRoleList
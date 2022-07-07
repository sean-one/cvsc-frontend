import React, { useContext } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { Button, Col, ListGroup } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

import AxiosInstance from '../../../../helpers/axios'
import { upgradeCreator } from '../../../../hooks/useBusinessApi';
import { NotificationsContext } from '../../../../context/notifications/notifications.provider'
import { SiteContext } from '../../../../context/site/site.provider'

const CreatorRoleList = ({ creator_roles }) => {
  const queryClient = useQueryClient()
  // const { updateBusinessUserRoles } = useContext(SiteContext)
  const { dispatch } = useContext(NotificationsContext)
  let history = useHistory()

  // const { mutateAsync } = useMutation(upgradeCreator, {
  //   onMutate: ({ data: new_manager }) => {

  //   },
  //   onError: () => {},
  //   onSettled: () => {}
  // })
  const upgradeCreator = (e) => {
    // const request_data = { request_id: e.currentTarget.value }
    // const token = localStorage.getItem('token')

    // AxiosInstance.post(`/roles/upgrade/creator/${request_data.request_id}`, request_data, {
    //   headers: { 'Authorization': 'Bearer ' + token }
    // })
    //   .then(response => {
    //     updateBusinessUserRoles(request_data.request_id, response.data)
    //     dispatch({
    //       type: "ADD_NOTIFICATION",
    //       payload: {
    //         notification_type: 'SUCCESS',
    //         message: 'request has been upgraded'
    //       }
    //     })
    //   })
    //   .catch(err => {
    //     if (err.response.status === 401) {
    //                 dispatch({
    //                     type: "ADD_NOTIFICATION",
    //                     payload: {
    //                         notification_type: 'ERROR',
    //                         message: 'token authorization error, please sign in'
    //                     }
    //                 })
    //                 history.push('/login')
    //             } else {
    //                 console.log(err.response)
    //             }
    //   })


  }


  return (
    <ListGroup variant='flush'>
          {
                creator_roles.map(role => 
                    <ListGroup.Item key={role.id} className='d-flex'>
                      <Col sm={8}>{role.username}</Col>
                      <Col sm={2}>
                        <Button size='sm' variant='success' onClick={(e) => upgradeCreator(e)} value={role.id}>upgrade</Button>
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

export default CreatorRoleList
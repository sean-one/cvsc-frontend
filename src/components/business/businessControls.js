import React, { useState, useContext } from 'react'
import { Link, withRouter } from 'react-router-dom';
import { Modal } from 'react-bootstrap';

import BusinessRequestToggle from './businessRequestToggle';
import BusinessActiveToggle from './businessActiveToggle';
import EditBusiness from './editBusiness';
import { UsersContext } from '../../context/users/users.provider';

const BusinessContols = ({ business, location }) => {
    const business_id = business.id
    const { getBusinessRole } = useContext(UsersContext)
    const user_role = getBusinessRole(business_id)
    const [ modalShow, setModalShow ] = useState(false)

    const handleModalOpen = () => setModalShow(true);
    const handleModalClose = () => setModalShow(false);
    

    return (
        <div className='d-flex flex-column ps-4 bg-light rounded-bottom mb-4 shadow'>
            <div>
                <Link to={{
                    pathname: `/business/manage/${business_id}`,
                    state: {
                        business_id: business_id,
                        from: location.pathname
                    }
                }}>View Business</Link>
            </div>
            <div onClick={handleModalOpen}>Edit Business</div>
            {
                (user_role.role_type === 'admin') &&
                    <BusinessRequestToggle business_id={business.id} request_open={business.business_request_open} />
            }
            {
                (user_role.role_type === 'admin') &&
                    <BusinessActiveToggle business_id={business.id} isActive={business.active_business} />
            }
            <Modal show={modalShow} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{business.business_name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <EditBusiness business={business} handleClose={handleModalClose} />
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default withRouter(BusinessContols);
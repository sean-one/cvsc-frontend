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
        <div className='d-flex flex-column'>
            <div className='d-flex justify-content-around'>
                <div>
                    <Link to={{
                        pathname: `/business/manage/${business_id}`,
                        state: {
                            business_id: business_id,
                            from: location.pathname
                        }
                    }}>view</Link>
                </div>
                <div onClick={handleModalOpen}>edit</div>
            </div>
            {
                (user_role.role_type === 'admin') &&
                    <div className='d-flex justify-content-around'>
                        <BusinessRequestToggle business_id={business.id} request_open={business.business_request_open} />
                        <BusinessActiveToggle business_id={business.id} isActive={business.active_business} />
                    </div>

            }
            <Modal show={modalShow} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <EditBusiness business={business} handleClose={handleModalClose} />
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default withRouter(BusinessContols);
import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Col, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

import CreateBusinessButton from '../../business/buttons/createBusinessButton';
import CreateEventButton from '../../events/buttons/createEventButton';

import { UsersContext } from '../../../context/users/users.provider';
import AccountDetails from './accountDetails';

const BasicSection = () => {
    const { setAccountType } = useContext(UsersContext);
    const account_type = setAccountType()

    let history = useHistory()

    const rolesLink = () => {
        history.push('/roles')
    }

    const calendarLink = () => {
        history.push('/user_calendar')
    }

    return (
        <div className='border border-danger'>
            <Row className='m-0 py-2'>
                <Col xs={6} className='m-0 p-0'>
                    <CreateBusinessButton />
                </Col>
                {
                    (account_type !== 'basic') &&
                        <Col xs={6} className='m-0 p-0 text-end'>
                            <CreateEventButton />
                        </Col>
                }
            </Row>
            <AccountDetails />
            <div className='bg-light d-flex justify-content-between align-items-center rounded p-2 my-1' onClick={() => rolesLink()}>
                <p className='lh-sm m-0'>Roles Tab</p>
                <FontAwesomeIcon icon={faChevronRight} />
            </div>
            <div className='bg-light d-flex justify-content-between align-items-center rounded p-2 my-1' onClick={() => calendarLink()}>
                <p className='lh-sm m-0'>User Calendar</p>
                <FontAwesomeIcon icon={faChevronRight} />
            </div>
        </div>
    )
}

export default BasicSection;
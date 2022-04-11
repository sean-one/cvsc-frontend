import React, { useContext } from 'react';
import { Row } from 'react-bootstrap';

import { SiteContext } from '../../../context/site/site.provider';
// import { UsersContext } from '../../../context/users/users.provider';
// import EventPreview from '../../events/eventPreview.jsx';

const CreatorEvents = () => {
    const { events } = useContext(SiteContext)

    console.log(events)

    return (
        <Row>
            <p>creactor events</p>
        </Row>
    )
}

export default CreatorEvents;
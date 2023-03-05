import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarPlus } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';

import { role_types } from '../../helpers/dataCleanUp';

const Styles = styled.div`
    .newEventIcon {
        margin: 0;
        margin-right: 0.5rem;
        color: #010a00;
    }
`;

const CreateEventIcon = ({ roletype, business_id }) => {
    let navigate = useNavigate()

    return (
        <Styles>
            <FontAwesomeIcon
                className='newEventIcon'
                variant={role_types[roletype].color}
                icon={faCalendarPlus}
                onClick={() => navigate(`/event/create`, { state: business_id })}
            />
        </Styles>
    )
}

export default CreateEventIcon;
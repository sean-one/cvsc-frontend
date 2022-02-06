import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretLeft } from '@fortawesome/free-solid-svg-icons';

const TabHeader = (props) => {
    return (
        <div className='tabHeader'>
            <p>{props.title}</p>
            {
                (props.viewable) ?
                    <FontAwesomeIcon className='tabIcon' icon={faCaretDown} size='1x' onClick={props.toggleView} />
                    : <FontAwesomeIcon className='tabIcon' icon={faCaretLeft} size='1x' onClick={props.toggleView} />
            }
        </div>
    )
}

export default TabHeader;
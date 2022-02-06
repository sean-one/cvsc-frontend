import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const TabLink = (props) => {
    return (
        <div className='tabHeader'>
            <p>{props.title}</p>
            <span><Link to={{
                pathname: `/create/${props.createtype}`,
                state: {
                    from: props.location.pathname
                }
            }}>
                <FontAwesomeIcon className='tabIcon' icon={faPlus} size='1x' />    
            </Link></span>
        </div>
    )
}

export default withRouter(TabLink);
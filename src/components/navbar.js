import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faAngleUp } from '@fortawesome/free-solid-svg-icons'
import styled from 'styled-components';

// import cvsc from '../assets/smokers_club.png'
import cvsc from '../assets/cvsc.png'
import Menu from './menu'

const Styles = styled.div`
    .navWrapper {
        position: fixed;
        top: 0;
        left: 0;
        background-color: #909590;
        width: 100vw;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .navContainer {
        width: calc(100vw - 1.5rem);
        min-width: 200px;
        max-width: 750px;
        display: flex;
        justify-content: space-between;
        border: 1px solid red;
    }
`;

const Navbar = () => {
    const [ toggle, setToggle ] = useState(false)


    return (
        <Styles>
            {/* <div className='vstack fixed-top'> */}
            <div className='navWrapper'>
                {/* <div className='d-flex justify-content-center w-100 bg-light py-0'> */}
                <div className='border border-success'>
                    <div className='navContainer'>
                        <img
                            src={cvsc}
                            height="50"
                            alt="Coachella Valley Smokers Club logo"
                        />
                        <div className='p-2 me-2' onClick={() => setToggle(!toggle)}>
                            {
                                toggle
                                    ? <FontAwesomeIcon icon={faAngleUp} size='2x' />
                                    : <FontAwesomeIcon icon={faBars} size='2x' />
                            }
                        </div>
                    </div>
                </div>
                {
                    toggle && <Menu toggle={setToggle} />
                }
            </div>
        </Styles>
  )
}

export default Navbar
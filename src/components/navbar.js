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
        background-color: #cbd4ba;
        width: 100%;
        height: 4.5rem;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        z-index: 999;
    }

    .navContainer {
        width: calc(100vw - 1.5rem);
        min-width: 200px;
        max-width: var(--max-page-width);
        display: flex;
        justify-content: space-between;
        /* border: 1px solid red; */
    }

    .menuToggle {
        color: #0D2B12;
        margin-right: 0.5rem;
        padding: 0.5rem;
    }
`;

const Navbar = () => {
    const [ toggle, setToggle ] = useState(false)


    return (
        <Styles>
            {/* <div className='vstack fixed-top'> */}
            <div className='navWrapper'>
                {/* <div className='d-flex justify-content-center w-100 bg-light py-0'> */}
                <div>
                    <div className='navContainer'>
                        <img
                            src={cvsc}
                            height="50"
                            alt="Coachella Valley Smokers Club logo"
                        />
                        <div className='menuToggle' onClick={() => setToggle(!toggle)}>
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
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faAngleUp } from '@fortawesome/free-solid-svg-icons'
import styled from 'styled-components';

import { ReactComponent as CVSCLogo } from '../assets/cvsc_sqr.svg';
import Menu from './menu'

const NavbarStyles = styled.div`
    .navWrapper {
        position: fixed;
        padding: 0 1.5rem;
        top: 0;
        left: 0;
        height: var(--header-height);
        background-color: var(--main-background-color);
        border-bottom: 0.1rem solid var(--main-highlight-color);
        width: 100%;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        z-index: 999;
    }

    .navContainer {
        padding: 0.5rem 0;
        min-height: 100%;
        width: 100%;
        max-width: var(--max-page-width);
        display: flex;
        justify-content: space-between;
    }

    .navBarBranding {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .navBarLogo {
        width: auto;
        max-height: 100%;
        fill: var(--header-highlight);
    }

    .navBarMenu {
        color: var(--main-highlight-color);
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .toggler {
        display: flex;
        justify-content: center;
        width: 4.5rem;
        padding: 0.75rem;
    }
`;

const Navbar = () => {
    const [ toggle, setToggle ] = useState(false)
    
    let navigate = useNavigate()


    return (
        <NavbarStyles>
            <div className='navWrapper'>
                <div className='navContainer'>
                    <div className='navBarBranding' onClick={() => navigate('/')}>
                        <CVSCLogo className='navBarLogo' />
                    </div>
                    <div className='navBarMenu'>
                        <div className='toggler' onClick={() => setToggle(!toggle)}>
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
        </NavbarStyles>
  )
}

export default Navbar
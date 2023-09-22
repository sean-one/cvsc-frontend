import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faAngleUp, faSun, faMoon } from '@fortawesome/free-solid-svg-icons'
import styled from 'styled-components';

import useTheme from '../hooks/useTheme';

import { ReactComponent as CVSCLogo } from '../assets/cvsc_sqr.svg';
import Menu from './menu'

const NavbarStyles = styled.div`
    .navWrapper {
        position: fixed;
        top: 0;
        left: 0;
        height: var(--header-height);
        background-color: var(--trim-color);
        width: 100%;
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
    }

    .navBarBranding {
        max-width: 70px;

        img {
            max-width: 100%;
        }
    }

    .navBarLogo {
        width: 68px;
        height: 70px;
        fill: var(--main-color);
    }

    .navBarMenu {
        color: var(--main-color);
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .toggler {
        display: flex;
        justify-content: center;
        width: 3rem;
        padding: 0.5rem;
    }
`;

const Navbar = () => {
    const [ toggle, setToggle ] = useState(false)
    const { themeName, toggleTheme } = useTheme()
    
    let navigate = useNavigate()


    return (
        <NavbarStyles>
            <div className='navWrapper'>
                <div className='navContainer'>
                    <div className='navBarBranding' onClick={() => navigate('/')}>
                        <CVSCLogo className='navBarLogo' />
                    </div>
                    <div className='navBarMenu'>
                        <div className='toggler'>
                            <FontAwesomeIcon icon={themeName === 'light' ? faMoon : faSun } size='2x' onClick={() => toggleTheme()} />
                        </div>
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
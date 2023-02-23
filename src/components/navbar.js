import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faAngleUp } from '@fortawesome/free-solid-svg-icons'

import cvsc from '../assets/cvsc.png'
import Menu from './menu'

const Navbar = () => {
    const [ toggle, setToggle ] = useState(false)


    return (
        <div className='vstack fixed-top'>
            {/* <div className='d-flex justify-content-between bg-light py-2'> */}
            <div className='w-100 bg-light py-0'>
                <div className='innerContainer d-flex justify-content-between'>
                    <div>
                        <img
                            src={cvsc}
                            width="85"
                            height="auto"
                            className="d-inline-block align-center"
                            alt="Coachella Valley Smokers Club logo"
                        />
                    </div>
                    <div className='p-2 me-2' onClick={() => setToggle(!toggle)}>
                        {
                            toggle
                                ? <FontAwesomeIcon icon={faAngleUp} size='3x' />
                                : <FontAwesomeIcon icon={faBars} size='3x' />
                        }
                    </div>
                </div>
            </div>
            {
                toggle && <Menu toggle={setToggle} />
            }
        </div>
  )
}

export default Navbar
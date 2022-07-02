import React, { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';

import { UsersContext } from '../context/users/users.provider';

import logobrand from '../assets/cvsc.png'

export const NavHeader = (props) => {
    const isLoggedIn = JSON.parse(localStorage.getItem('isLoggedIn'));
    const { userSignOut } = useContext(UsersContext);
    let history = useHistory()

    const logout = async () => {
        localStorage.clear()
        
        await userSignOut()
        
        document.getElementById('navbarToggle').classList.remove('show')
        document.getElementById('navbarToggle').classList.add('hide')
        
        window.open("http://localhost:3333/auth/logout", "_self")
        
        // history.push('/')
    }

    
    const goto = (link) => {
        document.getElementById('navbarToggle').classList.remove('show')
        document.getElementById('navbarToggle').classList.add('hide')
        
        if(!link) {
            history.push('/')
        } else {
            history.push(`/${link}`)
        }
    }

    return (
        <Navbar expand='md' bg="light" variant="light" fixed='top'>
            <Container>
                <Navbar.Brand>
                    <Link to={{ pathname: "/" }}>
                        <img
                            src={logobrand}
                            width="85"
                            height="auto"
                            className="d-inline-block align-center"
                            alt="Coachella Valley Smokers Club logo"
                        />
                    </Link>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarToggle" />
                <Navbar.Collapse id='navbarToggle'>
                    <Nav className="justify-content-end flex-grow-1 pe-3">
                        <Nav.Item>
                            <Nav.Link onClick={() => goto()}>Calendar</Nav.Link>
                        </Nav.Item>
                        {
                            (!isLoggedIn)
                                ? <Nav.Item>
                                    <Nav.Link onClick={() => goto('register')}>Register</Nav.Link>
                                </Nav.Item>
                                : <Nav.Item>
                                    <Nav.Link onClick={() => goto('profile')}>Profile</Nav.Link>
                                </Nav.Item>
                        }
                        {
                            (isLoggedIn)
                                ? <Nav.Item>
                                    <Nav.Link onClick={logout}>Logout</Nav.Link>
                                </Nav.Item>
                                : <Nav.Item>
                                    <Nav.Link onClick={() => goto('login')}>Login</Nav.Link>
                                </Nav.Item>
                        }
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}
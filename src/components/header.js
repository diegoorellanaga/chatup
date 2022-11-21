import {React, useState} from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from 'react-router-dom';


const Header = () => {
    
    const [userName,setUserName]= useState(localStorage.getItem("userName"))
    const [userLastName,setUserLastName]= useState(localStorage.getItem("userLastName"))

    return (
        <header className="home-header">
          <Navbar className='mb-2' bg="dark" variant="dark" expand="lg">
            <Container>
              <Navbar.Brand>
                <Link style={{ textDecoration: 'none' }} to={`/`}>
                  Chat Up! 
                </Link>
              </Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                  <Nav.Link>
                    <Link style={{ textDecoration: 'none' }} to={`/`}>
                      Back
                    </Link>
                  </Nav.Link>
                  <Nav.Link>
                    <Link style={{ textDecoration: 'none' }} to={`/login`}>
                      Log Out
                    </Link>
                  </Nav.Link>

                </Nav>
              </Navbar.Collapse>
              <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            Signed in as: <a href="#login">{userName} {userLastName}</a>
          </Navbar.Text>
        </Navbar.Collapse>


            </Container>
          </Navbar>
      
        </header>
    )
}

export default Header
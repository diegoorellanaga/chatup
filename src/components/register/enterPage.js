import React, { useState, useEffect } from "react";
import Login from './login';
import Register from './register';
import "./style.scss";
import Nav from 'react-bootstrap/Nav';


const EnterPage = () => {


    localStorage.setItem("userId", "")
    localStorage.setItem("userName", "")
    localStorage.setItem("userLastName", "")
    localStorage.setItem("userEmail", "")


    const [isLogginActive,setIsLogginActive] = useState(true)

    const handleSelect = (eventKey) => {
    
        switch(eventKey){
          case "login":
          setIsLogginActive(true)
          break
          case "register":
          setIsLogginActive(false)
          break
        }
      };

    return (
          <>
        <Nav  fill variant="tabs"  onSelect={handleSelect} defaultActiveKey="login">
            <Nav.Item >
              <Nav.Link eventKey="login">Login</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="register">Register</Nav.Link>
              </Nav.Item>
        </Nav>
        <div className="login">
          <div className="container" >
            {isLogginActive && (
              <Login  />
            )}
            {!isLogginActive && (
              <Register setIsLogginActive={setIsLogginActive} />
            )}
          </div>
        </div>
          </>
      );
    
    }
    
    
    
export default EnterPage
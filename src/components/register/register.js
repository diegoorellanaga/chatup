import React, { useState, useEffect } from "react";
import { Button } from 'react-bootstrap';
import axios from 'axios';
import "./style.scss";

function alphanumeric(inputtxt)
{
 var letterNumber = /^[0-9a-zA-Z]+$/;
 if((inputtxt.match(letterNumber)))
 {
   return true;
  }
else
  { 
   //alert("message"); 
   return false; 
  }
  }

  function ValidateEmail(mail) 
  {
   if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
    {
      return (true)
    }
     // alert("You have entered an invalid email address!")
      return (false)
  }





const Register = ({setIsLogginActive}) => {

    const [name, setName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
  
    const checkValues = () => {

        if(!alphanumeric(password)){
          alert("Password must contain only numbers and letters")
          return false
        } else if(!ValidateEmail(email)){
          alert("Invalid Email")
          return false
        } else if(!alphanumeric(name)){
          alert("Names must contain only numbers and letters")
          return false
        } else if(!alphanumeric(lastName)){
          alert("Last Names must contain only numbers and letters")
          return false
        } else if(name.length <2){
          alert("Names must not be a single character")
          return false
        } else if(lastName.length <2){
          alert("Last Names must not be a single character")
          return false
        } else {
          return true
        }
    }

    const register = async (data) => {

        console.log(data)
    
        if(checkValues()){
    
        let formData = new FormData()
        formData.append("first_name",name)
        formData.append("last_name",lastName)
        formData.append("email",email)
        formData.append("password",password)
        formData.append("information","extra")
    
    
        const SIGNUP_ENDPOINT = window.hostUrl+"register.php" // `${SERVER_URL}/api/register.php`;
        try {
            let response = await axios({
                method: 'post',
                responseType: 'json',
                url: SIGNUP_ENDPOINT,
                data: formData
              });
              setIsLogginActive(true)
              
        } catch(e){
            if(e["response"]["data"]["errorId"]=="1"){
              alert("Repeated Email, or some other error")
            }
        }
    
      }else{
       console.log("check data")
      }
    }

    return (
        <div className="base-container" >
        <div className="content">
          <div className="image">
            <img src="/images/register.png" />
          </div>
          <div className="form">
          <div className="form-group">
              <label htmlFor="name">Name</label>
              <input 
                type="text" 
                name="name" 
                placeholder="John" 
                value={name}
                onChange={(e) => setName(e.target.value)}
    
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input 
                type="text" 
                name="lastName" 
                placeholder="Doe" 
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
    
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email (To notify)</label>
              <input 
                type="text" 
                name="email" 
                placeholder="Email@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value.toLowerCase())}
    
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input 
                type="text" 
                name="password" 
                placeholder="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
    
              />
            </div>
          </div>
        </div>
        <div className="footer">
          <Button onClick={register} type="button" style={{marginBottom:"30%"}}>
            Register
          </Button>
        </div>
      </div>
      );
    
    }
    
    
    
export default Register
import {React, useState}  from 'react'
import "./style.scss";
import { Button } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");



    const login = async (data) => {
    
        let formData = new FormData()
    
        formData.append("email",email)
        formData.append("password",password)
    
    
        const SIGNUP_ENDPOINT = window.hostUrl+"login.php" // `${SERVER_URL}/api/register.php`;
        try {
            let response = await axios({
                method: 'post',
                responseType: 'json',
                url: SIGNUP_ENDPOINT,
                data: formData
              });
    
              localStorage.setItem("userId", response.data.data)
              localStorage.setItem("userName", response.data.name)
              localStorage.setItem("userLastName", response.data.lastname)
              localStorage.setItem("userEmail", email)
    
              window.userId = response.data.data
              window.userName = response.data.name
              window.userLastName = response.data.lastname
              window.userEmail = email
    
              console.log(response.data.data)
              navigate("/");
        } catch(e){
          console.log(e)
            if(e["response"]["data"]["errorId"]=="1"){
              alert("Incorrect credentials")
            }
        }
    
      // }else{
      //  console.log("check data")
      // }
    }


    return (
        <div className="base-container">
        {/* <div className="header">Login</div> */}
        <div className="content">
          <div className="image">
            <img src="/images/login.png" />
          </div>
          <div className="form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input 
                type="text" 
                name="email" 
                placeholder="Doe@gmail.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value.toLowerCase())}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input 
                type="password" 
                name="password" 
                placeholder="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="footer">
          <Button onClick={login} type="button" style={{marginBottom:"30%"}}>
            Login
          </Button>
        </div>
      </div>
      );
    
    }
    
    
    
export default Login
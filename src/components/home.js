import React, {useState} from 'react'
import  { Navigate } from 'react-router-dom'
import Form from './posts/form'
import MenuList from './menu'
import { subAppsData } from './config/subAppData';

const Home = () => {
    console.log(subAppsData)
    const checkLogin = ()=>{    
    var userId  =  localStorage.getItem("userId")
//alert(userId)
    if (userId){
      return <MenuList subApps={subAppsData}/>
    }else{
      return <Navigate to='/login'  />
    } 
}

var protectedContent = checkLogin()


    return (
        <div>
            {protectedContent}
        </div>
    )
}

export default Home
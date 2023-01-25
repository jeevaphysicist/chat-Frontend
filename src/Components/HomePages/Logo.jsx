import React from 'react';
import Profile from '../Chat/Profile';
import Applogo from "../../Assets/logo.png";

export default function Logo() {
  return (
    <div>
        <div className="logopart">
        <div className='logo'>
          <img src={Applogo} alt="..." />
        </div>
        <div className='account'> 
        <div className='about'>  <Profile/> </div>
        
        </div>
        
      </div>
      
    </div>
  )
}

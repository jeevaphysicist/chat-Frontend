import React,{useState,useEffect} from 'react';
import Chat from '../Chat/Chat';
import Enterypoint from "../LoginPages/Enterypoint";


export default function Home() {
  const [entery,setEntery]=useState(false);
 
  useEffect(()=>{
    let UserData = localStorage.getItem("UserData") ;
    // console.log("Userdata",UserData);
    if(UserData != undefined ){
        setEntery(true);
    }
  },[])

  return (
    <div>
      
      { entery == false ? 
             <Enterypoint/>
             :
            <Chat/>
      }

    </div>
  )
}

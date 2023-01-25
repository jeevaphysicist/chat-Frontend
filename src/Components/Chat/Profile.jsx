import React from 'react';
import "../Chat/chat.css";
import logo from "../../Assets/bus2.jpeg";
import { useState } from 'react';
import avator from "../../Assets/Public";
import  Modal  from 'react-modal';
import { useEffect } from 'react';
import api from"../APi";
import { result } from 'lodash';
Modal.setAppElement("#root");
 const customStyle ={
  content:{
    top:"2%",
    left:"auto",
    right:"2%",
    bottom:"auto",
    // backgroundColor:"transparent"
  }
 }


 let document ="";




export default function Profile() {
    const [profilemodal,setProfilemodal] = useState(false);
    const [imagemodel,setImagemodel] = useState(false);
    const [picture,setPicture] = useState("");
    const [namemodal,setNamemodal] = useState(false);
    const [biomodal,setBiomodal] = useState(false);
    const [currentuser,setCurrentuser] = useState("");
    const [update,setUpdate] = useState('');
    const [editname,setEditname] = useState('');
    const [editbio,setEditbio] = useState('');

   useEffect(()=>{
    let UserData = localStorage.getItem("UserData");
    UserData = JSON.parse(UserData);
    setCurrentuser(UserData);
    let DATA = {
      user_id:UserData[0].user_id,
      email:UserData[0].email
    }
    fetch(`${api}/users/currentuser`,{method:"POST",
         headers:{"Content-Type":"application/json"},
          body:JSON.stringify(DATA)
        }).then(res=>res.json())
        .then(result=>{
          // console.log(result);
          setUpdate(result.data);
        })

   },[])

   const file =(picture)=>{
    // console.log("files : ",picture);
    if(picture == avator){
     console.log("picture",picture);
     let data = {
       user_id:currentuser[0].user_id,
       email:currentuser[0].email,
       photo:picture
     }
     console.log("delete photo",data)
     fetch(`${api}/users/addphoto`,{method:"PUT",
     headers:{"Content-Type":"application/json"},
    body:JSON.stringify(data)
  }).then(res=>res.json())
  .then(result=>{
    console.log('result',result);
    window.location.reload();
  })
    }
    else{
    let reader = new FileReader();
    reader.readAsDataURL(picture);
    reader.onload = function () {
        document = reader.result;
       //  console.log("document : ",document);
        var stringLength = document.length - 'data:image/png;base64,'.length;
  
        var sizeInBytes = 4 * Math.ceil((stringLength / 3))*0.5624896334383812;
        var sizeInKb=sizeInBytes/1024;
        var mb =(sizeInKb/1024).toFixed(2);
 //  console.log("sizeof picture",mb);
  if(mb <= 10){
    console.log("Photo is updated");
    let data = {
      user_id:currentuser[0].user_id,
      email:currentuser[0].email,
      photo:document
    }
    console.log("update photo",data);
    fetch(`${api}/users/addphoto`,{method:"PUT",
       headers:{"Content-Type":"application/json"},
      body:JSON.stringify(data)
    }).then(res=>res.json())
    .then(result=>{
      console.log('result',result);
      window.location.reload();
    })
  }
  else{
    console.log("size limit is exceeded");
  }
       
    };
   }
  
  }

  // edit user name 
  const editnamehandler =()=>{
    console.log("editname",editname);
    let data = {
      user_id:update[0].user_id,
      email:update[0].email,
      Name:editname
    }
    fetch(`${api}/users/editname`,{method:"PUT",
          headers:{"Content-Type":"application/json"},
           body:JSON.stringify(data)
          }).then(res=>res.json())
          .then(result=>console.log("result",result));
          if(result != undefined){
            window.location.reload();
          }
  }

  // edit bio data
  const editbiohandler = ()=>{
console.log("editbio",editbio);
let data = {
  user_id:update[0].user_id,
  email:update[0].email,
  biodata:editbio
}
fetch(`${api}/users/editbio`,{method:"PUT",
          headers:{"Content-Type":"application/json"},
           body:JSON.stringify(data)
          }).then(res=>res.json())
          .then(result=>console.log("result",result));
          if(result != undefined){
            window.location.reload();
          }
  }

    const logouthandler =()=>{
        // console.log("Logout handler");
        let UserData = localStorage.removeItem("UserData");
        if(UserData === undefined){
          window.location.reload();
        }
    }
    // console.log("currentuser",currentuser);
  return (
    <div>
        <button className='userimg' onClick={()=>setProfilemodal(true)}>
            <img src={update[0]?.picture} alt=""  className='picture' /> 
        </button><br/><br/>
        
{/* modals */}
<div>
  <Modal
  isOpen={profilemodal}
  style={customStyle}>
    <i className="bi bi-arrow-left-circle back"  onClick={()=>{setProfilemodal(false)}}></i>
    <br/><br/>
    <div className='profilepart'>
    <div className='row'>
      <div className='col-6 imagepart'><img src={update[0]?.picture} style={{cursor:"pointer"}} className='picture' onClick={()=>{setImagemodel(true)}}/></div>
      <div className='col-6 value'>{update[0]?.userName} <i class="bi bi-pencil-square" onClick={()=>setNamemodal(true)}></i></div>
    </div>
    <div><span className='title'>userID </span>:<span className='value' > {currentuser[0]?.user_id}</span></div>
    <div><span className='title'>Email </span>:<span className='value' > {currentuser[0]?.email}</span></div>
    <div><span className='title'>Gender </span>:<span className='value' > {currentuser[0]?.gender}</span></div>
    <div><span className='title'>Bio Data </span>:<span className='value' > {update[0]?.bioData}</span>&nbsp;<i class="bi bi-pencil-square" onClick={()=>setBiomodal(true)}></i></div>
    <button className='btn btn-block btn-danger' onClick={()=>{logouthandler()}}>Log out</button>
    </div>
   
  </Modal>
    </div>
     {/* image model */}
  <Modal
  isOpen={imagemodel}
  style={customStyle}>
    <div className='container'> 
    <i className="bi bi-arrow-left-circle back"  onClick={()=>{setImagemodel(false)}}></i><br/><br/>
      <div>
        {update[0]?.picture != avator  ?
        <div>
          <img src={update[0]?.picture} alt='' className='profilepicture'/><br/><br/>
          <div className='row '>
           <label for="profile" className="col-6">
            + Add pricture
            <div>{picture.name}</div>
           </label>
            <input id='profile' type="file" accept="image/png, image/jpg, image/jpeg" onChange={(e)=>setPicture(e.target.files[0])} />
          <button className='btn btn-block btn-success col-6' onClick={()=>{file(picture)}}>update</button>
          </div><br/>
          <center>
          <button className=' btn btn-block btn-warning w-50' onClick={()=>file(avator)}>delete</button>
          </center> 
        </div>
         : 
         <div>
          <img  src={update[0]?.picture} alt="" className='profilepicture' /><br/><br/>
          <center>
            <label for="fileinput">
            + Add pricture<br/>
            {picture.name}
            </label>
          <input type="file" id='fileinput' accept="image/png, image/jpg, image/jpeg" onChange={(e)=>setPicture(e.target.files[0])} /><br/><br/>
          <button className='btn btn-block btn-success col-6'  onClick={()=>{file(picture)}}>update</button>
          </center>
          </div>}
      </div>
    </div>
  </Modal>
  {/* name edit modal */}
  <Modal isOpen={namemodal} style={customStyle}>
   <i className="bi bi-arrow-left-circle back"  onClick={()=>{setNamemodal(false)}}></i><br/><br/>
   <div className='edit p-5'>
   <label  htmlFor="editname">Username:</label><br/>
   <input id="editname" type="text" placeholder='Enter user name ....' onChange={(e)=>{setEditname(e.target.value)}}  /><br/><br />
   <center><button className='btn btn-block btn-danger' onClick={()=>editnamehandler()}>Edit</button></center>
   </div>
    </Modal>
    {/* bio edit modal */}
    <Modal isOpen={biomodal} style={customStyle}>
    <i className="bi bi-arrow-left-circle back"  onClick={()=>{setBiomodal(false)}}></i><br/><br/>
    <div className='edit p-5'>
    <label  htmlFor="editbio">Edit BIO:</label><br/>
    <textarea id="editbio" type="text" placeholder='Enter your bio  ....' onChange={(e)=>setEditbio(e.target.value)} ></textarea><br/><br />
    <center><button className='btn btn-block btn-danger' onClick={()=>editbiohandler()}>Edit</button></center>
    </div>
    </Modal>
    </div>
  )
}

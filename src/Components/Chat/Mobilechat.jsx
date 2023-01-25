import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import {useRef, useState} from 'react';
import "../Chat/mobile.css";
import  Modal  from 'react-modal';
import Addfriends from './Addfriends';
import { format } from 'timeago.js';
import io from "socket.io-client";
import api from "../APi";
import Logo from '../HomePages/Logo';
import Mobilechat from './Mobilechat';
import { useEffect } from 'react';

Modal.setAppElement("#root");
 const customStyle ={
  content:{
   top:"0",
   left:"0",
   right:"0",
   bottom:"0",
  },
  
 }


export default function Mobilchat() {
  const [screenwidth,setScreenwidth] = useState(window.innerWidth);
  const [screenheight,setScreenheight] = useState(window.innerHeight - 160);
  const [friendprofilemodal,setFriendprofilemodal] =  useState(false);
  const [conversation,setConversation] = useState("");
  const [friendname,setFriendname]  = useState('');
  const [friends,setFriends] = useState('');
  const [messages,setMessages] = useState('');
  const [sendmessage,setSendmessage] = useState('');
  const [currentuser,setCurrentuser] = useState("");
  const [update,setUpdate] = useState('');
  const [onlinefriend,setOnlinefriend] = useState('');
  const [socketmessage,setSocketmessage]= useState('');
  const [names,setNames]= useState('');
  const bottomRef = useRef();
  const  socket = useRef() ;
  const [conversationmodal,setConversationmodal] = useState(false);

    useEffect(()=>{
    // get userdata 
   let UserData = localStorage.getItem("UserData");
   UserData = JSON.parse(UserData);
   setCurrentuser(UserData);

  //  get current user data to stored in update for photo updating
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
                setNames(result.data[0].addFriends);
      })

  // get all user for add friends purpose
  const userID = UserData[0].user_id;
  //  console.log("Userdata",userID);
   if(UserData != undefined)
     fetch(`${api}/users/getfriends`,{method:"POST",
           headers:{"Content-Type":"application/json"},
           body:JSON.stringify({user_id:userID})
          })
          .then(res=>res.json())
          .then(result=>{
           // console.log("result",result);
          setFriends(result.data);
         });
  },[]);


  useEffect(()=>{
    var dispaly =  document.querySelector('.dispaly');
    bottomRef.current?.scrollIntoView({behaviour:"smooth"});
    
    // console.log("dispaly",dispaly);
    // console.log("display",dispaly.clientHeight);
    // dispaly.scrollHeigth = dispaly.scrollTop;
    // console.log("dispaly",dispaly.scrollHeight);
  },[messages])

  // using sockets
  useEffect(()=>{
       socket.current = io("https://easychatnew.herokuapp.com");     
  },[]);

  useEffect(()=>{
    // console.log("userID",currentuser[0].user_id)
    if(currentuser[0]?.user_id != null){
      socket.current.emit("addusers",currentuser[0]?.user_id);
      socket.current.on("getusers",(data)=>{
        console.log("data",data);

        let datas =[];
        data.length >0 && data.map(items=>{
                   datas.push(items.user_id);  
        })
        setOnlinefriend(datas);
      })
    }
   
   
  },[currentuser]);

 
let value;
console.log("names",names);
  // create friend lists
  // const friends = ["jeeva","kamalee","Bheem","raju","Dora"];
  const friendslist = friends != undefined && friends.length >0 && friends.filter(element=>{
    if(friendname != ""){
      if(element.userName.toLowerCase().includes(friendname.toLowerCase())){
        return element;
      }
    }
    else{
      return element;
    }
  })
  .map((data,index)=>
    <div className='container ' key={index}>       
        <div className='friendslist row' onClick={()=>{setConversation(data);setConversationmodal(true)}}>
          <div className='imagepart col-6'>
             <img  src={data.picture} alt="image ....." className='picture' />           
          </div>
          <div className='col-6'>{data.userName}</div>
       </div><br/>
    </div>
   );

  
  

  //  create online users list 
  // const onlinefriends = ["jeeva","Bheem","kamalee"]
  // console.log("onlines = ",onlinefriendlists);

  const onlinefriendlist = friends != undefined && onlinefriend != undefined && friends.length>0 && onlinefriend.length >0 && 
  friends.filter(element=>onlinefriend.includes(element.user_id))
  .map((data,index)=><div key={index}>
      <div className='friendslist row' onClick={()=>{setConversation(data);setConversationmodal(true)}}>
              <div className='imagepart col-6'>
                  <div className='online'></div>
                  <img  src={data.picture} alt="image ....." className='picture' />           
              </div>
              <div className='col-6'>{data.userName}</div>
       </div><br/>
   </div>
  );

  // get messages from backend 
  useEffect(()=>{
    let req={
             userid_1:currentuser[0]?.user_id,
             userid_2:conversation.user_id
            };
    fetch(`${api}/conversation/getmessages`,{method:"POST",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify(req)})
          .then(res=>res.json())
          .then(result=>{
            console.log("result",result);
            setMessages(result.data);
          });
  },[conversation])

  // let message =["hi","hello"]
  // create message lists
  const messagelist = messages != undefined && messages.length >0 && messages.map((data,index)=><div key={index}>
          <p className={currentuser[0]?.user_id ==data.sender_id ? "you" :"other"}>
              <div className='message-part'>
                   <img src={currentuser[0]?.user_id == data.sender_id ? update[0].picture :conversation.picture} alt="" className='picture' />
                   <span className='message'>{data.text}</span>
                   <p className='time'>{format(data.createdAt)}</p>
                   <p className='name'>{currentuser[0]?.user_id == data.sender_id ? currentuser[0].userName  : conversation.userName}</p>
              </div>
          </p><br/>
          
  </div>);

  useEffect(()=>{
    // console.log("this is socket andler");
    socket.current.on("receiveMessage",data=>{
      console.log("messages",data);
      setSocketmessage({
        sender_id:data.sender_id,
        text:data.text,
        createAt:Date.now
      })
    })
    
  },[])
  
  useEffect(()=>{
       setMessages(element=>[...element,socketmessage]);
  },[socketmessage])




// send message to store database
  const sendmessagehandler = ()=>{
    //  console.log("send message !!!!");
    //  console.log("sendmessage",sendmessage);
    // socket to see instant message
    let socketdata = {
      sender_id:currentuser[0].user_id,
      reciever_id:conversation.user_id,
      text:sendmessage
    }
      socket.current.emit("sendMessage",socketdata);
       
      // message store database
     let req = {
      userid_1:currentuser[0].user_id,
      userid_2:conversation.user_id,
      text:sendmessage
     }
     fetch(`${api}/conversation/addmessages`,{method:"POST",
           headers:{"Content-Type":"application/json"},
           body:JSON.stringify(req)
          })
          .then(res=>res.json())
          .then(result=>{
            if(result.data != undefined){
              // console.log("result",result);
            }
          })
     document.getElementById('text-area').value =""
    //  console.log("send req",req);
  
    
  }
  
  // delete friend from the list
  const deletefriendhandler =()=>{
    let req = {
              user_id:currentuser[0]?.user_id,
              email:currentuser[0]?.email,
              friend_id:conversation.user_id,
              friendName:conversation.userName
               }
    // console.log("req",req);
    fetch(`${api}/users/deletefriends`,{method:"PUT",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify(req)
         })
         .then(res=>res.json())
         .then(result=>{
                       // console.log("result",result);
                      window.location.reload();
        });
  }
 
  return (
    <div><br/><br />
        <Tabs>
    <TabList>
      <Tab>Friends</Tab>
      <Tab>Online Freinds</Tab>
    </TabList>

    <TabPanel>
  
    <div className='chatheader' style={{"--height":`${screenheight}px`}}>
            <Addfriends/>
             <div className='friend-header'>Friends</div><br/><br/>
             <input type="text" className='searchfriends' placeholder='Search friends ....' onChange={(e)=>{setFriendname(e.target.value)}} />
             <br/><br/>
             {friendslist}
        </div>
    </TabPanel>
    <TabPanel>
    <div className='chatfooter' style={{"--height":`${screenheight}px`}}>
        <div style={{"color":"green","fontSize":"25px",position:"fixed"}} >Online</div>
        <div className='pt-5'>
               {
                onlinefriendlist != "" ? onlinefriendlist  : <div className='noonline'>no friends in online</div>
               }   
        </div>       
      </div> 
    </TabPanel>
  </Tabs>

     <Modal isOpen={conversationmodal} style={customStyle} >
     <i className="bi bi-arrow-left-circle back"  onClick={()=>{setConversationmodal(false)}}></i>
     <div className='chatmain' style={{"--height":`${screenheight}px`}}>
            <div className='user'>
          <div className=' row' >
            <div className='col-3'>
              <img src={conversation.picture} alt="profile-image ..." className='picture' />
            </div>
            <div className='col-8' style={{color:"white"}}>
              {conversation.userName}
            </div>
           <div className='menu col-1'>
           <i className="bi bi-three-dots-vertical" onClick={()=>{setFriendprofilemodal(true)}}></i>
           </div>
           </div>
           <div>

<Modal isOpen={friendprofilemodal} style={customStyle} >
       <i className="bi bi-arrow-left-circle back"  onClick={()=>{setFriendprofilemodal(false)}}></i>
       <br/>
      <div className='profilepart'>
               <div className='row'>
                 <div className='col-4 imagepart'><img src={conversation.picture} style={{cursor:"pointer"}} className='picture'/></div>
                 <div className='col-6 value'>{conversation.userName} </div>
                 {/* <i className="bi bi-pencil-square col-2" style={{color:"brown"}} onClick={()=>setEditfriendname(true)}></i> */}
               </div>
          <div><span className='title'>userID </span>:<span className='value' > {conversation.user_id}</span></div>
         {/* <div><span className='title'>Email </span>:<span className='value' > jeeva@gmail.com</span></div> */}
          <div><span className='title'>Gender </span>:<span className='value' > {conversation.gender}</span></div>
          <div><span className='title'>Bio Data </span>:<span className='value' > {conversation.bioData}</span></div><br/>
          <button className='btn btn-block btn-success' onClick={()=>{deletefriendhandler()}}>Delete Friend</button>
      </div>
</Modal>
</div>
</div>

{/* message lists */}
    <div className='msgdis'><div className='dispaly'>{messagelist} <div ref={bottomRef} /></div> </div>
    
        {/*send button and text typing part  */}
          <input type="text" id='text-area' onChange={(e)=>setSendmessage(e.target.value)} onKeyPress={e=>e.key == "Enter" && sendmessagehandler()} />
          <button className='btn btn-block btn-success send' onClick={()=>sendmessagehandler()}>Send</button>
  </div>
  
    
     </Modal>

    </div>
  )
}

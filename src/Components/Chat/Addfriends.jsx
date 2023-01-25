import React,{useState} from 'react';
import  Modal  from 'react-modal';
import avator from "../../Assets/Public";
import logo from "../../Assets/bus2.jpeg";
import { useEffect } from 'react';
import api from"../APi";


Modal.setAppElement("#root");
const customStyle ={
    content:{
        top:"10%",
        left:"0%",
        right:"auto",
        // bottom:"auto"
    }
}
const Style ={
    content:{
        top:"10%",
        left:"0%",
        right:"auto",
        bottom:"auto"
    }
}


export default function Addfriends() {
    const [modal,setModal] = useState(false);
    const [friend_id,setFriend]= useState('');
    const [user,setUser] = useState(false);
    const [data,setData] = useState('');
    const [users,setUsers] = useState('');
   
    // const [currentuser,setCurrentuser] = useState('');
    let i=0;
    const array = ["jeeva","jeevanantham","kamalee","kamali"];


 useEffect(()=>{
   
    fetch(`${api}/users/getusers`,{method:"POST",
           headers:{"Content-Type":"application/json"},
            body:JSON.stringify({message:"get all users"})
        })
    .then(res=>res.json())
    .then(result=>{
        // console.log("result",result);
        setUsers(result.data);
    })
 },[])
    const userdisplay = (userdata)=>{
        //  console.log("data : ",data);
         
          setData(userdata);
          setUser(true);     
        //   window.location.reload();

    }

    const userlist =users.length > 0 && users.filter(element=>{
        if(friend_id != ""){
           if(element.user_id.toLowerCase().includes(friend_id.toLowerCase())){
             return element ;
           }
        }
        else{
            return element ;
        }

    }).map((items,index)=>
         <div key={index} className="list-back">
        <div className='row card ' onClick={()=>{userdisplay(items)}}>
            <div className='col-3'>
             <img src={items.picture} alt=''className="image" />
            </div>
            <div className='col-9'>
               <span>{items.userName}</span><br/>
               <span>{items.user_id}</span>
            </div>
        </div><br/>
        </div>
   
    );

    const addfriendhandler = ()=>{
        // console.log("add frirnd handler !!!!!");
       
        let currentuser = localStorage.getItem('UserData');
        currentuser = JSON.parse(currentuser);
        let req ={
            user_id:currentuser[0].user_id,
            email:currentuser[0].email,
            friend_id:data.user_id,
            friendName:data.userName
        }
        fetch(`${api}/users/addfriends`,{method:"put",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify(req)
    }).then(res=>res.json())
    .then(result=>{
   if(result.data != undefined){
    setUser(false);
    let query = {
        userid_1:currentuser[0].user_id,
        userid_2:data.user_id
    }
    console.log("query",query);
    fetch(`${api}/messager/addusers`,{method:"POST",
      headers:{"Content-Type":"application/json"},
       body:JSON.stringify(query)
    }).then(res=>res.json())
    .then(result=>{console.log("res",result)
});
    window.location.reload();
   }
    })
      
    }

  
    // console.log("friend_id",friend_id);

  return (
    <div>
         <button className='btn btn-block btn-success' onClick={()=>setModal(true)} >+ add friends</button><br/>

         {/* modal */}
         <Modal
         isOpen={modal}
         style={customStyle}>
            <i className="bi bi-arrow-left-circle back"  onClick={()=>setModal(false)}></i><br/>
            <span style={{fontSize:"20px"}}>Add friends</span>
            <div className='add-friends'><br/>
               
                <label htmlFor="userid" > User ID : </label>
                <input type="text" id="userid" placeholder='type userID...' onChange={(e)=>{setFriend(e.target.value)}} />
                <hr/>
                <div className='scroll'>
                 {
                    friend_id == "" ?  "" : <div> {userlist}</div>
                 }   
                </div>
                
              
                
            </div>

         </Modal>
         <Modal isOpen={user} style={Style}>
         <i className="bi bi-arrow-left-circle back" onClick={()=>setUser(false)}></i>           
            <div className='profilepart'>
    <div className='row'>
      <div className='col-6 imagepart'><img src={avator} style={{cursor:"pointer"}} className='picture'/></div>
      <div className='col-6 value'>{data.userName} </div>
    </div>
    <div><span className='title'>userID </span>:<span className='value' > {data.user_id}</span></div>
    <div><span className='title'>Email </span>:<span className='value' > {data.email}</span></div>
    <div><span className='title'>Gender </span>:<span className='value' > {data.gender}</span></div>
    <div><span className='title'>Bio Data </span>:<span className='value' > {data.bioData}</span></div>
    <br/>
    <button className='btn btn-block btn-success' onClick={()=>{addfriendhandler()}}>ADD friend</button>
            </div>

         </Modal>
    </div>
  )
}

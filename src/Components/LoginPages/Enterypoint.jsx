import React from 'react';
import { useState } from 'react';
import Modal from "react-modal";
import logo from "../../Assets/logo.png";
import api from "../APi";
import avator from "../../Assets/Public"
import "./Enterypoint.css";
// 

Modal.setAppElement("#root");
const styleSheet ={
    content: {
        top: '100%',
        left: '50%',
        right: 'auto',
        bottom: '',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
      },
   }

export default function Home() {
    const [modal,setModal] = useState(true);
    const [screenheight,setScreenheight] = useState(window.innerHeight);
    const [finder,setFinder]= useState(true);
    const [email,setEmail] = useState('');
    const [username,setUsername] = useState('');
    const [dob,setDOB] = useState('');
    const [password,setPassword] = useState('');
    const [repassword,setRepassword] = useState('');
    const [gender,setGender] = useState('');
    const [emailerr,setEmailerr] = useState('');
    const [usernameerr,setUsernameerr] = useState('');
    const [doberr,setDOBerr] = useState('');
    const [passworderr,setPassworderr] = useState('');
    const [repassworderr,setRepassworderr] = useState('');
    const [gendererr,setGendererr] = useState('');
    const [loginerr,setLoginerr] = useState('');
    const [createaccounterr,setCreateaccounterr] = useState('');
    const [loginemail,setLoginemail] = useState('');
    const [loginpassword,setLoginpassword] = useState('');
  

    var mailPattern=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/i;
    // var passwordPattern=/^((\d|\w|){8,})$/i;
    var namePattern=/(\w+\d+)|(\d+|\w+)$/i;
    let boolem,boolpass,booluser,booldob,boolgender,boolrepass;

    const datavalidationhandler = ()=>{
      // console.log(`${email}-${password}-${username}-${repassword}-${gender}-${dob}-`);
      var date=new Date(dob);
      var today =new Date();
      var difference=today-date;
      var ages= parseInt(difference/(1000*3600*24*365.25)) ;
      // console.log("ages",ages);
      if(namePattern.test(username) === false)
        {
        setUsernameerr("please type username");
        booluser=false;
        }
        else{
          setUsernameerr("");
          booluser=true;
        }
        if(password.length > 8 === false)
        {
        setPassworderr("Atleast 8 characters");
        boolpass=false;
        }
        else{
          setPassworderr("");
          boolpass = true;
        }
        if(mailPattern.test(email) === false)
        {
        setEmailerr("please type valid email");
        boolem= false;
        }
        else{
          setEmailerr("");
          boolem=true;
        }
        if(ages <  18 || dob === ""){
          setDOBerr("your under 18 ,please go back");
          booldob=false;
        }
        else{
          setDOBerr("");
          booldob=true;
        }
        if(gender.toLowerCase() === "male" || gender.toLowerCase()==="female"){
          setGendererr('');
          boolgender=true;
        }
        else{
          setGendererr('please type valid gender');
          boolgender=false;
        }
        if(repassword === password ){
           setRepassworderr('')
           boolrepass=true;
        }
        else{
          setRepassworderr("password doesn't match");
          boolrepass=false;
        }
       
       
    }

  
    const createaccounthandler = ()=>{
       if(boolem && boolpass && boolgender && booldob && boolrepass && booluser){
        let data = {
          userName:username,
          email:email,
          password:password,
          gender:gender,
          dob:dob,
          bioData:"life is beatiful part",
          picture:avator
        }
        // console.log("object is ready to give api");
        // console.log("data :",data);
      fetch(`${api}/users/createaccount`,{method:"POST",
           headers:{"Content-Type":"application/json"},
           body:JSON.stringify(data)
    }).then(res=>res.json())
    .then(result=>{
      // console.log("result",result);
      if(result.data === undefined){
         setCreateaccounterr("Email is exist already")
      }
      else{
          setCreateaccounterr("");
          setFinder(true);
      } 
    })  
      }
    
 }

    // login handler
    const loginhandler = ()=>{
    // console.log("login handler !!!!!");
    if(loginemail==="" || loginpassword===""){
      setLoginerr("Fill required feilds");
    }
    else{
      setLoginerr("");
      let data ={
        email:loginemail,
        password:loginpassword
      }
      // console.log("data",data);
      fetch(`${api}/users/login`,{method:"POST",
    headers:{"Content-Type":"application/json"},
  body:JSON.stringify(data)
}).then(res=>res.json())
.then(result=>{
  // console.log("result",result);
  if(result.data === undefined){
    setLoginerr("Invalid Email or Password");
  }
  else{
    setLoginerr("");
    const UserData = result.data;
    console.log("first",UserData);
    sessionStorage.setItem("UserData",JSON.stringify(UserData));
    // localStorage.setItem("userData",JSON.stringify(UserData))
    // sessionStorage.setItem("UserData",JSON.stringify(UserData));
    window.location.reload();
  }
})
    }
    }
    
  return (
    <div className='body' style={{"--i":`${screenheight}px`}}>
       <div className='entry'>
      <div className="logopart">
        <div className='logo'>
          <img src={logo} alt="..." />
        </div>
        <div className='account'> 
        <div className='about'> ABOUT</div>
        
        </div>
        
      </div>
       

    
    <div className='back-ground'>  
    { finder ?
     <div className='login'>
      <div className='card p-4'>
        Login <br/><br/>
        <span id="error">{loginerr}</span>
        <form>
          <label htmlFor="username" >Email </label>
          <input id="username" type="text" required onChange={(e)=>setLoginemail(e.target.value)} />
          <label htmlFor="password" >Password </label>
        <input id="password" type="password" required onChange={(e)=>setLoginpassword(e.target.value)} /><br/><br/>
          <center><input type="button" value="Login"  className='btn btn-block btn-success' onClick={()=>{loginhandler()}}/></center>
        </form>
      </div>
      <br/><hr/>      
      <div id='error'>OR</div>
      <span style={{fontWeight:"bolder"}}>  Not have an account ?</span><br/><br/>
      <button className='btn btn-block btn-danger' onClick={()=>{setFinder(false)}}>create an account</button>

      </div>
      :
      <div className='create-account'>
      <div className='card p-4'>
        Create An Account <br/><br/>
        <span id="error">{createaccounterr}</span>
          <span id='error'>{emailerr}</span>
          <label htmlFor="Email">Email  </label>
          <input id="Email" type="text" required onChange={(e)=>setEmail(e.target.value)} />
          <span id='error'>{usernameerr}</span>
          <label htmlFor="username">Username </label>
          <input id="username" type="text" required onChange={(e)=>setUsername(e.target.value)} />
          <span id='error'>{gendererr}</span>
          <label htmlFor="gender">gender</label>
          <input id="gender" type="text" required onChange={(e)=>setGender(e.target.value)} />
          <span id='error'>{doberr}</span>
          <label htmlFor="dob">DOB</label>
          <input id="dob" type="date" required onChange={(e)=>setDOB(e.target.value)} />
          <span id='error'>{passworderr}</span>
          <label htmlFor="password" >Password </label>
          <input id="password" type="password" required onChange={(e)=>setPassword(e.target.value)} />
          <span id='error'>{repassworderr}</span>
          <label htmlFor="con-password" >Confrim Password </label>
          <input id="con-password" type="password" required onChange={(e)=>setRepassword(e.target.value)} /><br/>
       <center><button className='btn btn-block btn-danger' onClick={()=>{datavalidationhandler();createaccounthandler()}} >Create An Account</button></center> 
      </div>
      <br/><hr/>
      <div id='error'>OR</div><br/>
      <div style={{fontWeight:"bolder"}}>Already have an account ?</div><br/>
      <button className='btn btn-block btn-success' onClick={()=>setFinder(true)}>Login</button>
      </div>
      }


    </div>
   

  
        
    </div>

    </div>
   
  )
}

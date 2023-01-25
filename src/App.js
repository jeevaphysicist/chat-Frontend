import { useState } from "react";
// import Next from "./Components/Next";
import Home from "../src/Components/HomePages/Home";
import {Routes,Route} from "react-router-dom";
import Chat from "./Components/Chat/Chat";
import Mobilechat from "./Components/Chat/Mobilechat";



function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);



  return (
    <div>
      <Routes>
        <Route path="/" element={<Home/>} />
        {/* <Route  path="/chat" element={<Chat/>} />
        <Route path="/mobile" element={<Mobilechat/>} /> */}
      </Routes>
     
     
    </div>
  );
}

export default App;



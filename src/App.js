import { useState, useEffect } from "react"
import userAvatar from './images/user-avatar.jpg'
import assistantAvatar from './images/assistant-avatar.png'



const App = () => {
  const[ value, setValue] = useState(null)
  const[ message, setMessage] = useState(null)
  const[ previousChats, setpreviousChats] = useState([])
  const[ currentTitle, setCurrentTitle] = useState(null)
  const Createnewchat = () =>{
    setMessage(null)
    setValue("")
    setCurrentTitle(null)
  }

  const handleClick = (uniqueTitles) => {
    setCurrentTitle(uniqueTitles)
    setMessage(null)
    setValue("")
  }
  const getMessages = async () => {
    const options = {
      method: "POST",
      body : JSON.stringify({
      message: value
      }),
      headers: {
        "Content-Type" : "application/json"
      }
    }
    try {
      const response = await fetch('https://server-chatgpt-omega.vercel.app/', options)
      const data = await response.json()
      console.log(message)
      if (data.choices && data.choices.length > 0) {
        setMessage(data.choices[0].message);
      } else {
        console.error("No choices found in API response");
      }
    } 
    catch(error) {
      console.error(error)
    }
  }
  
  

  const addChatMessage = (role, content) => {
    const now = new Date();
  const options = { hour: 'numeric', minute: 'numeric', hour12: true };
  const timestamp = now.toLocaleTimeString(undefined, options);
    setpreviousChats((previousChats) => [
      ...previousChats,
      {
        title: currentTitle,
        role,
        content,
        timestamp, // Add the timestamp to the chat message
      },
    ])
  }
useEffect(() => {
  console.log(currentTitle, value, message)
  if(!currentTitle && value && message ){
    setCurrentTitle(value)
}
 if(currentTitle && value && message){
  addChatMessage("user", value)
  addChatMessage(message.role, message.content)
}// eslint-disable-next-line
},[currentTitle, message])
  console.log(previousChats)
  const currentChat = previousChats.filter(previousChats => previousChats.title === currentTitle)
  const uniqueTitles = Array.from(new Set(previousChats.map(previousChats => previousChats.title)))
  console.log(uniqueTitles)
  return(
    <div className="app">
      <div className = "side-bar">
      
        <button onClick = {Createnewchat}> + New Chat</button>

      <ul className = "history">
      {uniqueTitles?.map((uniqueTitles, index) => <li key= {index}onClick={() =>handleClick(uniqueTitles)}>{uniqueTitles}</li>)}
      </ul>
      <nav>
        <p>Made by Abdul Rahman</p>
      </nav>
      </div>
      <section className = "main">
        {!currentTitle && <h1>SastaGPT</h1>}
        <ul className = "feed">
          {currentChat?.map((chatMessage, index) => 
          <li key={index}>
            <div className="message">
        <img className="avatar" src={chatMessage.role === 'user' ? userAvatar : assistantAvatar} alt={chatMessage.role} />
            <p className="timestamp">{chatMessage.timestamp}</p>
      </div>
        <p>{chatMessage.content}</p>
            
            </li>)}
        </ul>
        <div className = "bottom-section">
          <div className= "input-container">
            <input value = {value} onChange={(e) => setValue(e.target.value)} />
            <div id = "submit" onClick={getMessages}>â¢</div>
            </div>
            <p className= "info">Your Feedback is appreciated</p>

        </div>
    </section>
      
    </div>
  )

}

export default App;

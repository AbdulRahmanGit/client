import { useState, useEffect } from "react";
import userAvatar from './images/user-avatar.png';
import assistantAvatar from './images/assistant-avatar.png';
import loadingSpinner from './images/loadingSpinner.webp';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBolt } from '@fortawesome/free-solid-svg-icons';

const App = () => {
  const [value, setValue] = useState("");
  const [message, setMessage] = useState(null);
  const [previousChats, setPreviousChats] = useState([]);
  const [currentTitle, setCurrentTitle] = useState(null);
  const [loading, setLoading] = useState(false);

  const createNewChat = () => {
    setMessage(null);
    setValue("");
    setCurrentTitle(null);
  };

  const handleClick = (uniqueTitle) => {
    setCurrentTitle(uniqueTitle);
    setMessage(null);
    setValue("");
  };

  const getMessages = async () => {
    const options = {
      method: "POST",
      body: JSON.stringify({ message: value }),
      headers: {
        "Content-Type": "application/json"
      }
    };
    setLoading(true);
    try {
      const response = await fetch('https://server-chatgpt-omega.vercel.app/', options);
      const data = await response.json();
      if (data.choices && data.choices.length > 0) {
        setMessage(data.choices[0].message);
      } else {
        console.error("No choices found in API response");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const addChatMessage = (role, content) => {
    const now = new Date();
    const options = { hour: 'numeric', minute: 'numeric', hour12: true };
    const timestamp = now.toLocaleTimeString(undefined, options);
    setPreviousChats((prevChats) => [
      ...prevChats,
      { title: currentTitle, role, content, timestamp }
    ]);
  };

  useEffect(() => {
    if (currentTitle && value && message) {
      addChatMessage("user", value);
      addChatMessage(message.role, message.content);
    } else if (!currentTitle && value && message) {
      setCurrentTitle(value);
    }
    // eslint-disable-next-line
  }, [currentTitle, message]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      getMessages();
    }
  };

  const currentChat = previousChats.filter(chat => chat.title === currentTitle);
  const uniqueTitles = Array.from(new Set(previousChats.map(chat => chat.title)));

  return (
    <div className="app">
      <div className="side-bar">
        <button onClick={createNewChat}>+ New Chat</button>
        <ul className="history">
          {uniqueTitles.length > 0 && <p className="today">Today</p>}
          {uniqueTitles.map((title, index) => (
            <li key={index} onClick={() => handleClick(title)}>
              {title}
            </li>
          ))}
        </ul>
        <div className="sidebar-info">
          <div className="sidebar-info-upgrade">
            <FontAwesomeIcon icon={faBolt} size="sm" />
            <p>
              Upgrade plan
              <br />
              <span className="sidebar-info-upgrade-subtext">
                Get GPT-4, DALL·E, and more
              </span>
            </p>
          </div>
          <div className="sidebar-info-user">
            <FontAwesomeIcon icon={faUser} size="sm" />
            <p>User</p>
          </div>
        </div>
      </div>
      <section className="main">
        {!currentTitle && <h1>SastaGPT</h1>}
        <ul className="feed">
          {currentChat.map((chatMessage, index) => (
            <li key={index}>
              <div className="message">
                <img
                  className="avatar"
                  src={chatMessage.role === 'user' ? userAvatar : assistantAvatar}
                  alt={chatMessage.role}
                />
                <p className="timestamp">{chatMessage.timestamp}</p>
              </div>
              <p>{chatMessage.content}</p>
            </li>
          ))}
        </ul>
        <div className="bottom-section">
          <div className="input-container">
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
            />
            {loading ? (
              <img className="loadingSpinner" src={loadingSpinner} alt="Loading" />
            ) : (
              <div id="submit" onClick={getMessages}>➢</div>
            )}
          </div>
          <p className="info">
            ChatGPT can make mistakes. Consider checking important information. Feedback will be Appreciated
          </p>
        </div>
      </section>
    </div>
  );
};

export default App;

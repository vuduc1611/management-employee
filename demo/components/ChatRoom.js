import React, { useEffect, useState } from "react";
import { over } from "stompjs";
import SockJS from "sockjs-client";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import userApi from "../../pages/api/userApi";
import { Dialog } from "primereact/dialog";

var stompClient = null;
const ChatRoom = ({ hideChatRoom }) => {
  const [privateChats, setPrivateChats] = useState(new Map());
  const [tab, setTab] = useState(null);
  const [users, setUsers] = useState([]);
  const [showListSelect, setShowListSelect] = useState(true);
  const [showChatDisplay, setShowChatDisplay] = useState(false);
  const [userConnected, setUserConnected] = useState(null);
  const [userData, setUserData] = useState({
    username: localStorage.getItem("user"),
    receivername: "",
    connected: false,
    message: "",
  });
  useEffect(() => {
    const fetchData = async () => {
      await userApi
        .getAll()
        .then((res) =>
          setUsers(res.map((r) => ({ id: r.id, name: r.username })))
        );
    };
    fetchData();
  }, []);
  useEffect(() => {
    console.log(userData);
  }, [userData]);

  const connect = () => {
    let Sock = new SockJS("http://localhost:8080/ws");
    stompClient = over(Sock);
    stompClient.connect({}, onConnected, onError);
  };

  const onConnected = () => {
    setUserData({ ...userData, connected: true });
    stompClient.subscribe(
      "/user/" + userData.username + "/private",
      onPrivateMessage
    );
  };

  const onPrivateMessage = (payload) => {
    console.log(payload);
    var payloadData = JSON.parse(payload.body);
    if (privateChats.get(payloadData.senderName)) {
      privateChats.get(payloadData.senderName).push(payloadData);
      setPrivateChats(new Map(privateChats));
    } else {
      let list = [];
      list.push(payloadData);
      privateChats.set(payloadData.senderName, list);
      setPrivateChats(new Map(privateChats));
    }
  };

  const onError = (err) => {
    console.log(err);
  };

  const handleMessage = (event) => {
    const { value } = event.target;
    setUserData({ ...userData, message: value });
  };

  const sendPrivateValue = () => {
    console.log("here");
    if (stompClient) {
      var chatMessage = {
        senderName: userData.username,
        receiverName: tab,
        message: userData.message,
        status: "MESSAGE",
      };

      if (userData.username !== tab) {
        privateChats.get(tab)?.push(chatMessage);
        setPrivateChats(new Map(privateChats));
      }
      stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
      setUserData({ ...userData, message: "" });
    }
  };

  // const handleSearch = () => {};
  const handleClickStartChat = (event) => {
    console.log("check event", event);
    let list = [];
    privateChats.set(userData.username, list).set(event.name, list);
    setPrivateChats(new Map(privateChats));
    connect();
    setTab(event.name);
    setUserConnected(event);
    setShowListSelect(false);
    setShowChatDisplay(true);
  };
  const onHideChatRoom = () => {
    setShowChatDisplay(false);
    hideChatRoom();
  };
  const headerChat = (
    <div className="inline-block text-4xl">{userConnected?.name}</div>
  );
  return (
    <>
      {showListSelect && (
        <div className="card flex flex-column ">
          <span className="text-2xl mb-2">Chat</span>

          {users
            .filter((user) => user.name !== userData.username)
            .map((user) => (
              <Button
                key={user.id}
                rounded
                text
                raised
                className="mb-2 bg-yellow-50 w-10"
                onClick={() => handleClickStartChat(user)}
              >
                {user.name}
              </Button>
            ))}
        </div>
      )}

      {showChatDisplay && (
        <Dialog
          visible={showChatDisplay}
          header={headerChat}
          className="chat-box p-0"
          onHide={onHideChatRoom}
        >
          <div className="chat-content w-full">
            <ul className="chat-messages">
              {[...privateChats.get(tab)].map((chat, index) => (
                <li
                  className={`message ${
                    chat.senderName === userData.username && "self"
                  }`}
                  key={index}
                >
                  {chat.senderName !== userData.username && (
                    <div className="avatar">{chat.senderName}</div>
                  )}
                  <div className="message-data">{chat.message}</div>
                  {chat.senderName === userData.username && (
                    <div className="avatar self">{chat.senderName}</div>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="send-message">
            <input
              type="text"
              className="input-message"
              placeholder="enter the message"
              value={userData.message}
              onChange={handleMessage}
            />
            <button
              type="button"
              className="send-button"
              onClick={sendPrivateValue}
            >
              send
            </button>
          </div>
        </Dialog>
      )}
    </>
  );
};

export default ChatRoom;

// import React, { useEffect, useState } from "react";
// import { over } from "stompjs";
// import SockJS from "sockjs-client";

// var stompClient = null;
// const ChatRoom = () => {
//   const [privateChats, setPrivateChats] = useState(new Map());
//   const [publicChats, setPublicChats] = useState([]);
//   const [tab, setTab] = useState("CHATROOM");
//   const [userData, setUserData] = useState({
//     username: "",
//     receivername: "",
//     connected: false,
//     message: "",
//   });
//   useEffect(() => {
//     console.log(userData);
//   }, [userData]);

//   const connect = () => {
//     let Sock = new SockJS("http://localhost:8080/ws");
//     stompClient = over(Sock);
//     stompClient.connect({}, onConnected, onError);
//   };

//   const onConnected = () => {
//     setUserData({ ...userData, connected: true });
//     stompClient.subscribe("/chatroom/public", onMessageReceived);
//     stompClient.subscribe(
//       "/user/" + userData.username + "/private",
//       onPrivateMessage
//     );
//     userJoin();
//   };

//   const userJoin = () => {
//     var chatMessage = {
//       senderName: userData.username,
//       status: "JOIN",
//     };
//     stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
//   };

//   const onMessageReceived = (payload) => {
//     var payloadData = JSON.parse(payload.body);
//     switch (payloadData.status) {
//       case "JOIN":
//         if (!privateChats.get(payloadData.senderName)) {
//           privateChats.set(payloadData.senderName, []);
//           setPrivateChats(new Map(privateChats));
//         }
//         break;
//       case "MESSAGE":
//         publicChats.push(payloadData);
//         setPublicChats([...publicChats]);
//         break;
//     }
//     console.log("check privateChats", privateChats);
//     console.log("check publicChats", publicChats);
//   };

//   const onPrivateMessage = (payload) => {
//     console.log(payload);
//     var payloadData = JSON.parse(payload.body);
//     if (privateChats.get(payloadData.senderName)) {
//       privateChats.get(payloadData.senderName).push(payloadData);
//       setPrivateChats(new Map(privateChats));
//     } else {
//       let list = [];
//       list.push(payloadData);
//       privateChats.set(payloadData.senderName, list);
//       setPrivateChats(new Map(privateChats));
//     }
//     console.log("check onPrivateMessage", onPrivateMessage);
//   };

//   const onError = (err) => {
//     console.log(err);
//   };

//   const handleMessage = (event) => {
//     const { value } = event.target;
//     setUserData({ ...userData, message: value });
//   };
//   const sendValue = () => {
//     if (stompClient) {
//       var chatMessage = {
//         senderName: userData.username,
//         message: userData.message,
//         status: "MESSAGE",
//       };
//       console.log(chatMessage);
//       stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
//       setUserData({ ...userData, message: "" });
//     }
//   };

//   const sendPrivateValue = () => {
//     if (stompClient) {
//       var chatMessage = {
//         senderName: userData.username,
//         receiverName: tab,
//         message: userData.message,
//         status: "MESSAGE",
//       };

//       if (userData.username !== tab) {
//         privateChats.get(tab).push(chatMessage);
//         setPrivateChats(new Map(privateChats));
//       }
//       stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
//       setUserData({ ...userData, message: "" });
//     }
//     console.log("check tab", tab);
//   };

//   const handleUsername = (event) => {
//     const { value } = event.target;
//     setUserData({ ...userData, username: value });
//   };

//   const registerUser = () => {
//     connect();
//   };
//   return (
//     <div className="container">
//       {userData.connected ? (
//         <div className="chat-box">
//           <div className="member-list">
//             <ul>
//               <li
//                 onClick={() => {
//                   setTab("CHATROOM");
//                 }}
//                 className={`member ${tab === "CHATROOM" && "active"}`}
//               >
//                 Chatroom
//               </li>
//               {[...privateChats.keys()].map((name, index) => (
//                 <li
//                   onClick={() => {
//                     setTab(name);
//                   }}
//                   className={`member ${tab === name && "active"}`}
//                   key={index}
//                 >
//                   {name}
//                 </li>
//               ))}
//             </ul>
//           </div>
//           {tab === "CHATROOM" && (
//             <div className="chat-content">
//               <ul className="chat-messages">
//                 {publicChats.map((chat, index) => (
//                   <li
//                     className={`message ${
//                       chat.senderName === userData.username && "self"
//                     }`}
//                     key={index}
//                   >
//                     {chat.senderName !== userData.username && (
//                       <div className="avatar">{chat.senderName}</div>
//                     )}
//                     <div className="message-data">{chat.message}</div>
//                     {chat.senderName === userData.username && (
//                       <div className="avatar self">{chat.senderName}</div>
//                     )}
//                   </li>
//                 ))}
//               </ul>

//               <div className="send-message">
//                 <input
//                   type="text"
//                   className="input-message"
//                   placeholder="enter the message"
//                   value={userData.message}
//                   onChange={handleMessage}
//                 />
//                 <button
//                   type="button"
//                   className="send-button"
//                   onClick={sendValue}
//                 >
//                   send
//                 </button>
//               </div>
//             </div>
//           )}
//           {tab !== "CHATROOM" && (
//             <div className="chat-content">
//               <ul className="chat-messages">
//                 {[...privateChats.get(tab)].map((chat, index) => (
//                   <li
//                     className={`message ${
//                       chat.senderName === userData.username && "self"
//                     }`}
//                     key={index}
//                   >
//                     {chat.senderName !== userData.username && (
//                       <div className="avatar">{chat.senderName}</div>
//                     )}
//                     <div className="message-data">{chat.message}</div>
//                     {chat.senderName === userData.username && (
//                       <div className="avatar self">{chat.senderName}</div>
//                     )}
//                   </li>
//                 ))}
//               </ul>

//               <div className="send-message">
//                 <input
//                   type="text"
//                   className="input-message"
//                   placeholder="enter the message"
//                   value={userData.message}
//                   onChange={handleMessage}
//                 />
//                 <button
//                   type="button"
//                   className="send-button"
//                   onClick={sendPrivateValue}
//                 >
//                   send
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       ) : (
//         <div className="register">
//           <input
//             id="user-name"
//             placeholder="Enter your name"
//             name="userName"
//             value={userData.username}
//             onChange={handleUsername}
//             margin="normal"
//           />
//           <button type="button" onClick={registerUser}>
//             connect
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChatRoom;

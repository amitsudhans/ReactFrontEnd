import { useEffect, useRef, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  transports: ["websocket"],
});

const Chat = () => {
  // 🔐 Logged-in user
  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const messagesEndRef = useRef(null);
  const registeredRef = useRef(false);
  const [onlineUsers, setOnlineUsers] = useState([]);

  /* -------------------------
     FETCH USERS (OTHER USERS)
  -------------------------- */

useEffect(() => {
  const handleOnlineUsers = (users) => {
    setOnlineUsers(users);
  };

  socket.on("onlineUsers", handleOnlineUsers);

  return () => {
    socket.off("onlineUsers", handleOnlineUsers);
  };
}, []);




/*
  useEffect(() => {
    fetch("http://localhost:5000/api/users")
      .then((res) => res.json())
      .then((data) => {
        const otherUsers = data.filter(
          (u) => u._id !== loggedInUser._id
        );
        setUsers(otherUsers);
      });
  }, []);  
   */

useEffect(() => {
  fetch("http://localhost:5000/api/users")
    .then((res) => res.json())
    .then((data) => {
      setUsers(data); // include logged-in user also
    });
}, []);


  /* -------------------------
     SOCKET SETUP
  -------------------------- */
  useEffect(() => {
    if (!loggedInUser) return;

    if (!registeredRef.current) {
      socket.emit("register", loggedInUser._id);
      registeredRef.current = true;
    }

    const handleReceiveMessage = (msg) => {
      if (
        selectedUser &&
        ((msg.senderId === loggedInUser._id &&
          msg.receiverId === selectedUser._id) ||
          (msg.senderId === selectedUser._id &&
            msg.receiverId === loggedInUser._id))
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.off("receiveMessage", handleReceiveMessage);
    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };


 

  }, [selectedUser]);

  /* -------------------------
     AUTO SCROLL
  -------------------------- */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* -------------------------
     SEND MESSAGE
  -------------------------- */
  const sendMessage = () => {
    if (!message.trim() || !selectedUser) return;

    socket.emit("sendMessage", {
      senderId: loggedInUser._id,
      receiverId: selectedUser._id,
      message,
    });

    // show own message instantly
    setMessages((prev) => [
      ...prev,
      {
        senderId: loggedInUser._id,
        receiverId: selectedUser._id,
        message,
      },
    ]);

    setMessage("");
  };


console.log(onlineUsers);

const isOnline = (id) => onlineUsers.includes(String(id));

  const sortedUsers = [
  // logged-in user first
  ...users.filter(u => String(u._id) === String(loggedInUser._id)),
  // rest of users
  ...users.filter(u => String(u._id) !== String(loggedInUser._id))
];

  return (
    <DashboardLayout>
      <div style={styles.wrapper}>
        {/* USER LIST */}
        <div style={styles.userList}>
          <h3>Users</h3>
          {sortedUsers.map((user) => (
            <div
              key={user._id}
              style={{
                ...styles.userItem,              
                background:
                  selectedUser?._id === user._id
                    ? "#ddd"
                    : "#f5f5f5",
                color: isOnline(user._id) ? "red" : "gray",

              }}
              onClick={() => {
                setSelectedUser(user);
                setMessages([]);
              }}
            >
              {user.name}
            </div>
          ))}
        </div>

        {/* CHAT AREA */}
        <div style={styles.chatContainer}>
          {selectedUser ? (
            <>
              <h3>💬 Chat with {selectedUser.name}</h3>

              <div style={styles.chatBox}>
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    style={{
                      ...styles.message,
                      alignSelf:
                        msg.senderId === loggedInUser._id
                          ? "flex-end"
                          : "flex-start",
                      background:
                        msg.senderId === loggedInUser._id
                          ? "#dcf8c6"
                          : "#e1e1e1",
                    }}
                  >
                    {msg.message}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div style={styles.inputBox}>
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type message..."
                  onKeyDown={(e) =>
                    e.key === "Enter" && sendMessage()
                  }
                  style={styles.input}
                />
                <button onClick={sendMessage} style={styles.button}>
                  Send
                </button>
              </div>
            </>
          ) : (
            <h3>Select a user to start chat</h3>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

/* -------------------------
   STYLES
-------------------------- */
const styles = {
  wrapper: {
    display: "flex",
    height: "500px",
  },
  userList: {
    width: "200px",
    borderRight: "1px solid #ccc",
    padding: "10px",
  },
  userItem: {
    padding: "10px",
    marginBottom: "5px",
    cursor: "pointer",
    borderRadius: "4px",
  },
  chatContainer: {
    flex: 1,
    padding: "10px",
    display: "flex",
    flexDirection: "column",
  },
  chatBox: {
    flex: 1,
    border: "1px solid #ccc",
    padding: "10px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
  },
  message: {
    marginBottom: "6px",
    padding: "8px",
    borderRadius: "5px",
    maxWidth: "70%",
  },
  inputBox: {
    display: "flex",
    marginTop: "10px",
  },
  input: {
    flex: 1,
    padding: "10px",
  },
  button: {
    padding: "10px",
  },
};

export default Chat;

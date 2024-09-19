import { useState, useEffect, useRef, useCallback } from "react";
import { io } from "socket.io-client";
import PropTypes from "prop-types";
import VideoChat from "./VideoChat";
import { motion, AnimatePresence } from "framer-motion";
import { FiInfo, FiVideo, FiMessageSquare, FiMenu, FiSend, FiCheck, FiCheckCircle, FiSmile, FiX } from "react-icons/fi";
import { Popover, Transition, PopoverButton, PopoverPanel } from "@headlessui/react";
import { useInView } from "react-intersection-observer";
import { format } from "date-fns";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

const CommunicationSystem = ({
  userToken,
  userId,
  userType,
  userName,
  userAvatar,
  appointments,
}) => {
  const [socket, setSocket] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState({});
  const [logs, setLogs] = useState([]);
  const [showVideoChat, setShowVideoChat] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);
  const [isTyping, setIsTyping] = useState({});
  const [lastRead, setLastRead] = useState({});
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef(null);
  const [ref] = useInView({
    threshold: 0,
  });

  const addLog = useCallback((message) => {
    setLogs((prevLogs) => [
      ...prevLogs,
      `${new Date().toLocaleTimeString()}: ${message}`,
    ]);
  }, []);

  useEffect(() => {
    const newSocket = io("https://cyber-guidance.onrender.com", {
      auth: { token: userToken },
    });

    newSocket.on("connect", () => {
      console.log("Connected to socket server");
      addLog("Connected to socket server");
      appointments.forEach((appointment) => {
        newSocket.emit("join_room", { roomId: appointment.roomId });
        addLog(`Joined room: ${appointment.roomId}`);
      });
    });

    newSocket.on("error", (error) => {
      console.error("Socket error:", error);
      addLog(`Socket error: ${error.message}`);
    });

    newSocket.on("receive_message", ({ id, user, message, roomId }) => {
      console.log(`Received message: ${message} from ${user.type} ${user.id} in room ${roomId}`);
    
      // Only add the message if it's not from the current user or doesn't have the same ID as a locally sent message
      if (user.id !== userId && !messages[roomId]?.some(msg => msg.id === id)) {
        setMessages((prev) => ({
          ...prev,
          [roomId]: [
            ...(prev[roomId] || []),
            { id, message, sender: user, timestamp: new Date().toISOString() },
          ],
        }));
        addLog(`Received message in room ${roomId} from ${user.type} ${user.id}`);
      } else {
        console.log("Ignored message from self or duplicate");
      }
    });
    
    

    newSocket.on("user_typing", ({ roomId, userId: typingUserId }) => {
      setIsTyping((prev) => ({ ...prev, [roomId]: typingUserId }));
      setTimeout(
        () => setIsTyping((prev) => ({ ...prev, [roomId]: null })),
        3000
      );
    });

    newSocket.on("message_read", ({ roomId, userId: readByUserId }) => {
      setLastRead((prev) => ({ ...prev, [roomId]: readByUserId }));
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from socket server");
      addLog("Disconnected from socket server");
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      addLog("Disconnected from socket server");
    };
  }, [userToken, appointments, userId, addLog, messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(() => {
    if (inputMessage.trim() !== "" && selectedUser) {
      const roomId = selectedUser.roomId;
      const messageId = `${userId}-${new Date().getTime()}`; // Create a unique ID for the message
  
      const newMessage = {
        id: messageId, // Include the unique ID
        message: inputMessage,
        sender: { id: userId, type: userType, name: userName },
        roomId,
        timestamp: new Date().toISOString(),
      };
      
      // Emit the message to the server
      socket.emit("send_message", newMessage);
      
      // Add the message to the local state immediately
      setMessages((prev) => ({
        ...prev,
        [roomId]: [...(prev[roomId] || []), newMessage],
      }));
  
      setInputMessage("");
    }
  }, [inputMessage, selectedUser, userId, userType, userName, socket]);
  

  const handleTyping = useCallback(() => {
    if (selectedUser) {
      socket.emit("user_typing", { roomId: selectedUser.roomId, userId });
    }
  }, [selectedUser, socket, userId]);

  const toggleVideoChat = () => setShowVideoChat(!showVideoChat);

  const userList = appointments.map((appointment) => {
    const otherUser =
      userType === "student" ? appointment.counselor : appointment.student;
    return {
      id: otherUser.email,
      name: otherUser.fullName,
      avatar: otherUser.profilePicture,
      isOnline: otherUser.isOnline,
      roomId: appointment.roomId,
    };
  });

  const handleUserSelect = useCallback((user) => {
    setSelectedUser(user);
    if (window.innerWidth < 640) {
      setShowSidebar(false);
    }
    socket.emit("message_read", { roomId: user.roomId, userId });
  }, [socket, userId]);

  const addEmoji = (emoji) => {
    setInputMessage((prev) => prev + emoji.native);
    setShowEmojiPicker(false);
  };

  const toggleSidebar = () => setShowSidebar(!showSidebar);

  return (
    <div className="flex m-auto h-[calc(100vh-10rem)] bg-gray-100 max-w-3xl shadow-2xl rounded-lg overflow-hidden relative">
      {/* Sidebar */}
      <AnimatePresence>
        {showSidebar && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="absolute md:relative z-20 h-full w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto"
          >
            <div className="flex justify-start items-center mb-6">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-3 ring-2 ring-blue-500">
                  <img
                    src={userAvatar || "/default-avatar.png"}
                    alt={userName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">{userName}</h2>
                  <p className="text-sm text-gray-600 capitalize">{userType}</p>
                </div>
              </div>
              <button onClick={toggleSidebar} className="md:hidden text-gray-500 hover:text-gray-700">
                <FiX size={24} />
              </button>
            </div>
            <h3 className="text-md font-medium text-gray-700 mb-4">Chats</h3>
            {userList.map((user) => (
              <motion.button
                key={user.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center p-3 mb-2 rounded-lg cursor-pointer w-full transition-all duration-200 ${
                  selectedUser && selectedUser.roomId === user.roomId
                    ? "bg-blue-100 shadow-md"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => {
                  handleUserSelect(user);
                  if (window.innerWidth < 768) {
                    toggleSidebar();
                  }
                }}
              >
                <div className="relative">
                  <img
                    src={user.avatar || "/default-avatar.png"}
                    alt={user.name}
                    className="w-10 h-10 rounded-full border-2 border-gray-200"
                  />
                  <span
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${
                      user.isOnline ? "bg-green-500" : "bg-gray-500"
                    }`}
                  ></span>
                </div>
                <div className="ml-3 flex-1">
                  <p className="font-semibold text-gray-800">{user.name}</p>
                  <p className="text-sm text-gray-600">
                    {user.isOnline ? "Online" : "Offline"}
                  </p>
                </div>
                {messages[user.roomId]?.length > 0 && lastRead[user.roomId] !== userId && (
                  <div className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {messages[user.roomId].filter(
                      (msg) => msg.sender.id !== userId && !msg.read
                    ).length}
                  </div>
                )}
               
              </motion.button>
            ))}
            
          </motion.div>
        )}
        
      </AnimatePresence>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedUser && (
          <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center">
              <button onClick={toggleSidebar} className="mr-4">
                <FiMenu size={24} className="text-gray-600 hover:text-gray-800" />
              </button>
              <img
                src={selectedUser.avatar || "/default-avatar.png"}
                alt={selectedUser.name}
                className="w-10 h-10 rounded-full mr-3 border-2 border-gray-200"
              />
              <div>
                <h2 className="text-lg font-semibold text-gray-800">{selectedUser.name}</h2>
                <p className="text-sm text-gray-600">
                  {selectedUser.isOnline ? "Online" : "Offline"}
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleVideoChat}
              className="bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {showVideoChat ? (
                <FiMessageSquare size={20} />
              ) : (
                <FiVideo size={20} />
              )}
            </motion.button>
          </div>
        )}

        {selectedUser ? (
          showVideoChat ? (
            <VideoChat
              socket={socket}
              roomId={selectedUser.roomId}
              userId={userId}
              userType={userType}
              userName={userName}
              userAvatar={userAvatar}
              messages={messages[selectedUser.roomId] || []}
              sendMessage={sendMessage}
              leaveRoom={() => setSelectedUser(null)}
            />
          ) : (
            <>
              <div className="flex-1 p-4 overflow-y-auto bg-gray-50" ref={ref}>
                {messages[selectedUser.roomId]?.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`mb-4 flex ${
                      msg.sender.id === userId ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex items-end ${
                        msg.sender.id === userId ? "flex-row-reverse" : "flex-row"
                      }`}
                    >
                      <img
                        src={
                          msg.sender.id === userId
                            ? userAvatar
                            : selectedUser.avatar || "/default-avatar.png"
                        }
                        alt={msg.sender.id === userId ? userName : selectedUser.name}
                        className="w-8 h-8 rounded-full mx-2"
                      />
                      <div
                        className={`max-w-xs p-3 rounded-lg shadow-md ${
                          msg.sender.id === userId
                            ? "bg-blue-500 text-white"
                            : "bg-white text-gray-800"
                        }`}
                      >
                        <p className="break-words">{msg.message}</p>
                        <p className="text-xs mt-1 opacity-75">
                          {format(new Date(msg.timestamp), "p")}
                        </p>
                      </div>
                    </div>
                    {msg.sender.id === userId && (
                      <div className="self-end ml-2">
                        {lastRead[selectedUser.roomId] === selectedUser.id ? (
                          <FiCheckCircle className="text-green-500" />
                        ) : (
                          <FiCheck className="text-gray-500" />
                        )}
                      </div>
                    )}
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <div className="p-4 border-t border-gray-200 bg-white">
                {isTyping[selectedUser.roomId] && (
                  <p className="text-sm text-gray-500 mb-2">
                    {selectedUser.name} is typing...
                  </p>
                )}
                <div className="flex items-center">
                  <button
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="mr-2 text-gray-500 hover:text-gray-700"
                  >
                    <FiSmile size={24} />
                  </button>
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") sendMessage();
                      handleTyping();
                    }}
                    className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Type a message..."
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={sendMessage}
                    className="bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <FiSend size={20} />
                  </motion.button>
                </div>
                {showEmojiPicker && (
                  <div className="absolute bottom-16 right-4">
                    <Picker data={data} onEmojiSelect={addEmoji} />
                  </div>
                )}
              </div>
            </>
          )
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-50">
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-xl text-gray-500"
            >
              Select a user to start chatting
            </motion.p>
          </div>
        )}
      </div>

      {/* Logs Popover */}
      <Popover className="fixed bottom-4 right-4">
        {({ open }) => (
          <>
            <PopoverButton className="bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
              <FiInfo size={20} />
            </PopoverButton>
            <Transition
              show={open}
              enter="transition duration-100 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <PopoverPanel className="absolute bottom-full right-0 mb-2 w-80 max-h-60 overflow-y-auto bg-gray-800 text-white p-4 rounded-lg shadow-lg">
                <h3 className="font-bold mb-2">Logs:</h3>
                {logs.map((log, index) => (
                  <p key={index} className="text-sm mb-1">
                    {log}
                  </p>
                ))}
              </PopoverPanel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  );
};

CommunicationSystem.propTypes = {
  userToken: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  userType: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
  userAvatar: PropTypes.string,
  appointments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      roomId: PropTypes.string.isRequired,
      startTime: PropTypes.string.isRequired,
      endTime: PropTypes.string.isRequired,
      counselor: PropTypes.shape({
        email: PropTypes.string.isRequired,
        fullName: PropTypes.string.isRequired,
        profilePicture: PropTypes.string,
        isOnline: PropTypes.bool.isRequired,
      }),
      student: PropTypes.shape({
        email: PropTypes.string.isRequired,
        fullName: PropTypes.string.isRequired,
        profilePicture: PropTypes.string,
        isOnline: PropTypes.bool.isRequired,
      }),
    })
  ).isRequired,
};

export default CommunicationSystem;
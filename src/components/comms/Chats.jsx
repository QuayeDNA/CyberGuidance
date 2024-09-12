import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import PropTypes from 'prop-types';
import VideoChat from './VideoChat';
import { FiInfo, FiVideo, FiMessageSquare, FiMenu, FiSend, FiCheck, FiCheckCircle } from 'react-icons/fi';
import { Popover, Transition } from '@headlessui/react';

const CommunicationSystem = ({ userToken, userId, userType, userName, userAvatar, appointments, userInfo }) => {
  const [socket, setSocket] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState({});
  const [logs, setLogs] = useState([]);
  const [showVideoChat, setShowVideoChat] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [showSidebar, setShowSidebar] = useState(true);
  const [isTyping, setIsTyping] = useState({});
  const [lastRead, setLastRead] = useState({});
  const messagesEndRef = useRef(null);

  const addLog = (message) => {
    setLogs(prevLogs => [...prevLogs, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    const newSocket = io("https://cyber-guidance.onrender.com", {
      auth: { token: userToken }
    });

    newSocket.on('connect', () => {
      addLog('Connected to socket server');
      appointments.forEach(appointment => {
        newSocket.emit('join_room', { roomId: appointment.roomId });
        addLog(`Joined room: ${appointment.roomId}`);
      });
    });

    newSocket.on('receive_message', ({ roomId, message, sender }) => {
      addLog(`Received message in room ${roomId} from ${sender.type} ${sender.id}`);
      setMessages(prev => ({
        ...prev,
        [roomId]: [...(prev[roomId] || []), { message, sender, timestamp: new Date().toISOString() }]
      }));
      if (selectedUser && selectedUser.roomId === roomId) {
        newSocket.emit('message_read', { roomId, userId });
      }
    });

    newSocket.on('user_typing', ({ roomId, userId: typingUserId }) => {
      setIsTyping(prev => ({ ...prev, [roomId]: typingUserId }));
      setTimeout(() => setIsTyping(prev => ({ ...prev, [roomId]: null })), 3000);
    });

    newSocket.on('message_read', ({ roomId, userId: readByUserId }) => {
      setLastRead(prev => ({ ...prev, [roomId]: readByUserId }));
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      addLog('Disconnected from socket server');
    };
  }, [userToken, appointments, selectedUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (inputMessage.trim() !== '' && selectedUser) {
      const roomId = selectedUser.roomId;
      addLog(`Sending message to room ${roomId}`);
      const newMessage = {
        message: inputMessage,
        sender: { id: userId, type: userType, name: userName, avatar: userAvatar },
        timestamp: new Date().toISOString()
      };
      socket.emit('send_message', { roomId, ...newMessage });
      setMessages(prev => ({
        ...prev,
        [roomId]: [...(prev[roomId] || []), newMessage]
      }));
      setInputMessage('');
    }
  };

  const handleTyping = () => {
    if (selectedUser) {
      socket.emit('user_typing', { roomId: selectedUser.roomId, userId });
    }
  };

  const toggleVideoChat = () => setShowVideoChat(!showVideoChat);
  const toggleSidebar = () => setShowSidebar(!showSidebar);

  const userList = appointments.map(appointment => {
    const otherUser = userType === 'student' ? appointment.counselor : appointment.student;
    return {
      id: otherUser.email,
      name: otherUser.fullName,
      avatar: otherUser.profilePicture,
      isOnline: otherUser.isOnline,
      roomId: appointment.roomId
    };
  });

  return (
    <div className="flex h-screen bg-gray-100">
      <div className={`fixed inset-y-0 left-0 w-full sm:w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto transform ${showSidebar ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out sm:relative sm:translate-x-0 z-10`}>
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
            <img src={userAvatar || '/default-avatar.png'} alt={userName} className="w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">{userName}</h2>
            <p className="text-sm text-gray-600">{userType}</p>
          </div>
        </div>
        <h3 className="text-xl font-bold mb-4">Chats</h3>
        {userList.map(user => (
          <div 
            key={user.id} 
            className={`flex items-center p-3 mb-2 rounded-lg cursor-pointer ${selectedUser && selectedUser.id === user.id ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
            onClick={() => {
              setSelectedUser(user);
              if (window.innerWidth < 640) {
                setShowSidebar(false);
              }
              socket.emit('message_read', { roomId: user.roomId, userId });
            }}
          >
            <div className="relative">
              <img src={user.avatar || '/default-avatar.png'} alt={user.name} className="w-10 h-10 rounded-full" />
              <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${user.isOnline ? 'bg-green-500' : 'bg-gray-500'}`}></span>
            </div>
            <div className="ml-3 flex-1">
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-gray-600">{user.isOnline ? 'Online' : 'Offline'}</p>
            </div>
            {messages[user.roomId]?.length > 0 && lastRead[user.roomId] !== userId && (
              <div className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {messages[user.roomId].filter(msg => msg.sender.id !== userId && !msg.read).length}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex-1 flex flex-col">
        {selectedUser && (
          <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
            <div className="flex items-center">
              <button onClick={toggleSidebar} className="sm:hidden mr-4">
                <FiMenu size={24} />
              </button>
              <img src={selectedUser.avatar || '/default-avatar.png'} alt={selectedUser.name} className="w-10 h-10 rounded-full mr-3" />
              <div>
                <h2 className="text-lg font-semibold">{selectedUser.name}</h2>
                <p className="text-sm text-gray-600">{selectedUser.isOnline ? 'Online' : 'Offline'}</p>
              </div>
            </div>
            <button
              onClick={toggleVideoChat}
              className="bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {showVideoChat ? <FiMessageSquare size={20} /> : <FiVideo size={20} />}
            </button>
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
              <div className="flex-1 p-4 overflow-y-auto">
                {messages[selectedUser.roomId]?.map((msg, index) => (
                  <div key={index} className={`mb-4 flex ${msg.sender.id === userId ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex items-end ${msg.sender.id === userId ? 'flex-row-reverse' : 'flex-row'}`}>
                      <img src={msg.sender.avatar || '/default-avatar.png'} alt={msg.sender.name} className="w-8 h-8 rounded-full mx-2" />
                      <div className={`max-w-xs p-3 rounded-lg ${msg.sender.id === userId ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                        <p>{msg.message}</p>
                        <p className="text-xs mt-1 text-gray-500">
                          {new Date(msg.timestamp).toLocaleTimeString()}
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
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <div className="p-4 border-t border-gray-200">
                {isTyping[selectedUser.roomId] && (
                  <p className="text-sm text-gray-500 mb-2">{selectedUser.name} is typing...</p>
                )}
                <div className="flex items-center">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') sendMessage();
                      handleTyping();
                    }}
                    className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Type a message..."
                  />
                  <button
                    onClick={sendMessage}
                    className="bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <FiSend size={20} />
                  </button>
                </div>
              </div>
            </>
          )
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-xl text-gray-500">Select a user to start chatting</p>
          </div>
        )}
      </div>
      <Popover className="fixed bottom-4 right-4">
        {({ open }) => (
          <>
            <Popover.Button className="bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
              <FiInfo size={20} />
            </Popover.Button>
            <Transition
              show={open}
              enter="transition duration-100 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <Popover.Panel className="absolute bottom-full right-0 mb-2 w-80 max-h-60 overflow-y-auto bg-gray-800 text-white p-4 rounded-lg shadow-lg">
                <h3 className="font-bold mb-2">Logs:</h3>
                {logs.map((log, index) => (
                  <p key={index} className="text-sm mb-1">{log}</p>
                ))}
              </Popover.Panel>
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
  appointments: PropTypes.arrayOf(PropTypes.shape({
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
  })).isRequired,
  userInfo: PropTypes.object.isRequired,
};

export default CommunicationSystem;
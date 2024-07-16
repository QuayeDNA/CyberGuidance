import { useState, useEffect, useRef } from 'react';
import { FiMic, FiSend, FiMoreVertical, FiPhone, FiVideo, FiPaperclip, FiSmile, FiSearch, FiArrowLeft, FiTrash2, FiCheck, FiCheckCircle } from 'react-icons/fi';
import { BsCircleFill } from 'react-icons/bs';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import PropTypes from 'prop-types';

const mockUsers = [
  { id: 1, name: 'Alice Johnson', avatar: 'https://i.pravatar.cc/150?img=1', online: true, lastMessage: 'Hey, how are you?', lastSeen: null },
  { id: 2, name: 'Bob Smith', avatar: 'https://i.pravatar.cc/150?img=2', online: false, lastMessage: 'See you tomorrow!', lastSeen: '2023-04-10T10:30:00' },
  { id: 3, name: 'Charlie Brown', avatar: 'https://i.pravatar.cc/150?img=3', online: true, lastMessage: 'Thanks for the help!', lastSeen: null },
];

const initialMessages = [
  { id: 1, senderId: 1, text: 'Hey there!', timestamp: '10:00 AM', status: 'read' },
  { id: 2, senderId: 2, text: 'Hi! How are you?', timestamp: '10:02 AM', status: 'read' },
  { id: 3, senderId: 1, text: 'I am good. What about you?', timestamp: '10:04 AM', status: 'sent' },
];

const ChatComponent = () => {
  const [selectedUser, setSelectedUser] = useState(mockUsers[0]);
  const [messages, setMessages] = useState(initialMessages);
  const [inputMessage, setInputMessage] = useState('');
  const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);
  const [isMobileView, setIsMobileView] = useState(false);
  const [showChatList, setShowChatList] = useState(true);
  const [newMessageNotification, setNewMessageNotification] = useState({});

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    if (searchOpen) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);


  const filteredUsers = mockUsers.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );


  useEffect(() => {
    // Simulate other user typing
    const typingInterval = setInterval(() => {
      setIsOtherUserTyping(Math.random() > 0.7);
    }, 3000);

    return () => clearInterval(typingInterval);
  }, []);

  const handleSendMessage = () => {
    if (inputMessage.trim() !== '') {
      const newMessage = {
        id: messages.length + 1,
        senderId: 2,
        text: inputMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'sent'
      };
      setMessages([...messages, newMessage]);
      setInputMessage('');

      // Simulate message status updates
      setTimeout(() => updateMessageStatus(newMessage.id, 'delivered'), 1000);
      setTimeout(() => updateMessageStatus(newMessage.id, 'read'), 2000);
    }
  };

  const updateMessageStatus = (messageId, status) => {
    setMessages(prevMessages =>
      prevMessages.map(msg =>
        msg.id === messageId ? { ...msg, status } : msg
      )
    );
  };

  const handleDeleteMessage = (messageId) => {
    setMessages(prevMessages => prevMessages.filter(msg => msg.id !== messageId));
  };

  const loadMoreMessages = () => {
    // Simulate loading more messages
    const moreMessages = [
      { id: messages.length + 1, senderId: 1, text: 'This is an older message', timestamp: '09:55 AM', status: 'read' },
      { id: messages.length + 2, senderId: 2, text: 'And another old one', timestamp: '09:54 AM', status: 'read' },
    ];
    setMessages(prevMessages => [...moreMessages, ...prevMessages]);
  };

  const MessageStatus = ({ status }) => {
    switch (status) {
      case 'sent':
        return <FiCheck className="text-gray-400" />;
      case 'delivered':
        return <FiCheck className="text-blue-500" />;
      case 'read':
        return <FiCheckCircle className="text-blue-500" />;
      default:
        return null;
    }
  };

  MessageStatus.propTypes = {
    status: PropTypes.oneOf(['sent', 'delivered', 'read']),
  }

  const groupMessages = (msgs) => {
    return msgs.reduce((acc, msg, index) => {
      if (index === 0 || msg.senderId !== msgs[index - 1].senderId) {
        acc.push([msg]);
      } else {
        acc[acc.length - 1].push(msg);
      }
      return acc;
    }, []);
  };

  const handleEmojiSelect = (emoji) => {
    setInputMessage(inputMessage + emoji.native);
    setShowEmojiPicker(false);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      // In a real app, you'd upload the file to a server here
    }
  };

  const sendFileMessage = () => {
    if (selectedFile) {
      const newMessage = {
        id: messages.length + 1,
        senderId: 2,
        text: `Sent a file: ${selectedFile.name}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        file: URL.createObjectURL(selectedFile),
      };
      setMessages([...messages, newMessage]);
      setSelectedFile(null);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setNewMessageNotification(prev => ({ ...prev, [user.id]: false }));
    if (isMobileView) {
      setShowChatList(false);
    }
  };

  const TypingAnimation = () => (
    <div className="flex space-x-2 p-2 bg-gray-100 rounded-lg">
      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
    </div>
  );

  return (
    <div className="flex h-[calc(100vh-150px)] bg-gray-100 w-[calc(100vw-100px)]"> {/* Change w-50 to w-full */}
      {/* Chat List */}
      {(!isMobileView || (isMobileView && showChatList)) && (
        <div className={`${isMobileView ? 'w-full' : 'w-1/4'} bg-white border-r border-gray-200 overflow-y-auto`}>
          <div className="p-2 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className={`text-xl font-semibold transition-opacity duration-300 ${searchOpen ? 'opacity-0' : 'opacity-100'}`}>
                Chats
              </h2>
              <div className="relative flex items-center">
                <div
                  className={`flex items-center overflow-hidden transition-all duration-300 ease-in-out ${searchOpen ? 'w-full' : 'w-8'
                    }`}
                >
                  <input
                    ref={searchInputRef}
                    type="text"
                    className={`w-full h-9 p-2 pr-8 border border-gray-300 rounded-full focus:outline-none transition-all duration-300 ${searchOpen ? 'opacity-100' : 'opacity-0'
                      }`}
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onBlur={() => {
                      if (!searchQuery) {
                        setSearchOpen(false);
                      }
                    }}
                  />
                  <FiSearch
                    className={`w-6 h-6 text-gray-500 cursor-pointer absolute right-2 transition-all duration-300 ${searchOpen ? 'opacity-50' : 'opacity-100'
                      }`}
                    onClick={() => {
                      setSearchOpen(!searchOpen);
                      if (!searchOpen) {
                        setTimeout(() => searchInputRef.current.focus(), 300);
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {filteredUsers.map((user) => (
            <button
              key={user.id}
              className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 w-full ${selectedUser.id === user.id ? 'bg-blue-50' : ''
                }`}
              onClick={() => handleSelectUser(user)}
            >
              <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full mr-4" />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">{user.name}</h3>
                  <p className="text-xs">
                    <BsCircleFill className={`w-3 h-3 ${user.online ? 'text-green-500' : 'text-gray-300'}`} />
                  </p>

                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500 truncate">{user.lastMessage}</p>
                  {newMessageNotification[user.id] && (
                    <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1">New</span>
                  )}
                </div>
              </div>
            </button>
          ))}

        </div>
      )}
      {(!isMobileView || (isMobileView && !showChatList)) && (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
            {isMobileView && (
              <button className="mr-2" onClick={() => setShowChatList(true)}>
                <FiArrowLeft className="w-6 h-6" />
              </button>
            )}
            <div className="flex items-center">
              <img src={selectedUser.avatar} alt={selectedUser.name} className="w-10 h-10 rounded-full mr-4" />
              <div>
                <h2 className="font-semibold">{selectedUser.name}</h2>
                <p className="text-sm text-gray-500">
                  {selectedUser.online ? 'Online' : `Last seen ${new Date(selectedUser.lastSeen).toLocaleString()}`}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <FiPhone className="w-6 h-6 text-gray-500 cursor-pointer" />
              <FiVideo className="w-6 h-6 text-gray-500 cursor-pointer" />
              <FiMoreVertical className="w-6 h-6 text-gray-500 cursor-pointer" />
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <button onClick={loadMoreMessages} className="w-full text-center text-blue-500 hover:underline">
              Load more messages
            </button>
            {groupMessages(messages).map((group, groupIndex) => (
              <div key={groupIndex} className={`flex ${group[0].senderId === 2 ? 'justify-end' : 'justify-start'}`}>
                {group[0].senderId !== 2 && (
                  <img src={selectedUser.avatar} alt={selectedUser.name} className="w-8 h-8 rounded-full mr-2 self-end" />
                )}
                <div className="flex flex-col space-y-2">
                  {group.map((message) => (
                    <div
                      key={message.id}
                      className={`max-w-xs p-3 rounded-lg ${message.senderId === 2 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                      <p>{message.text}</p>
                      {message.file && (
                        <a href={message.file} target="_blank" rel="noopener noreferrer" className="text-sm underline">
                          View File
                        </a>
                      )}
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-xs opacity-75">{message.timestamp}</p>
                        {message.senderId === 2 && <MessageStatus status={message.status} />}
                      </div>
                      {message.senderId === 2 && (
                        <button
                          onClick={() => handleDeleteMessage(message.id)}
                          className="text-xs text-white hover:underline mt-1"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {group[0].senderId === 2 && (
                  <img src="https://i.pravatar.cc/150?img=2" alt="You" className="w-8 h-8 rounded-full ml-2 self-end" />
                )}
              </div>
            ))}
            {isOtherUserTyping && (
              <div className="flex justify-start">
                <img src={selectedUser.avatar} alt={selectedUser.name} className="w-8 h-8 rounded-full mr-2 self-end" />
                <TypingAnimation />
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="bg-white border-t border-gray-200 p-4">
            <div className="flex items-center space-x-2">
              <FiMic className="w-6 h-6 text-gray-500 cursor-pointer" />
              <div className="relative flex-1">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => {
                    setInputMessage(e.target.value);
                  }}
                  placeholder="Type a message..."
                  className="w-full p-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                  <FiSmile
                    className="w-6 h-6 text-gray-500 cursor-pointer"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  />
                  <FiPaperclip
                    className="w-6 h-6 text-gray-500 cursor-pointer"
                    onClick={() => fileInputRef.current.click()}
                  />
                </div>
                {showEmojiPicker && (
                  <div className="absolute bottom-full right-0 mb-2">
                    <Picker data={data} onEmojiSelect={handleEmojiSelect} />
                  </div>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={selectedFile ? sendFileMessage : handleSendMessage}
                className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <FiSend className="w-5 h-5" />
              </button>
            </div>
            {selectedFile && (
              <p className="text-sm text-gray-500 mt-2">
                File selected: {selectedFile.name}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};



export default ChatComponent;
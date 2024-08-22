// ChatComponent.jsx
import { useState, useEffect } from 'react';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import { mockUsers, initialMessages } from './mockData';
import ChatSocket from '../comms/ChatSocket';

const ChatComponent = () => {
  const [selectedUser, setSelectedUser] = useState(mockUsers[0]);
  const [messages, setMessages] = useState(initialMessages);
  const [isMobileView, setIsMobileView] = useState(false);
  const [showChatList, setShowChatList] = useState(true);
  const [chatSocket, setChatSocket] = useState(null);

  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const socket = new ChatSocket();
    setChatSocket(socket);
    socket.joinRoom(2, selectedUser.id); // Replace 2 with your user id and selectedUser.id with the counselor's id
    socket.onMessage((message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
    return () => {
      socket.disconnect();
    };
  }, [selectedUser.id]);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    if (isMobileView) setShowChatList(false);
    chatSocket?.joinRoom(2, user.id); // Replace 2 with your user id and user.id with the counselor's id
  };

  const handleSendMessage = (newMessage) => {
    chatSocket?.sendMessage(newMessage);
    setMessages([...messages, newMessage]);
  };

  return (
    <div className="flex h-screen bg-gray-100 w-screen px-4">
      {(!isMobileView || showChatList) && (
        <ChatList
          users={mockUsers}
          selectedUser={selectedUser}
          onSelectUser={handleSelectUser}
          isMobileView={isMobileView}
        />
      )}
      {(!isMobileView || !showChatList) && (
        <ChatWindow
          selectedUser={selectedUser}
          messages={messages}
          onSendMessage={handleSendMessage}
          isMobileView={isMobileView}
          onBackToList={() => setShowChatList(true)}
        />
      )}
    </div>
  );
};

export default ChatComponent;

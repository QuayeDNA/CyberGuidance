// ChatComponent.jsx
import { useState, useEffect } from 'react';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import { mockUsers, initialMessages } from './mockData';

const ChatComponent = () => {
  const [selectedUser, setSelectedUser] = useState(mockUsers[0]);
  const [messages, setMessages] = useState(initialMessages);
  const [isMobileView, setIsMobileView] = useState(false);
  const [showChatList, setShowChatList] = useState(true);

  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    if (isMobileView) setShowChatList(false);
  };

  const handleSendMessage = (newMessage) => {
    setMessages([...messages, newMessage]);
  };

  return (
    <div className="flex h-screen bg-gray-100">
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

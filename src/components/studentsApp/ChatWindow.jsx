import { useRef, useEffect, useState } from 'react';
import { FiArrowLeft, FiSend } from 'react-icons/fi';
import MessageList from './MessageList';
import PropTypes from 'prop-types';

const ChatWindow = ({ selectedUser, messages, onSendMessage, isMobileView, onBackToList }) => {
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = () => {
    if (inputMessage.trim() !== '') {
      onSendMessage({
        text: inputMessage,
        senderId: JSON.parse(localStorage.getItem('userData')).id,
        timestamp: new Date().toISOString(),
      });
      setInputMessage('');
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-gray-50">
      <div className="bg-white border-b border-gray-200 p-4 flex items-center">
        {isMobileView && (
          <button className="mr-4" onClick={onBackToList}>
            <FiArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
        )}
        <img 
          src={selectedUser.avatarUrl || 'https://via.placeholder.com/40'} 
          alt={selectedUser.fullName} 
          className="w-10 h-10 rounded-full mr-3 object-cover"
        />
        <div>
          <h2 className="font-semibold text-lg text-gray-800">{selectedUser.fullName}</h2>
          <p className="text-sm text-gray-500">{selectedUser.specialization || 'Counselor'}</p>
        </div>
      </div>
      <MessageList messages={messages} currentUserId={JSON.parse(localStorage.getItem('userData')).id} />
      <div ref={messagesEndRef} />
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <FiSend className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

ChatWindow.propTypes = {
  selectedUser: PropTypes.object.isRequired,
  messages: PropTypes.array.isRequired,
  onSendMessage: PropTypes.func.isRequired,
  isMobileView: PropTypes.bool.isRequired,
  onBackToList: PropTypes.func.isRequired,
};

export default ChatWindow;
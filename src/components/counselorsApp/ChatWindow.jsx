// ChatWindow.jsx
import { FiArrowLeft, FiPhone, FiVideo, FiMoreVertical } from 'react-icons/fi';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import PropTypes from 'prop-types';

const ChatWindow = ({ selectedUser, messages, onSendMessage, isMobileView, onBackToList }) => (
  <div className="flex-1 flex flex-col">
    <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
      {isMobileView && (
        <button className="mr-2" onClick={onBackToList}>
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
    <MessageList messages={messages} selectedUser={selectedUser} />
    <MessageInput onSendMessage={onSendMessage} />
  </div>
);

ChatWindow.propTypes = {
  selectedUser: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired,
    online: PropTypes.bool.isRequired,
    lastSeen: PropTypes.string.isRequired,
  }).isRequired,
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      sender: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      time: PropTypes.string.isRequired,
    })
  ).isRequired,
  onSendMessage: PropTypes.func.isRequired,
  isMobileView: PropTypes.bool.isRequired,
  onBackToList: PropTypes.func.isRequired,
};

export default ChatWindow;
// Message.jsx
import { FiCheck, FiCheckCircle } from 'react-icons/fi';
import PropTypes from 'prop-types';

const Message = ({ message, isOwnMessage, selectedUser }) => {
  const formattedTimestamp = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      {!isOwnMessage && (
        <img src={selectedUser.avatar} alt={selectedUser.name} className="w-8 h-8 rounded-full mr-2 self-end" />
      )}
      <div className={`max-w-xs p-3 rounded-lg ${isOwnMessage ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
        <p>{message.text}</p>
        <div className="flex justify-between items-center mt-1">
          <p className="text-xs opacity-75">{formattedTimestamp}</p>
          {isOwnMessage && (
            message.status === 'read' ? <FiCheckCircle className="text-blue-200" /> : <FiCheck className="text-blue-200" />
          )}
        </div>
      </div>
    </div>
  );
};

Message.propTypes = {
  message: PropTypes.shape({
    senderId: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    timestamp: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
  isOwnMessage: PropTypes.bool.isRequired,
  selectedUser: PropTypes.object.isRequired,
};

export default Message;
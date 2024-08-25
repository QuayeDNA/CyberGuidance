import PropTypes from 'prop-types';
import Message from './Message';

const MessageList = ({ messages, currentUserId }) => (
  <div className="flex-1 overflow-y-auto p-4 space-y-4">
    {messages.map((message, index) => (
      <Message 
        key={message.id || index} 
        message={message} 
        isOwnMessage={message.senderId === currentUserId}
      />
    ))}
  </div>
);

MessageList.propTypes = {
  messages: PropTypes.array.isRequired,
  currentUserId: PropTypes.string.isRequired,
};

export default MessageList;
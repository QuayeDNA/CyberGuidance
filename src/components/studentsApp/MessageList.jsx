// MessageList.jsx
import PropTypes from 'prop-types';
import Message from './Message';

const MessageList = ({ messages, selectedUser }) => (
  <div className="flex-1 overflow-y-auto p-4 space-y-4">
    {messages.map((message) => (
      <Message key={message.id} message={message} isOwnMessage={message.senderId === 2} selectedUser={selectedUser} />
    ))}
  </div>
);

MessageList.propTypes = {
  messages: PropTypes.array.isRequired,
  selectedUser: PropTypes.object.isRequired,
};

export default MessageList;
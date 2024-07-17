// ChatList.jsx
import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import UserListItem from './UserListItem';
import PropTypes from 'prop-types';

const ChatList = ({ users, selectedUser, onSelectUser, isMobileView }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`${isMobileView ? 'w-full' : 'w-2/8'} bg-white border-r border-gray-200 overflow-y-auto`}>
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <input
            type="text"
            className="w-full p-2 pl-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>
      {filteredUsers.map((user) => (
        <UserListItem
          key={user.id}
          user={user}
          isSelected={selectedUser.id === user.id}
          onSelect={() => onSelectUser(user)}
        />
      ))}
    </div>
  );
};

ChatList.propTypes = {
  users: PropTypes.array.isRequired,
  selectedUser: PropTypes.object.isRequired,
  onSelectUser: PropTypes.func.isRequired,
  isMobileView: PropTypes.bool.isRequired,
};

export default ChatList;

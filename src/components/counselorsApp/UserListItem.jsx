// UserListItem.jsx
import { BsCircleFill } from 'react-icons/bs';
import PropTypes from 'prop-types';

const UserListItem = ({ user, isSelected, onSelect }) => (
  <button
    className={`flex items-center p-4 w-full hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''}`}
    onClick={onSelect}
  >
    <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full mr-4" />
    <div className="flex-1 text-left">
      <h3 className="font-semibold">{user.name}</h3>
      <p className="text-sm text-gray-500 truncate">{user.lastMessage}</p>
    </div>
    <BsCircleFill className={`w-3 h-3 ${user.online ? 'text-green-500' : 'text-gray-300'}`} />
  </button>
);

UserListItem.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired,
    lastMessage: PropTypes.string.isRequired,
    online: PropTypes.bool.isRequired,
  }).isRequired,
  isSelected: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default UserListItem;
import PropTypes from 'prop-types';

const UserListItem = ({ user, isSelected, onSelect }) => {
  // Simple hash function to generate a number from a string
  const hashCode = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  };

  // Generate a unique number for the counselor's ID
  const uniqueNumber = user.id ? hashCode(user.id) : 0;

  // Use the unique number to generate a Picsum Photos URL
  const avatarUrl = user.avatarUrl || `https://picsum.photos/seed/${uniqueNumber}/200`;

  return (
    <button
      className={`flex items-center p-4 w-full hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''}`}
      onClick={onSelect}
    >
      <img src={avatarUrl} alt={user.fullName} className="w-12 h-12 rounded-full mr-4" />
      <div className="flex-1 text-left">
        <h3 className="font-semibold">{user.fullName}</h3>
        <p className="text-sm text-gray-500 truncate">{user.specialization || 'Counselor'}</p>
      </div>
    </button>
  );
};

UserListItem.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    fullName: PropTypes.string.isRequired,
    avatarUrl: PropTypes.string,
    specialization: PropTypes.string,
  }).isRequired,
  isSelected: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default UserListItem;
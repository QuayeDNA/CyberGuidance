import PropTypes from 'prop-types';

const UserTable = ({ users, onSort, sortField, sortDirection, onViewUser, onDeleteUser, error }) => {
  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (users.length === 0) {
    return <div className="text-gray-500">No users found.</div>;
  }

  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          {['username', 'email', 'role'].map((field) => (
            <th
              key={field}
              onClick={() => onSort(field)}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
            >
              {field.charAt(0).toUpperCase() + field.slice(1)}
              {sortField === field && (sortDirection === 'asc' ? ' ↑' : ' ↓')}
            </th>
          ))}
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {users.map((user) => (
          <tr key={user._id}>
            <td className="px-6 py-4 whitespace-nowrap">{user.username}</td>
            <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
            <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button
                onClick={() => onViewUser(user._id)}
                className="text-indigo-600 hover:text-indigo-900 mr-2"
              >
                View
              </button>
              <button
                onClick={() => onDeleteUser(user)}
                className="text-red-600 hover:text-red-900"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

UserTable.propTypes = {
  users: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
  })).isRequired,
  onSort: PropTypes.func.isRequired,
  sortField: PropTypes.string.isRequired,
  sortDirection: PropTypes.oneOf(['asc', 'desc']).isRequired,
  onViewUser: PropTypes.func.isRequired,
  onDeleteUser: PropTypes.func.isRequired,
  error: PropTypes.string,
};

export default UserTable;
import PropTypes from 'prop-types';

const CounselorTable = ({ counselors, onSort, sortField, sortDirection, onViewUser, onDeleteUser, error }) => {
  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (counselors.length === 0) {
    return <div className="text-gray-500">No counselors found.</div>;
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
        {counselors.map((counselor) => (
          <tr key={counselor._id}>
            <td className="px-6 py-4 whitespace-nowrap">{counselor.username}</td>
            <td className="px-6 py-4 whitespace-nowrap">{counselor.email}</td>
            <td className="px-6 py-4 whitespace-nowrap">{counselor.role}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button
                onClick={() => onViewUser(counselor._id)}
                className="text-indigo-600 hover:text-indigo-900 mr-2"
              >
                View
              </button>
              <button
                onClick={() => onDeleteUser(counselor)}
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

CounselorTable.propTypes = {
  counselors: PropTypes.arrayOf(PropTypes.shape({
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

export default CounselorTable;
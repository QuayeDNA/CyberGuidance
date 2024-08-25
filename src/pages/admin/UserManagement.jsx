import { useState, useEffect } from 'react';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { fetchAllUsers, fetchUserById, deleteUserById } from '../../axiosServices/userDataServices';
import { signupUser } from '../../axiosServices/authServices';
import PropTypes from 'prop-types';
import { FaSpinner, FaTimes } from 'react-icons/fa';

import CreateCounselorModal from './components/CreateCounselorModal';
import UserTable from './components/UserTable';
import CounselorTable from './components/CounselorTable';
import DeleteUserModal from './components/DeleteModal';
import ViewUserModal from './components/ViewUserModal';

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]); // Initialize with an empty array
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [newCounselor, setNewCounselor] = useState({ username: '', email: '', password: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm, sortField, sortDirection]);

   const fetchUsers = async () => {
    setIsLoading(true);
    try {
      console.log('Fetching users...');
      const response = await fetchAllUsers(currentPage, searchTerm, sortField, sortDirection);
      console.log('Full response:', response); // Inspect the full response
      setUsers(response || []); // Directly set the response as users
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  const handleCreateCounselor = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      console.log('Creating counselor with data:', newCounselor);
      await signupUser(newCounselor, 'counselor');
      setIsCreateModalOpen(false);
      setNewCounselor({ username: '', email: '', password: '' });
      fetchUsers();
    } catch (err) {
      console.error('Error creating counselor:', err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    setIsLoading(true);
    try {
      await deleteUserById(selectedUser._id); // Use _id instead of id
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

   const handleViewUser = async (userId) => {
    setIsLoading(true);
    try {
      const user = await fetchUserById(userId);
      console.log('Fetched user:', user); // Log the fetched user
      setSelectedUser(user);
      setIsViewModalOpen(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin User Management</h1>

      <TabGroup>
        <TabList className="flex p-1 space-x-1 bg-blue-900/20 rounded-xl mb-4">
          <Tab className={({ selected }) =>
            `w-full py-2.5 text-sm font-medium text-blue-700 rounded-lg
             ${selected ? 'bg-white shadow' : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'}`
          }>
            All Users
          </Tab>
          <Tab className={({ selected }) =>
            `w-full py-2.5 text-sm font-medium text-blue-700 rounded-lg
             ${selected ? 'bg-white shadow' : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'}`
          }>
            Counselors
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <UserTable
              users={users}
              onSort={handleSort}
              sortField={sortField}
              sortDirection={sortDirection}
              onViewUser={handleViewUser}
              onDeleteUser={(user) => {
                setSelectedUser(user);
                setIsDeleteModalOpen(true);
              }}
              error={error}
            />
          </TabPanel>
          <TabPanel>
            <CounselorTable
              counselors={Array.isArray(users) ? users.filter(user => user.role === 'counselor') : []}
              onSort={handleSort}
              sortField={sortField}
              sortDirection={sortDirection}
              onViewUser={handleViewUser}
              onDeleteUser={(user) => {
                setSelectedUser(user);
                setIsDeleteModalOpen(true);
              }}
              error={error}
            />
          </TabPanel>
        </TabPanels>
      </TabGroup>
      <button
        onClick={() => setIsCreateModalOpen(true)}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Create New Counselor
      </button>

      <CreateCounselorModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateCounselor}
        newCounselor={newCounselor}
        setNewCounselor={setNewCounselor}
      />

      <DeleteUserModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={handleDeleteUser}
        user={selectedUser}
      />

      <ViewUserModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        user={selectedUser}
      />

      {isLoading && <LoadingIndicator />}
      {error && <ErrorMessage message={error} onClose={() => setError(null)} />}
    </div>
  );
};

const LoadingIndicator = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
    <FaSpinner className="animate-spin text-blue-500" size={64} />
  </div>
);

const ErrorMessage = ({ message, onClose }) => (
  <div className="bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
    <strong className="font-bold">Error!</strong>
    <span className="block sm:inline"> {message}</span>
    <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={onClose}>
      <FaTimes className="fill-current h-6 w-6 text-red-500" role="button" />
    </span>
  </div>
);

ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AdminUserManagement;
import { useState, useEffect } from 'react';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { fetchAllUsers, fetchUserById, deleteUserById } from '../../axiosServices/userDataServices';
import { signupUser } from '../../axiosServices/authServices';
import PropTypes from 'prop-types';
import { FaSpinner, FaTimes, FaSearch } from 'react-icons/fa';

import CreateCounselorModal from './components/CreateCounselorModal';
import UserTable from './components/UserTable';
import CounselorTable from './components/CounselorTable';
import DeleteUserModal from './components/DeleteModal';
import ViewUserModal from './components/ViewUserModal';
import StudentTable from './components/StudentTable';

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
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
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(user => 
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [users, searchTerm]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetchAllUsers();
      setUsers(response || []);
      setFilteredUsers(response || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCounselor = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signupUser(newCounselor, 'counselor');
      setIsCreateModalOpen(false);
      setNewCounselor({ username: '', email: '', password: '' });
      fetchUsers();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    setIsLoading(true);
    try {
      await deleteUserById(selectedUser._id);
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

    const sortedUsers = [...filteredUsers].sort((a, b) => {
      if (a[field] < b[field]) return sortDirection === 'asc' ? -1 : 1;
      if (a[field] > b[field]) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredUsers(sortedUsers);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin User Management</h1>
      <div className="flex items-center justify-between py-4">
      <button
        onClick={() => setIsCreateModalOpen(true)}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Create New Counselor
      </button>
      <div className="mb-4 flex items-center">
        <FaSearch className="mr-2 text-gray-500" />
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded py-2 px-3 w-full"
        />
      </div>
      </div>

      <TabGroup>
        <TabList className="flex p-1 space-x-1 bg-blue-900/20 rounded-xl mb-4">
          {['All Users', 'Students', 'Counselors'].map((tab) => (
            <Tab
              key={tab}
              className={({ selected }) =>
                `w-full py-2.5 text-sm font-medium text-blue-700 rounded-lg
                 ${selected ? 'bg-white shadow' : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'}`
              }
            >
              {tab}
            </Tab>
          ))}
        </TabList>
        <TabPanels>
          <TabPanel>
            <UserTable
              users={currentItems}
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
            <StudentTable
              students={currentItems.filter(user => user.role === 'student')}
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
              counselors={currentItems.filter(user => user.role === 'counselor')}
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

      <Pagination
        itemsPerPage={itemsPerPage}
        totalItems={filteredUsers.length}
        paginate={paginate}
        currentPage={currentPage}
      />

    

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
  <div className="bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative shadow-lg" role="alert">
    <strong className="font-bold">Error!</strong>
    <span className="block sm:inline"> {message}</span>
    <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={onClose}>
      <FaTimes className="fill-current h-6 w-6 text-red-500 cursor-pointer" role="button" />
    </span>
  </div>
);

const Pagination = ({ itemsPerPage, totalItems, paginate, currentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="flex justify-center mt-4">
        {pageNumbers.map(number => (
          <li key={number} className="mx-1">
            <button
              onClick={() => paginate(number)}
              className={`px-3 py-1 rounded ${currentPage === number ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

Pagination.propTypes = {
  itemsPerPage: PropTypes.number.isRequired,
  totalItems: PropTypes.number.isRequired,
  paginate: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
};

export default AdminUserManagement;
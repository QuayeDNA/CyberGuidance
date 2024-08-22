import { useState, useEffect, Fragment } from "react";
import { motion } from "framer-motion";
import { FaSearch, FaEdit, FaTrash, FaUserPlus, FaInfoCircle } from "react-icons/fa";
import { signupUser } from "../../axiosServices/authServices";
import { getAllCounselors, getUserInfo } from "../../axiosServices/userDataServices";
import { Dialog, Transition, TransitionChild, DialogTitle } from "@headlessui/react";

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "Counselor",
    password: "",
  });
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isUserDetailsOpen, setIsUserDetailsOpen] = useState(false);

  useEffect(() => {
    const fetchCounselors = async () => {
      setLoading(true);
      try {
        const counselors = await getAllCounselors();
        setUsers(counselors);
      } catch (error) {
        setError(error.message || "Failed to fetch counselors.");
      } finally {
        setLoading(false);
      }
    };

    fetchCounselors();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await signupUser(
        {
          username: newUser.name,
          email: newUser.email,
          password: newUser.password,
        },
        "counselor"
      );

      setUsers([
        ...users,
        {
          id: response.id,
          name: newUser.name,
          email: newUser.email,
          role: "Counselor",
        },
      ]);
      setNewUser({ name: "", email: "", role: "Counselor", password: "" });
      setIsAddingUser(false);
      setMessage(response.message || "Counselor created successfully.");
    } catch (error) {
      setError(error.message || "Failed to create counselor.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setNewUser({ ...user, password: "" });
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    // Implement similar API call for updating user details if needed
    setEditingUser(null);
    setNewUser({ name: "", email: "", role: "Counselor", password: "" });
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter((u) => u.id !== id));
      // Here you would typically make an API call to delete the user from your backend
    }
  };

  const handleViewUserDetails = async (userId) => {
    setLoading(true);
    try {
      const user = await getUserInfo(userId);
      setSelectedUser(user);
      setIsUserDetailsOpen(true);
    } catch (error) {
      setError(error.message || "Failed to fetch user details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center">User Management</h2>

      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {message}
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-4 flex justify-between items-center">
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
        <button
          onClick={() => setIsAddingUser(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-300 flex items-center">
          <FaUserPlus className="mr-2" />
          Add Counselor
        </button>
      </div>

      {(isAddingUser || editingUser) && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">
            {editingUser ? "Edit User" : "Add New Counselor"}
          </h3>
          <form onSubmit={editingUser ? handleUpdateUser : handleAddUser}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Name"
                className="w-full p-2 border rounded"
                value={newUser.name}
                onChange={(e) =>
                  setNewUser({ ...newUser, name: e.target.value })
                }
                required
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full p-2 border rounded"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
                required
              />
              <select
                className="w-full p-2 border rounded"
                value={newUser.role}
                onChange={(e) =>
                  setNewUser({ ...newUser, role: e.target.value })
                }
                required>
                <option value="Counselor">Counselor</option>
                <option value="Admin">Admin</option>
              </select>
              <input
                type="password"
                placeholder="Password"
                className="w-full p-2 border rounded"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
                required={!editingUser}
              />
            </div>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setIsAddingUser(false);
                  setEditingUser(null);
                }}
                className="mr-2 px-4 py-2 border rounded text-gray-600 hover:bg-gray-100">
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                disabled={loading}>
                {editingUser ? "Update" : "Add"}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleEditUser(user)}
                    className="text-indigo-600 hover:text-indigo-900 mr-2">
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="text-red-600 hover:text-red-900 mr-2">
                    <FaTrash />
                  </button>
                  <button
                    onClick={() => handleViewUserDetails(user.id)}
                    className="text-blue-600 hover:text-blue-900">
                    <FaInfoCircle />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Transition appear show={isUserDetailsOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setIsUserDetailsOpen(false)}
        >
          <div className="min-h-screen px-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
            </TransitionChild>

            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <DialogTitle
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  User Details
                </DialogTitle>
                <div className="mt-2">
                  {selectedUser && (
                    <div>
                      <p><strong>Name:</strong> {selectedUser.name}</p>
                      <p><strong>Email:</strong> {selectedUser.email}</p>
                      <p><strong>Role:</strong> {selectedUser.role}</p>
                      {/* Add more user details here if needed */}
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                    onClick={() => setIsUserDetailsOpen(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>
    </motion.div>
  );
};

export default UserManagement;
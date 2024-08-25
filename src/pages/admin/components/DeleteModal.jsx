import PropTypes from "prop-types";
import { useState } from "react";
import { Dialog, DialogTitle } from "@headlessui/react";

const DeleteUserModal = ({ isOpen, onClose, onDelete, user }) => {
  const [statusMessage, setStatusMessage] = useState("");

  const handleDelete = async () => {
    try {
      await onDelete();
      setStatusMessage("User deleted successfully.");
    } catch (error) {
      setStatusMessage("Failed to delete user. Please try again.");
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-10 overflow-y-auto">
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto bg-black bg-opacity-50">
        <div className="min-h-screen px-4 text-center">
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true">
            &#8203;
          </span>

          <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
            <DialogTitle
              as="h3"
              className="text-lg font-medium leading-6 text-gray-900">
              Confirm Deletion
            </DialogTitle>
            <p className="mt-2 text-sm text-gray-500">
              Are you sure you want to delete {user?.username}? This action
              cannot be undone.
            </p>
            {statusMessage && (
              <p
                className={`mt-2 text-sm ${
                  statusMessage.includes("successfully")
                    ? "text-green-500"
                    : "text-red-500"
                }`}>
                {statusMessage}
              </p>
            )}
            <div className="mt-4">
              <button
                type="button"
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
                onClick={handleDelete}>
                Delete
              </button>
              <button
                type="button"
                className="ml-3 inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                onClick={onClose}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

DeleteUserModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  user: PropTypes.shape({
    username: PropTypes.string, // Ensure this matches the property used in the modal
  }),
};

DeleteUserModal.defaultProps = {
  user: null,
};

export default DeleteUserModal;

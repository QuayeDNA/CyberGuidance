import PropTypes from 'prop-types';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';

const CreateCounselorModal = ({ isOpen, onClose, onSubmit, newCounselor, setNewCounselor }) => {
  return (
    <Dialog open={isOpen} as="div" className="relative z-10 focus:outline-none" onClose={onClose}>
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto bg-black bg-opacity-50">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            transition
            className="w-full max-w-md rounded-xl bg-white p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0">
            <DialogTitle as="h3" className="text-base font-medium text-black">
              Create New Counselor
            </DialogTitle>
            <form onSubmit={onSubmit} className="mt-4">
              <input
                type="text"
                placeholder="Username"
                value={newCounselor.username}
                onChange={(e) => setNewCounselor({ ...newCounselor, username: e.target.value })}
                className="w-full px-3 py-2 border rounded-md mb-3"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={newCounselor.email}
                onChange={(e) => setNewCounselor({ ...newCounselor, email: e.target.value })}
                className="w-full px-3 py-2 border rounded-md mb-3"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={newCounselor.password}
                onChange={(e) => setNewCounselor({ ...newCounselor, password: e.target.value })}
                className="w-full px-3 py-2 border rounded-md mb-3"
                required
              />
              <button type="submit" className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Create Counselor
              </button>
            </form>
            <div className="mt-4">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-gray-700"
                onClick={onClose}>
                Close
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

CreateCounselorModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  newCounselor: PropTypes.shape({
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
  }).isRequired,
  setNewCounselor: PropTypes.func.isRequired,
};

export default CreateCounselorModal;
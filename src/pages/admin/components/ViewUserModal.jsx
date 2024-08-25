import PropTypes from "prop-types";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useEffect, useState } from "react";

const ViewUserModal = ({ isOpen, onClose, user }) => {
  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setShowModal(true);
    } else {
      setTimeout(() => setShowModal(false), 300);
    }
  }, [isOpen]);

  if (!showModal) return null;

  const renderPersonalInfo = () => {
    if (user.personalInfo?.bio) {
      // User is a counselor
      return (
        <>
          <p className="text-sm">Full Name: {user.personalInfo?.fullName}</p>
          <p className="text-sm">Department: {user.personalInfo?.department}</p>
          <p className="text-sm">
            Mobile Number: {user.personalInfo?.mobileNumber}
          </p>
          <p className="text-sm">Bio: {user.personalInfo?.bio}</p>
          {/* Add more counselor-specific information here */}
        </>
      );
    } else if (user.personalInfo) {
      // User is a student
      return (
        <>
          <p className="text-sm">Full Name: {user.personalInfo?.fullName}</p>
          <p className="text-sm">
            ID Card Number: {user.personalInfo?.idCardNumber}
          </p>
          <p className="text-sm">
            Year of Study: {user.personalInfo?.yearOfStudy}
          </p>
          <p className="text-sm">Faculty: {user.personalInfo?.faculty}</p>
          <p className="text-sm">Religion: {user.personalInfo?.religion}</p>
          <p className="text-sm">Gender: {user.personalInfo?.gender}</p>
          <p className="text-sm">Age: {user.personalInfo?.age}</p>
          <p className="text-sm">
            Program of Study: {user.personalInfo?.programOfStudy}
          </p>
          <p className="text-sm">Department: {user.personalInfo?.department}</p>
          <p className="text-sm">
            Hall of Residence: {user.personalInfo?.hallOfResidence}
          </p>
          <p className="text-sm">
            Marital Status: {user.personalInfo?.maritalStatus}
          </p>
          <p className="text-sm">
            Mobile Number: {user.personalInfo?.mobileNumber}
          </p>
          {/* Add more student-specific information here */}
        </>
      );
    } else {
      // User has not set up their personal information
      return (
        <p className="text-sm bg-yellow-100 text-yellow-800 p-4 border rounded-md mt-4 border-l-8 border-yellow-400">
          The user has not set up their personal information.
        </p>
      );
    }
  };
  return (
    <Dialog
      open={isOpen}
      as="div"
      className="relative z-10 focus:outline-none"
      onClose={onClose}>
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto bg-black bg-opacity-50">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            transition
            className="w-full max-w-md rounded-xl bg-white p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0">
            <DialogTitle as="h3" className="text-base font-medium text-black">
              User Information
            </DialogTitle>
            {user && (
              <div className="mt-2 text-black">
                <p className="text-sm">Name: {user.personalInfo?.fullName}</p>
                <p className="text-sm">Email: {user.email}</p>
                <p className="text-sm">Username: {user.username}</p>
                <p className="text-sm">ID: {user._id}</p>
                {renderPersonalInfo()}
                {user.areaOfInterest && user.areaOfInterest.length > 0 && (
                  <p className="text-sm">
                    Area of Interest: {user.areaOfInterest.join(", ")}
                  </p>
                )}
                {user.isAdmin !== undefined && (
                  <p className="text-sm">
                    Admin: {user.isAdmin ? "Yes" : "No"}
                  </p>
                )}
              </div>
            )}
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

ViewUserModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  user: PropTypes.shape({
    email: PropTypes.string,
    username: PropTypes.string,
    _id: PropTypes.string,
    areaOfInterest: PropTypes.arrayOf(PropTypes.string),
    isAdmin: PropTypes.bool,
    personalInfo: PropTypes.shape({
      age: PropTypes.number,
      department: PropTypes.string,
      faculty: PropTypes.string,
      fullName: PropTypes.string,
      gender: PropTypes.string,
      hallOfResidence: PropTypes.string,
      idCardNumber: PropTypes.string,
      maritalStatus: PropTypes.string,
      mobileNumber: PropTypes.string,
      programOfStudy: PropTypes.string,
      religion: PropTypes.string,
      yearOfStudy: PropTypes.string,
      officeNumber: PropTypes.string, // Add counselor-specific fields here
      studentId: PropTypes.string, // Add student-specific fields here
      major: PropTypes.string, // Add student-specific fields here
      bio: PropTypes.string, // Add counselor-specific fields here
    }),
  }),
};

ViewUserModal.defaultProps = {
  user: null,
};

export default ViewUserModal;

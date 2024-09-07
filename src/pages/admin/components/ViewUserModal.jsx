import PropTypes from "prop-types";
import { Dialog, DialogPanel, DialogTitle, Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
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
    if (user?.personalInfo?.bio) {
      // User is a counselor
      return (
        <>
          <p className="text-sm">Full Name: {user.personalInfo.fullName}</p>
          <p className="text-sm">Department: {user.personalInfo.department}</p>
          <p className="text-sm">
            Mobile Number: {user.personalInfo.mobileNumber}
          </p>
          <p className="text-sm">Bio: {user.personalInfo.bio}</p>
          {/* Add more counselor-specific information here */}
        </>
      );
    } else if (user?.personalInfo) {
      // User is a student
      return (
        <>
          <p className="text-sm">Full Name: {user.personalInfo.fullName}</p>
          <p className="text-sm">
            ID Card Number: {user.personalInfo.idCardNumber}
          </p>
          <p className="text-sm">
            Year of Study: {user.personalInfo.yearOfStudy}
          </p>
          <p className="text-sm">Faculty: {user.personalInfo.faculty}</p>
          <p className="text-sm">Religion: {user.personalInfo.religion}</p>
          <p className="text-sm">Gender: {user.personalInfo.gender}</p>
          <p className="text-sm">Age: {user.personalInfo.age}</p>
          <p className="text-sm">
            Program of Study: {user.personalInfo.programOfStudy}
          </p>
          <p className="text-sm">Department: {user.personalInfo.department}</p>
          <p className="text-sm">
            Hall of Residence: {user.personalInfo.hallOfResidence}
          </p>
          <p className="text-sm">
            Marital Status: {user.personalInfo.maritalStatus}
          </p>
          <p className="text-sm">
            Mobile Number: {user.personalInfo.mobileNumber}
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

  const renderEditForm = () => {
    const fields = [
      { label: "Full Name", value: user?.personalInfo?.fullName, type: "text" },
      { label: "Email", value: user?.email, type: "email" },
      { label: "Username", value: user?.username, type: "text" },
      { label: "Mobile Number", value: user?.personalInfo?.mobileNumber, type: "text" },
      { label: "Department", value: user?.personalInfo?.department, type: "text" },
      { label: "Faculty", value: user?.personalInfo?.faculty, type: "text" },
      { label: "Year of Study", value: user?.personalInfo?.yearOfStudy, type: "text" },
      { label: "Religion", value: user?.personalInfo?.religion, type: "text" },
      { label: "Marital Status", value: user?.personalInfo?.maritalStatus, type: "text" },
    ];
  
    return (
      <form className="space-y-4">
        {fields.map((field, index) => (
          <div key={index}>
            <label className="block text-sm font-medium text-gray-700">{field.label}</label>
            <input
              type={field.type}
              defaultValue={field.value}
              className="mt-1 block w-full rounded-md border-gray-100 border p-2  shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        ))}
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 py-1.5 px-3 text-sm font-semibold text-white shadow-inner shadow-white/10 focus:outline-none hover:bg-blue-500 focus:ring-2 focus:ring-blue-500"
          >
            Save Changes
          </button>
        </div>
      </form>
    );
  };

  return (
    <Dialog
      open={isOpen}
      as="div"
      className="relative z-10 focus:outline-none"
      onClose={onClose}
    >
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto bg-black bg-opacity-50">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            transition
            className="w-full max-w-md rounded-xl bg-white p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
          >
            <DialogTitle as="h3" className="text-base font-medium text-black">
              User Information
            </DialogTitle>
            <TabGroup>
              <TabList className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
                <Tab
                  className={({ selected }) =>
                    selected
                      ? "w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700 bg-white shadow"
                      : "w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-100 hover:bg-white/[0.12] hover:text-white"
                  }
                >
                  View Details
                </Tab>
                <Tab
                  className={({ selected }) =>
                    selected
                      ? "w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700 bg-white shadow"
                      : "w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-100 hover:bg-white/[0.12] hover:text-white"
                  }
                >
                  Edit Details
                </Tab>
              </TabList>
              <TabPanels className="mt-2">
                <TabPanel className="rounded-xl bg-white p-3">
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
                </TabPanel>
                <TabPanel className="rounded-xl bg-white p-3">
                  {user && renderEditForm()}
                </TabPanel>
              </TabPanels>
            </TabGroup>
            <div className="mt-4">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm font-semibold text-white shadow-inner shadow-white/10 focus:outline-none hover:bg-gray-600 focus:ring-2 focus:ring-gray-500"
                onClick={onClose}
              >
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
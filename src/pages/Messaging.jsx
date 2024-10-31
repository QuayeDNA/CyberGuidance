import { useState, useEffect } from "react";
import { useAuth } from "../components/contexts/AuthContext";
import axios from "axios";
import "../components/css/Messaging.css";
import CommunicationSystem from "../components/comms/Chats";
import Loading from "../components/LoadingComponent"
const MessagingComponent = () => {
  const { userData, token, loading } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  // const isPinSet = !!localStorage.getItem("userPin");

  useEffect(() => {
    const fetchData = async () => {
      if (token) {
        try {
          const [appointmentsResponse, userInfoResponse] = await Promise.all([
            axios.get(
              "https://cyber-guidance.onrender.com/api/appointment-history",
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            ),
            axios.get("https://cyber-guidance.onrender.com/api/user-info", {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

          setAppointments(appointmentsResponse.data.appointments);
          setUserInfo(userInfoResponse.data.user);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, [token]);

  if (loading || isLoading) {
    return <Loading />;
  }

  if (!userData || !token || !userInfo) {
    return <div>Please log in to access messaging.</div>;
  }

  const userType = userData.isStudent
    ? "student"
    : userData.isCounselor
    ? "counselor"
    : "admin";

  return (
    <div className="flex flex-col justify-center items-center">
      {/* {!isPinSet && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
          <p className="font-bold">Reminder</p>
          <p>
            Set a PIN to secure your conversations. Go to settings to create
            your PIN.
          </p>
        </div>
      )} */}
<div className="w-[100vw]">
      <CommunicationSystem
        userToken={token}
        userId={userData.userId}
        userType={userType}
        userName={userInfo.personalInfo.fullName}
        userAvatar={userInfo.personalInfo.profilePicture}
        appointments={appointments}
        userInfo={userInfo}
      />
      </div>
    </div>
  );
};

export default MessagingComponent;

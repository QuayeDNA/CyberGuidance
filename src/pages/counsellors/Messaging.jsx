import { useState, useEffect } from 'react';
import { useAuth } from '../../components/contexts/AuthContext';
import axios from 'axios';
import "../../components/css/Messaging.css";
import CommunicationSystem from '../../components/studentsApp/Chats';

const MessagingComponent = () => {
    const { userData, token, loading } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const isPinSet = !!localStorage.getItem('userPin');

    useEffect(() => {
        const fetchAppointments = async () => {
            if (token) {
                try {
                    const response = await axios.get('https://cyber-guidance.onrender.com/api/appointment-history', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setAppointments(response.data.appointments); // Ensure correct response structure
                } catch (error) {
                    console.error('Error fetching appointments:', error);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchAppointments();
    }, [token]);

    if (loading || isLoading) {
        return <div>Loading...</div>;
    }

    if (!userData || !token) {
        return <div>Please log in to access messaging.</div>;
    }

    return (
        <div className="flex flex-col justify-center items-center">
            {!isPinSet && (
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
                    <p className="font-bold">Reminder</p>
                    <p>Set a PIN to secure your conversations. Go to settings to create your PIN.</p>
                </div>
            )}

            <CommunicationSystem 
                userToken={token}
                userId={userData.userId}
                userType={userData.isStudent ? "student" : (userData.isCounselor ? "counselor" : "admin")}
                appointments={appointments}
            />
        </div>
    );
};

export default MessagingComponent;
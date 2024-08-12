import { useState, useEffect } from 'react';
import { Routes, Route } from "react-router-dom";
import Navbar from "../../components/studentsApp/Navbar";
import AppNavbar from "../../components/studentsApp/AppNavbar"
import Dashboard from "./Dashboard";
import Counselors from "./Counselors";
import CounselorProfile from "./CounselorProfile";
import Messaging from "./Messaging";
import User from "./User";
import Articles from './Articles';
import PinEntry from '../../components/studentsApp/PinEntry';
import CreatePin from '../../components/studentsApp/CreatePin'; // Import the new CreatePin component
import Appointment from "./Appointment"

function Main() {
    const [isPinVerified, setIsPinVerified] = useState(false);
    const [isPinSet, setIsPinSet] = useState(false);
    const [showCreatePin, setShowCreatePin] = useState(false);

    useEffect(() => {
        const userPin = localStorage.getItem('userPin');
        setIsPinSet(!!userPin);
        if (!userPin) {
            setShowCreatePin(true);
        }
    }, []);

    const handleCorrectPin = () => {
        setIsPinVerified(true);
    };

    const handlePinCreated = () => {
        setIsPinSet(true);
        setShowCreatePin(false);
    };

    const handleSkipPinCreation = () => {
        setShowCreatePin(false);
    };

    const renderMessagingComponent = () => {
        if (showCreatePin) {
            return <CreatePin onPinCreated={handlePinCreated} onSkip={handleSkipPinCreation} />;
        }
        if (isPinSet && !isPinVerified) {
            return <PinEntry onCorrectPin={handleCorrectPin} />;
        }
        return <Messaging />;
    };

    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen flex flex-col">
            <Navbar className="sticky top-0 z-50 shadow-md" />
            
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16 mb-20 md:mb-8">
                <Routes>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="counselors" element={<Counselors />} />
                    <Route path="counselor/:id" element={<CounselorProfile />} />
                    <Route path="message" element={renderMessagingComponent()} />
                    <Route path="articles" element={<Articles />} />
                    <Route path="articles/:id" element={<Articles />} />
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/user" element={<User />} />
                    <Route path='/appointment' element={<Appointment />} />
                </Routes>
            </main>
            
            <AppNavbar className="fixed bottom-0 left-0 right-0 bg-white shadow-lg md:hidden" />
        </div>
    );
}

export default Main;
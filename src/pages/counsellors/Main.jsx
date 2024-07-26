import { useState } from 'react';
import { Routes, Route } from "react-router-dom";
import Navbar from "../../components/counselorsApp/Navbar";
import AppNavbar from "../../components/counselorsApp/AppNavbar"
import Dashboard from "./Dashboard";
import Sessions from '../../components/counselorsApp/CounselorSessions'
import Messaging from "./Messaging";
import User from "./User";
import Articles from './Articles';
import PinEntry from '../../components/studentsApp/PinEntry'; // Import the new PinEntry component

function Main() {
    const [isPinVerified, setIsPinVerified] = useState(false);

    const handleCorrectPin = () => {
        setIsPinVerified(true);
    };

    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen flex flex-col">
            <Navbar className="sticky top-0 z-50 shadow-md" />
            
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16 mb-20 md:mb-8">
                <Routes>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="message" element={
                        isPinVerified ? <Messaging /> : <PinEntry onCorrectPin={handleCorrectPin} />
                    } />
                    <Route path="sessions" element={<Sessions />} />
                    <Route path="articles" element={<Articles />} />
                    <Route path="articles/:id" element={<Articles />} />
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/user" element={<User />} />
                </Routes>
            </main>
            
            <AppNavbar className="fixed bottom-0 left-0 right-0 bg-white shadow-lg md:hidden" />
        </div>
    );
}

export default Main;
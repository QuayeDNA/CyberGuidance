import Navbar from "../../components/studentsApp/Navbar";
import AppNavbar from "../../components/studentsApp/AppNavbar"
import Dashboard from "./Dashboard";
import Counselors from "./Counselors";
import CounselorProfile from "./CounselorProfile";
import Messaging from "./Messaging";
import User from "./User";
import Articles from './Articles';


import { Routes, Route } from "react-router-dom";


function Main() {
    return (

        <div className="bg-gray-100 min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-6 my-16 md:mb-0">
                <Routes>
                   
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="counselors" element={<Counselors />} />
                    <Route path="counselor/:id" element={<CounselorProfile />} />
                    <Route path="message" element={<Messaging />} />
                    <Route path="articles" element={<Articles />} />
                    <Route path="articles/:id" element={<Articles />} />
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/user" element={<User />} />
                </Routes>
            </main>
           <AppNavbar />
        </div>

    );
}

export default Main;

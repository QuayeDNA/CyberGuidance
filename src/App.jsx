import Login from "./pages/students/Login";
import Signup from "./pages/students/Signup";
import MainPage from "./pages/students/Main";
import Landing from "./pages/Landing";
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ComingSoon from "./components/ComingSoon";
import NotFound from "./pages/NotFound";
import SetupPage from "./pages/students/SetupPage"
import UserPersonalisation from "./pages/students/UserPersonalisation";
function App() {
    return (
        <div className="App">
    <Router>
        <Routes>
            <Route path="setup" element={<SetupPage />} />
            <Route path="user-personalisation" element={<UserPersonalisation />} />
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/main/*" element={<MainPage />} />
            <Route path="/main/coming-soon" element={<ComingSoon />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    </Router>
</div>
    );
}

export default App;

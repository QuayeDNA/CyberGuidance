import Card from "../../components/ui/cards/Card";
import SessionView from "../../components/studentsApp/SessionCardView";
import Notes from "../../components/studentsApp/Notes";
import ArticlesCarousel from "../../components/studentsApp/ArticleCarousel";
import SessionCalendar from "../../components/studentsApp/SessionCalendar";
import RecommendedCounselors from "../../components/ui/cards/RecommendedCounselors";
import articlesData from '../../components/data/articlesData';
import { useState, useEffect } from 'react';

const Dashboard = () => {
    const [firstName, setFirstName] = useState('');
    useEffect(() => {
        const storedFirstName = localStorage.getItem('userFirstName');
        if (storedFirstName) {
            setFirstName(storedFirstName);
        }
    }, []);

    return (
        <div className="container mx-auto px-4">
                        <div className="text-left mb-4">
                <h2 className="text-2xl font-bold">Welcome, {firstName || 'User'}</h2>
                <p className="text-gray-500">Welcome to your safe space</p>
            </div>
            <RecommendedCounselors />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Card 1 */}
                <Card title="My Sessions" showAllLink={{ link: '/sessions', text: 'See All' }}>
                    <SessionView />
                </Card>
                {/* Conditionally render Calendar on medium screens */}
                <div className="hidden md:block md:col-span-1 lg:hidden">
                    <Card title="Calendar">
                        <SessionCalendar />
                    </Card>
                </div>
                {/* Combined Card 2 and 3 */}
                <Card
                    className="lg:row-span-2 md:col-span-2"
                    title="My Notes"
                    showAllLink={{ link: '/notes', text: 'See All' }}
                >
                    <Notes />
                </Card>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {/* Conditionally hide Calendar on medium screens */}
                <div className="hidden lg:block lg:col-span-1">
                    <Card title="Calendar">
                        <SessionCalendar />
                    </Card>
                </div>
                {/* Card 2 */}
                <ArticlesCarousel articles={articlesData} />
                {/* Card 3 */}
                <Card title="Calendar" className="md:hidden">
                  <SessionCalendar />
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
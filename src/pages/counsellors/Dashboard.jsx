import Card from "../../components/ui/cards/Card";
import SessionView from "../../components/counselorsApp/SessionCardView";
import ClientNotes from "../../components/counselorsApp/ClientNotes";
import ArticlesCarousel from "../../components/counselorsApp/ArticleCarousel";
import SessionCalendar from "../../components/counselorsApp/SessionCalendar";
import articlesData from '../../components/data/articlesData';
import Materials from './../../components/counselorsApp/Materials';

const CounselorDashboard = () => {
    return (
        <div className="container mx-auto px-4">
            <div className="text-left mb-4">
                <h2 className="text-2xl font-bold">Welcome, Dr. Smith</h2>
                <p className="text-gray-500">Here&apos;s an overview of your counseling practice.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Card 1 */}
                <Card title="Upcoming Sessions" showAllLink={{ link: '/counselor/sessions', text: 'Manage Sessions' }}>
                    <SessionView />
                </Card>
                {/* Conditionally render Calendar on medium screens */}
                <div className="hidden md:block md:col-span-1 lg:hidden">
                    <Card title="Your Schedule">
                        <SessionCalendar />
                    </Card>
                </div>
                {/* Combined Card 2 and 3 */}
                <Card
                    className="lg:row-span-2 md:col-span-2"
                    title="Client Notes"
                    showAllLink={{ link: '/client-notes', text: 'View All Notes' }}
                >
                    <ClientNotes />
                </Card>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {/* Conditionally hide Calendar on medium screens */}
                <div className="hidden lg:block lg:col-span-1">
                    <Card title="Your Schedule">
                        <SessionCalendar />
                    </Card>
                </div>
                {/* Card 1 */}
                <Card title="Counseling Resources" showAllLink={{ link: '/counselor/material-upload', text: 'View All' }}>
                    <Materials />
                </Card>
                {/* Card 2 */}
                <ArticlesCarousel articles={articlesData} />
                {/* Card 3 */}
                <Card title="Your Schedule" className="md:hidden">
                    <SessionCalendar />
                </Card>
            </div>
        </div>
    );
};

export default CounselorDashboard;
import Chats from '../../components/studentsApp/Chats';
import "../../components/css/Messaging.css";
const MessagingComponent = () => {

    const isPinSet = !!localStorage.getItem('userPin');

    return (
        <div className="flex flex-col justify-center items-center">
            {!isPinSet && (
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
                    <p className="font-bold">Reminder</p>
                    <p>Set a PIN to secure your conversations. Go to settings to create your PIN.</p>
                </div>
            )}

            <Chats />

        </div>
    );
};

export default MessagingComponent;

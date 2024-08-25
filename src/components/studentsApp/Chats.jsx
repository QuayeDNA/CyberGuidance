import { useState, useEffect } from 'react';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import ChatSocket from '../comms/ChatSocket';
import { useAuth } from '../../components/contexts/AuthContext';

const ChatComponent = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isMobileView, setIsMobileView] = useState(false);
  const [showChatList, setShowChatList] = useState(true);
  const [chatSocket, setChatSocket] = useState(null);
  const [counselors, setCounselors] = useState([]);
  const { token } = useAuth();

  const currentUserId = JSON.parse(localStorage.getItem('userData')).id;

  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const socket = new ChatSocket();
    setChatSocket(socket);

    socket.onMessage((message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    const fetchAppointmentHistory = async () => {
      try {
        const response = await fetch('https://cyber-guidance.onrender.com/api/appointment-history', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
    
        if (!response.ok) {
          throw new Error('Failed to fetch appointment history');
        }
    
        const data = await response.json();
        
        // Modified part to correctly extract unique counselors
        const uniqueCounselors = Array.from(
          new Set(data.appointments.map(app => JSON.stringify(app.counselor)))
        ).map(strCounselor => JSON.parse(strCounselor));
        
        setCounselors(uniqueCounselors);
        console.log('Unique counselors:', uniqueCounselors); // Add this line for debugging
      } catch (error) {
        console.error('Error fetching appointment history:', error);
      }
    };
    fetchAppointmentHistory();

    return () => {
      socket.disconnect();
    };
  }, [token]);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    if (isMobileView) setShowChatList(false);
    chatSocket?.joinRoom(currentUserId, user.id);
    
    // Fetch messages for this user
    fetch(`https://cyber-guidance.onrender.com/api/messages/${currentUserId}/${user.id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => setMessages(data))
      .catch(error => console.error('Error fetching messages:', error));
  };

  const handleSendMessage = (newMessage) => {
    chatSocket?.sendMessage(newMessage);
    setMessages(prevMessages => [...prevMessages, newMessage]);
  };

  return (
    <div className="flex h-[calc(100vh-120px)] w-[calc(100vw-90px)] px-4">
      {(!isMobileView || showChatList) && (
        <ChatList
          counselors={counselors}
          selectedUser={selectedUser}
          onSelectUser={handleSelectUser}
          isMobileView={isMobileView}
        />
      )}
      {(!isMobileView || !showChatList) && selectedUser && (
        <ChatWindow
          selectedUser={selectedUser}
          messages={messages}
          onSendMessage={handleSendMessage}
          isMobileView={isMobileView}
          onBackToList={() => setShowChatList(true)}
        />
      )}
    </div>
  );
};

export default ChatComponent;
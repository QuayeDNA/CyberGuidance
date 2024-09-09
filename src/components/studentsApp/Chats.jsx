import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import PropTypes from 'prop-types';
import VideoChat from './VideoChat';
import { FiMessageSquare, FiInfo } from 'react-icons/fi';
import { Popover, Transition } from '@headlessui/react';

const CommunicationSystem = ({ userToken, userId, userType, userName, userAvatar, appointments }) => {
  const [socket, setSocket] = useState(null);
  const [activeRooms, setActiveRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState({});
  const [logs, setLogs] = useState([]);
  const [showChat, setShowChat] = useState(true);

  const addLog = (message) => {
    setLogs(prevLogs => [...prevLogs, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    const newSocket = io("https://cyber-guidance.onrender.com", {
      auth: { token: userToken }
    });

    newSocket.on('connect', () => {
      addLog('Connected to socket server');
      appointments.forEach(appointment => {
        newSocket.emit('join_room', { roomId: appointment.roomId });
        addLog(`Joined room: ${appointment.roomId}`);
      });
    });

    newSocket.on('receive_message', ({ roomId, message, sender }) => {
      addLog(`Received message in room ${roomId} from ${sender.type} ${sender.id}`);
      setMessages(prev => ({
        ...prev,
        [roomId]: [...(prev[roomId] || []), { message, sender }]
      }));
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      addLog('Disconnected from socket server');
    };
  }, [userToken, appointments]);

  useEffect(() => {
    setActiveRooms(appointments.map(appointment => ({
      roomId: appointment.roomId,
      appointmentId: appointment.id,
      participants: appointment.participants || [],
      startTime: new Date(appointment.startTime),
      endTime: new Date(appointment.endTime)
    })));
  }, [appointments]);

  const joinRoom = (roomId) => {
    socket.emit('join_room', { roomId });
    setSelectedRoom(roomId);
  };

  const leaveRoom = (roomId) => {
    socket.emit('leave_room', { roomId });
    setSelectedRoom(null);
    setActiveRooms(prev => prev.filter(room => room.roomId !== roomId));
  };

  const sendMessage = (message) => {
    if (message.trim() !== '' && selectedRoom) {
      addLog(`Sending message to room ${selectedRoom}`);
      socket.emit('send_message', { roomId: selectedRoom, message, sender: { id: userId, type: userType, name: userName, avatar: userAvatar } });
      setMessages(prev => ({
        ...prev,
        [selectedRoom]: [...(prev[selectedRoom] || []), { message, sender: { id: userId, type: userType, name: userName, avatar: userAvatar } }]
      }));
    }
  };

  const toggleChat = () => setShowChat(!showChat);

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full bg-gray-100">
      <div className="w-full lg:w-1/5 bg-white border-r border-gray-200 p-4 overflow-y-auto">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
            <img src={userAvatar || '/default-avatar.png'} alt={userName} className="w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">{userName}</h2>
            <p className="text-sm text-gray-600">{userType}</p>
          </div>
        </div>
        <h3 className="text-xl font-bold mb-4">Active Sessions</h3>
        {activeRooms.map(room => (
          <div key={room.roomId} className="mb-4 p-4 bg-gray-100 rounded-lg shadow hover:shadow-md transition-shadow">
            <h4 className="font-semibold text-lg mb-2">Appointment {room.appointmentId}</h4>
            <p className="text-sm text-gray-600">Start: {room.startTime.toLocaleString()}</p>
            <p className="text-sm text-gray-600 mb-2">End: {room.endTime.toLocaleString()}</p>
            <p className="text-sm font-medium">Participants:</p>
            <div className="flex flex-wrap gap-2 mb-2">
              {room.participants.map(participant => (
                <div key={participant.id} className="relative group">
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                    <img src={participant.avatar || '/default-avatar.png'} alt={participant.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {`${participant.name} (${participant.type})`}
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => joinRoom(room.roomId)}
              className="w-full mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
            >
              Join Session
            </button>
          </div>
        ))}
      </div>
      <div className="flex-1 relative">
        {selectedRoom ? (
          <VideoChat
            socket={socket}
            roomId={selectedRoom}
            userId={userId}
            userType={userType}
            userName={userName}
            userAvatar={userAvatar}
            messages={messages[selectedRoom] || []}
            sendMessage={sendMessage}
            leaveRoom={() => leaveRoom(selectedRoom)}
            showChat={showChat}
            toggleChat={toggleChat}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-xl text-gray-500">Select a session to join</p>
          </div>
        )}
      </div>
      <Popover className="fixed bottom-4 right-4">
        {({ open }) => (
          <>
            <Popover.Button className="bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
              <FiInfo size={20} />
            </Popover.Button>
            <Transition
              show={open}
              enter="transition duration-100 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <Popover.Panel className="absolute bottom-full right-0 mb-2 w-80 max-h-60 overflow-y-auto bg-gray-800 text-white p-4 rounded-lg shadow-lg">
                <h3 className="font-bold mb-2">Logs:</h3>
                {logs.map((log, index) => (
                  <p key={index} className="text-sm mb-1">{log}</p>
                ))}
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  );
};

CommunicationSystem.propTypes = {
  userToken: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  userType: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
  userAvatar: PropTypes.string,
  appointments: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    roomId: PropTypes.string.isRequired,
    startTime: PropTypes.string.isRequired,
    endTime: PropTypes.string.isRequired,
    participants: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string,
      type: PropTypes.string.isRequired,
      avatar: PropTypes.string,
    })).isRequired,
  })).isRequired,
};

export default CommunicationSystem;
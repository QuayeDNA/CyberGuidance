import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { FiSend, FiVideo, FiVideoOff, FiMic, FiMicOff, FiMaximize, FiMinimize, FiPhone } from 'react-icons/fi';
import PropTypes from 'prop-types';

const CommunicationSystem = ({ userToken, userId, userType, appointments }) => {
  const [socket, setSocket] = useState(null);
  const [activeRooms, setActiveRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState({});
  const [inputMessage, setInputMessage] = useState('');
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [peerConnections, setPeerConnections] = useState({});
  const [streams, setStreams] = useState({});
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [logs, setLogs] = useState([]);
  const localVideoRef = useRef(null);

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

    newSocket.on('user_joined', ({ roomId, userId, userType }) => {
      console.log(`${userType} ${userId} joined room ${roomId}`);
      initializePeerConnection(roomId, userId);
    });

    newSocket.on('user_left', ({ roomId, userId }) => {
      console.log(`User ${userId} left room ${roomId}`);
      cleanupPeerConnection(roomId, userId);
    });

    newSocket.on('offer', async ({ roomId, offer, from }) => {
      const pc = peerConnections[roomId]?.[from];
      if (pc) {
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        newSocket.emit('answer', { roomId, answer, to: from });
      }
    });

    newSocket.on('answer', async ({ roomId, answer, from }) => {
      const pc = peerConnections[roomId]?.[from];
      if (pc) {
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
      }
    });

    newSocket.on('ice_candidate', async ({ roomId, candidate, from }) => {
      const pc = peerConnections[roomId]?.[from];
      if (pc) {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      }
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
      participants: appointment.participants || [], // Ensure participants is defined
      startTime: new Date(appointment.startTime),
      endTime: new Date(appointment.endTime)
    })));
  }, [appointments]);

  const initializePeerConnection = async (roomId, peerId) => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('ice_candidate', { roomId, candidate: event.candidate, to: peerId });
      }
    };

    pc.ontrack = (event) => {
      setStreams(prev => ({
        ...prev,
        [roomId]: {
          ...(prev[roomId] || {}),
          [peerId]: event.streams[0]
        }
      }));
    };

    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    stream.getTracks().forEach(track => pc.addTrack(track, stream));

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }

    setPeerConnections(prev => ({
      ...prev,
      [roomId]: {
        ...(prev[roomId] || {}),
        [peerId]: pc
      }
    }));

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socket.emit('offer', { roomId, offer, to: peerId });
  };

  const cleanupPeerConnection = (roomId, peerId) => {
    const pc = peerConnections[roomId]?.[peerId];
    if (pc) {
      pc.close();
      setPeerConnections(prev => {
        const roomConnections = { ...prev[roomId] };
        delete roomConnections[peerId];
        return { ...prev, [roomId]: roomConnections };
      });
    }

    setStreams(prev => {
      const roomStreams = { ...prev[roomId] };
      delete roomStreams[peerId];
      return { ...prev, [roomId]: roomStreams };
    });
  };

  const joinRoom = (roomId) => {
    socket.emit('join_room', { roomId });
    setSelectedRoom(roomId);
  };

  const leaveRoom = (roomId) => {
    socket.emit('leave_room', { roomId });
    setSelectedRoom(null);
    setActiveRooms(prev => prev.filter(room => room.roomId !== roomId));
    Object.keys(peerConnections[roomId] || {}).forEach(peerId => {
      cleanupPeerConnection(roomId, peerId);
    });
  };

  const sendMessage = () => {
    if (inputMessage.trim() !== '' && selectedRoom) {
      addLog(`Sending message to room ${selectedRoom}`);
      socket.emit('send_message', { roomId: selectedRoom, message: inputMessage, sender: { id: userId, type: userType } });
      setMessages(prev => ({
        ...prev,
        [selectedRoom]: [...(prev[selectedRoom] || []), { message: inputMessage, sender: { id: userId, type: userType } }]
      }));
      setInputMessage('');
    }
  };

  const toggleVideo = () => {
    const videoTrack = localVideoRef.current.srcObject.getVideoTracks()[0];
    videoTrack.enabled = !videoTrack.enabled;
    setIsVideoOn(!isVideoOn);
  };

  const toggleAudio = () => {
    const audioTrack = localVideoRef.current.srcObject.getAudioTracks()[0];
    audioTrack.enabled = !audioTrack.enabled;
    setIsAudioOn(!isAudioOn);
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullScreen(!isFullScreen);
  };

  return (
    <div className="flex h-screen w-full bg-gray-100">
      <div className="w-1/4 bg-white border-r border-gray-200 p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Active Sessions</h2>
        {activeRooms.map(room => (
          <div key={room.roomId} className="mb-4 p-4 bg-gray-100 rounded-lg shadow">
            <h3 className="font-semibold text-lg mb-2">Appointment {room.appointmentId}</h3>
            <p className="text-sm text-gray-600">Start: {room.startTime.toLocaleString()}</p>
            <p className="text-sm text-gray-600 mb-2">End: {room.endTime.toLocaleString()}</p>
            <p className="text-sm font-medium">Participants:</p>
            <ul className="list-disc list-inside mb-2">
              {room.participants.map(participant => (
                <li key={participant.id} className="text-sm">
                  {participant.name ? `${participant.name} (${participant.type})` : 'Unknown Participant'}
                </li>
              ))}
            </ul>
            <button
              onClick={() => joinRoom(room.roomId)}
              className="w-full mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
            >
              Join Session
            </button>
          </div>
        ))}
      </div>
      <div className="flex-1 flex flex-col">
        {selectedRoom ? (
          <>
            <div className="flex-1 grid grid-cols-2 gap-4 p-4">
              <video ref={localVideoRef} autoPlay muted className="w-full h-full object-cover rounded-lg shadow-lg" />
              {Object.entries(streams[selectedRoom] || {}).map(([peerId, stream]) => (
                <video
                  key={peerId}
                  ref={el => { if (el) el.srcObject = stream; }}
                  autoPlay
                  className="w-full h-full object-cover rounded-lg shadow-lg"
                />
              ))}
            </div>
            <div className="bg-white p-4 flex justify-center space-x-4">
              <button onClick={toggleVideo} className={`p-3 rounded-full ${isVideoOn ? 'bg-blue-500' : 'bg-red-500'} transition duration-300`}>
                {isVideoOn ? <FiVideo className="text-white" size={20} /> : <FiVideoOff className="text-white" size={20} />}
              </button>
              <button onClick={toggleAudio} className={`p-3 rounded-full ${isAudioOn ? 'bg-blue-500' : 'bg-red-500'} transition duration-300`}>
                {isAudioOn ? <FiMic className="text-white" size={20} /> : <FiMicOff className="text-white" size={20} />}
              </button>
              <button onClick={toggleFullScreen} className="p-3 rounded-full bg-gray-500 text-white transition duration-300">
                {isFullScreen ? <FiMinimize size={20} /> : <FiMaximize size={20} />}
              </button>
              <button onClick={() => leaveRoom(selectedRoom)} className="p-3 rounded-full bg-red-500 text-white transition duration-300">
                <FiPhone size={20} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-xl text-gray-500">Select a session to join</p>
          </div>
        )}
      </div>
      <div className="w-1/4 bg-white border-l border-gray-200 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages[selectedRoom]?.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender.id === userId ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs px-4 py-2 rounded-lg ${msg.sender.id === userId ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                <p className="text-xs font-medium mb-1">{msg.sender.type} {msg.sender.id}</p>
                <p className="text-sm">{msg.message}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-gray-200">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type a message..."
            />
            <button onClick={sendMessage} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300">
              <FiSend size={20} />
            </button>
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-2 text-sm">
        <h3 className="font-bold mb-1">Logs:</h3>
        <div className="h-20 overflow-y-auto">
          {logs.map((log, index) => (
            <p key={index}>{log}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

CommunicationSystem.propTypes = {
  userToken: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  userType: PropTypes.string.isRequired,
  appointments: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    roomId: PropTypes.string.isRequired,
    startTime: PropTypes.string.isRequired,
    endTime: PropTypes.string.isRequired,
    participants: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string,
      type: PropTypes.string.isRequired,
    })).isRequired,
  })).isRequired,
};

export default CommunicationSystem;
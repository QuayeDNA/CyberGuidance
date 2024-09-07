import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { Dialog, Transition } from '@headlessui/react';
import { FiSend, FiVideo, FiVideoOff, FiMic, FiMicOff, FiMaximize, FiMinimize, FiPhone, FiMessageSquare } from 'react-icons/fi';
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
  const localVideoRef = useRef(null);
  const remoteVideosRef = useRef({});

  useEffect(() => {
      const newSocket = io("https://cyber-guidance.onrender.com", {
          auth: { token: userToken }
      });

      newSocket.on('connect', () => {
          console.log('Connected to socket server');
          appointments.forEach(appointment => {
              newSocket.emit('join_room', { roomId: appointment.roomId });
          });
      });

      newSocket.on('receive_message', ({ roomId, message, sender }) => {
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
    };
}, [userToken, appointments]);

useEffect(() => {
    setActiveRooms(appointments.map(appointment => ({
        roomId: appointment.roomId,
        appointmentId: appointment._id,
        participants: [appointment.studentId, appointment.counselorId],
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
        socket.emit('send_message', { roomId: selectedRoom, message: inputMessage });
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
    <div className="flex h-screen bg-gray-100">
            <div className="w-1/4 bg-white border-r border-gray-200 p-4 overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">Active Sessions</h2>
                {activeRooms.map(room => (
                    <div key={room.roomId} className="mb-2 p-2 bg-gray-100 rounded">
                        <p>Appointment ID: {room.appointmentId}</p>
                        <p>Start: {room.startTime.toLocaleString()}</p>
                        <p>End: {room.endTime.toLocaleString()}</p>
                        <button
                            onClick={() => joinRoom(room.roomId)}
                            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Join
                        </button>
                    </div>
                ))}
            </div>
      <div className="flex-1 flex flex-col">
        {selectedRoom && (
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
              <button onClick={toggleVideo} className={`p-2 rounded-full ${isVideoOn ? 'bg-blue-500' : 'bg-red-500'}`}>
                {isVideoOn ? <FiVideo className="text-white" /> : <FiVideoOff className="text-white" />}
              </button>
              <button onClick={toggleAudio} className={`p-2 rounded-full ${isAudioOn ? 'bg-blue-500' : 'bg-red-500'}`}>
                {isAudioOn ? <FiMic className="text-white" /> : <FiMicOff className="text-white" />}
              </button>
              <button onClick={toggleFullScreen} className="p-2 rounded-full bg-gray-500 text-white">
                {isFullScreen ? <FiMinimize /> : <FiMaximize />}
              </button>
              <button onClick={() => leaveRoom(selectedRoom)} className="p-2 rounded-full bg-red-500 text-white">
                <FiPhone />
              </button>
            </div>
          </>
        )}
      </div>
      <div className="w-1/4 bg-white border-l border-gray-200 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages[selectedRoom]?.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender.id === userId ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs px-4 py-2 rounded-lg ${msg.sender.id === userId ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
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
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type a message..."
            />
            <button onClick={sendMessage} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <FiSend />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

CommunicationSystem.propTypes = {
  userToken: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  userType: PropTypes.string.isRequired,
  appointments: PropTypes.array.isRequired,
};

export default CommunicationSystem;
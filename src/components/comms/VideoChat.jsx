import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { FiSend, FiVideo, FiVideoOff, FiMic, FiMicOff, FiMaximize, FiMinimize, FiPhone, FiMessageSquare, FiShare, FiSettings, FiUserPlus } from 'react-icons/fi';

const VideoChat = ({ socket, roomId, userId, messages, sendMessage, leaveRoom, showChat, toggleChat }) => {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [peerConnections, setPeerConnections] = useState({});
  const [streams, setStreams] = useState({});
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const localVideoRef = useRef(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    const initializePeerConnection = async (peerId) => {
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
          [peerId]: event.streams[0]
        }));
      };

      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      stream.getTracks().forEach(track => pc.addTrack(track, stream));

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      setPeerConnections(prev => ({
        ...prev,
        [peerId]: pc
      }));

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.emit('offer', { roomId, offer, to: peerId });
    };

    socket.on('user_joined', ({ userId: peerId, userName }) => {
      initializePeerConnection(peerId);
      setParticipants(prev => [...prev, { id: peerId, name: userName }]);
    });

    socket.on('offer', async ({ offer, from }) => {
      const pc = peerConnections[from];
      if (pc) {
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit('answer', { roomId, answer, to: from });
      }
    });

    socket.on('answer', async ({ answer, from }) => {
      const pc = peerConnections[from];
      if (pc) {
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
      }
    });

    socket.on('ice_candidate', async ({ candidate, from }) => {
      const pc = peerConnections[from];
      if (pc) {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    socket.on('user_left', ({ userId: peerId }) => {
      setStreams(prev => {
        const newStreams = { ...prev };
        delete newStreams[peerId];
        return newStreams;
      });
      setParticipants(prev => prev.filter(p => p.id !== peerId));
    });

    return () => {
      Object.values(peerConnections).forEach(pc => pc.close());
    };
  }, [socket, roomId, peerConnections]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

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

  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const videoTrack = screenStream.getVideoTracks()[0];
        
        Object.values(peerConnections).forEach(pc => {
          const sender = pc.getSenders().find(s => s.track.kind === 'video');
          sender.replaceTrack(videoTrack);
        });

        localVideoRef.current.srcObject = screenStream;
        setIsScreenSharing(true);

        videoTrack.onended = () => {
          toggleScreenShare();
        };
      } catch (error) {
        console.error("Error sharing screen:", error);
      }
    } else {
      const userStream = await navigator.mediaDevices.getUserMedia({ video: true });
      const videoTrack = userStream.getVideoTracks()[0];

      Object.values(peerConnections).forEach(pc => {
        const sender = pc.getSenders().find(s => s.track.kind === 'video');
        sender.replaceTrack(videoTrack);
      });

      localVideoRef.current.srcObject = userStream;
      setIsScreenSharing(false);
    }
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() !== '') {
      sendMessage(inputMessage);
      setInputMessage('');
    }
  };

  const inviteParticipant = () => {
    const inviteLink = `${window.location.origin}/join/${roomId}`;
    navigator.clipboard.writeText(inviteLink).then(() => {
      alert("Invitation link copied to clipboard!");
    });
  };

  const Tooltip = ({ children, content }) => (
    <div className="relative group">
      {children}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {content}
      </div>
    </div>
  );

  Tooltip.propTypes = {
    children: PropTypes.node.isRequired,
    content: PropTypes.string.isRequired,
  };

  return (
    <div className="flex flex-col h-full bg-gray-100">
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 overflow-y-auto">
        <div className="relative">
          <video ref={localVideoRef} autoPlay muted className="w-full h-full object-cover rounded-lg shadow-lg" />
          <div className="absolute bottom-2 left-2 bg-blue-500 text-white px-2 py-1 text-xs rounded-full">
            You {isScreenSharing && '(Screen)'}
          </div>
        </div>
        {Object.entries(streams).map(([peerId, stream]) => (
          <div key={peerId} className="relative">
            <video
              ref={el => { if (el) el.srcObject = stream; }}
              autoPlay
              className="w-full h-full object-cover rounded-lg shadow-lg"
            />
            <div className="absolute bottom-2 left-2 bg-green-500 text-white px-2 py-1 text-xs rounded-full">
              {participants.find(p => p.id === peerId)?.name || 'Peer'}
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white p-4 flex justify-center space-x-4">
        <Tooltip content={isVideoOn ? 'Turn off video' : 'Turn on video'}>
          <button onClick={toggleVideo} className={`p-3 rounded-full ${isVideoOn ? 'bg-blue-500' : 'bg-red-500'} transition duration-300`}>
            {isVideoOn ? <FiVideo className="text-white" size={20} /> : <FiVideoOff className="text-white" size={20} />}
          </button>
        </Tooltip>
        <Tooltip content={isAudioOn ? 'Mute audio' : 'Unmute audio'}>
          <button onClick={toggleAudio} className={`p-3 rounded-full ${isAudioOn ? 'bg-blue-500' : 'bg-red-500'} transition duration-300`}>
            {isAudioOn ? <FiMic className="text-white" size={20} /> : <FiMicOff className="text-white" size={20} />}
          </button>
        </Tooltip>
        <Tooltip content={isScreenSharing ? 'Stop sharing screen' : 'Share screen'}>
          <button onClick={toggleScreenShare} className={`p-3 rounded-full ${isScreenSharing ? 'bg-green-500' : 'bg-blue-500'} transition duration-300`}>
            <FiShare className="text-white" size={20} />
          </button>
        </Tooltip>
        <Tooltip content={isFullScreen ? 'Exit full screen' : 'Enter full screen'}>
          <button onClick={toggleFullScreen} className="p-3 rounded-full bg-gray-500 text-white transition duration-300">
            {isFullScreen ? <FiMinimize size={20} /> : <FiMaximize size={20} />}
          </button>
        </Tooltip>
        <Tooltip content="Invite participant">
          <button onClick={inviteParticipant} className="p-3 rounded-full bg-purple-500 text-white transition duration-300">
            <FiUserPlus size={20} />
          </button>
        </Tooltip>
        <Tooltip content="Settings">
          <button onClick={() => setShowSettings(!showSettings)} className="p-3 rounded-full bg-gray-500 text-white transition duration-300">
            <FiSettings size={20} />
          </button>
        </Tooltip>
        <Tooltip content="Leave session">
          <button onClick={leaveRoom} className="p-3 rounded-full bg-red-500 text-white transition duration-300">
            <FiPhone size={20} />
          </button>
        </Tooltip>
        <Tooltip content={showChat ? 'Hide chat' : 'Show chat'}>
          <button onClick={toggleChat} className="p-3 rounded-full bg-blue-500 text-white transition duration-300">
            <FiMessageSquare size={20} />
          </button>
        </Tooltip>
      </div>
      {showChat && (
        <div className="absolute top-0 right-0 w-full sm:w-1/3 lg:w-1/4 h-full bg-white border-l border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Chat</h2>
          </div>
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.sender.id === userId ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs px-4 py-2 rounded-lg ${msg.sender.id === userId ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 rounded-full overflow-hidden">
                      <img src={msg.sender.avatar || '/default-avatar.png'} alt={msg.sender.name} className="w-full h-full object-cover" />
                    </div>
                    <p className="text-xs font-medium">{msg.sender.name || `${msg.sender.type} ${msg.sender.id}`}</p>
                  </div>
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
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type a message..."
              />
              <button onClick={handleSendMessage} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300">
                <FiSend size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
      {showSettings && (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Select Camera</label>
                <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                  <option>Camera 1</option>
                  <option>Camera 2</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Select Microphone</label>
                <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                  <option>Microphone 1</option>
                  <option>Microphone 2</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Select Speaker</label>
                <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                  <option>Speaker 1</option>
                  <option>Speaker 2</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button onClick={() => setShowSettings(false)} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

VideoChat.propTypes = {
  socket: PropTypes.object.isRequired,
  roomId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  messages: PropTypes.arrayOf(PropTypes.shape({
    message: PropTypes.string.isRequired,
    sender: PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      name: PropTypes.string,
      avatar: PropTypes.string,
    }).isRequired,
  })).isRequired,
  sendMessage: PropTypes.func.isRequired,
  leaveRoom: PropTypes.func.isRequired,
  showChat: PropTypes.bool.isRequired,
  toggleChat: PropTypes.func.isRequired,
};

export default VideoChat;
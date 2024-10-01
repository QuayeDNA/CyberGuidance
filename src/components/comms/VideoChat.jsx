import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { FiVideo, FiVideoOff, FiMic, FiMicOff, FiShare, FiMaximize, FiMinimize, FiUserPlus, FiSettings, FiPhone } from 'react-icons/fi';

const VideoChat = ({ socket, roomId, messages, leaveRoom }) => {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [peerConnections, setPeerConnections] = useState({});
  const [streams, setStreams] = useState({});
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [devices, setDevices] = useState({ cameras: [], microphones: [], speakers: [] });
  const [selectedDevices, setSelectedDevices] = useState({ camera: '', microphone: '', speaker: '' });
  const localVideoRef = useRef(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    const initializeLocalStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        localVideoRef.current.srcObject = stream;
        return stream;
      } catch (error) {
        console.error('Error accessing media devices.', error);
      }
    };

    const initializePeerConnection = async (peerId, localStream) => {
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
      });

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('ice_candidate', { roomId, candidate: event.candidate, to: peerId });
        }
      };

      pc.ontrack = (event) => {
        setStreams((prev) => ({ ...prev, [peerId]: event.streams[0] }));
      };

      localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));

      return pc;
    };

    const handleUserJoined = async ({ userId: peerId, userType: peerType, userName: peerName }) => {
      const localStream = await initializeLocalStream();
      const pc = await initializePeerConnection(peerId, localStream);

      setPeerConnections((prev) => ({
        ...prev,
        [peerId]: pc,
      }));

      setParticipants((prev) => [...prev, { id: peerId, type: peerType, name: peerName }]);

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.emit('offer', { roomId, offer, to: peerId });
    };

    const handleOffer = async ({ offer, from }) => {
      const localStream = await initializeLocalStream();
      const pc = await initializePeerConnection(from, localStream);

      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit('answer', { roomId, answer, to: from });

      setPeerConnections((prev) => ({
        ...prev,
        [from]: pc,
      }));
    };

    const handleAnswer = async ({ answer, from }) => {
      const pc = peerConnections[from];
      if (pc) {
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
      }
    };

    const handleIceCandidate = async ({ candidate, from }) => {
      const pc = peerConnections[from];
      if (pc) {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      }
    };

    const handleUserLeft = ({ userId: peerId }) => {
      const pc = peerConnections[peerId];
      if (pc) {
        pc.close();
        setPeerConnections((prev) => {
          const updated = { ...prev };
          delete updated[peerId];
          return updated;
        });
        setStreams((prev) => {
          const updated = { ...prev };
          delete updated[peerId];
          return updated;
        });
        setParticipants((prev) => prev.filter((p) => p.id !== peerId));
      }
    };

    socket.on('user_joined', handleUserJoined);
    socket.on('offer', handleOffer);
    socket.on('answer', handleAnswer);
    socket.on('ice_candidate', handleIceCandidate);
    socket.on('user_left', handleUserLeft);

    return () => {
      socket.off('user_joined', handleUserJoined);
      socket.off('offer', handleOffer);
      socket.off('answer', handleAnswer);
      socket.off('ice_candidate', handleIceCandidate);
      socket.off('user_left', handleUserLeft);
    };
  }, [socket, roomId, peerConnections]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const getDevices = async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cameras = devices.filter((device) => device.kind === 'videoinput');
      const microphones = devices.filter((device) => device.kind === 'audioinput');
      const speakers = devices.filter((device) => device.kind === 'audiooutput');
      setDevices({ cameras, microphones, speakers });
    };

    getDevices();
  }, []);

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
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const videoTrack = stream.getVideoTracks()[0];
        Object.values(peerConnections).forEach((pc) => {
          const sender = pc.getSenders().find((s) => s.track.kind === 'video');
          sender.replaceTrack(videoTrack);
        });
        localVideoRef.current.srcObject = stream;
        videoTrack.onended = () => {
          stopScreenSharing();
        };
        setIsScreenSharing(true);
      } catch (error) {
        console.error('Error sharing screen:', error);
      }
    } else {
      stopScreenSharing();
    }
  };

  const stopScreenSharing = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    const videoTrack = stream.getVideoTracks()[0];
    Object.values(peerConnections).forEach((pc) => {
      const sender = pc.getSenders().find((s) => s.track.kind === 'video');
      sender.replaceTrack(videoTrack);
    });
    localVideoRef.current.srcObject = stream;
    setIsScreenSharing(false);
  };

  const inviteParticipant = () => {
    const inviteLink = `${window.location.origin}/join/${roomId}`;
    navigator.clipboard.writeText(inviteLink).then(() => {
      alert('Invite link copied to clipboard');
    });
  };

  const handleDeviceChange = async (deviceType, deviceId) => {
    try {
      const constraints = {};
      if (deviceType === 'video') {
        constraints.video = { deviceId: { exact: deviceId } };
      } else if (deviceType === 'audio') {
        constraints.audio = { deviceId: { exact: deviceId } };
      }
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      const track = stream.getTracks()[0];
      Object.values(peerConnections).forEach((pc) => {
        const sender = pc.getSenders().find((s) => s.track.kind === track.kind);
        sender.replaceTrack(track);
      });
      localVideoRef.current.srcObject = stream;
      setSelectedDevices((prev) => ({ ...prev, [deviceType]: deviceId }));
    } catch (error) {
      console.error('Error changing device:', error);
    }
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
              ref={(el) => {
                if (el) el.srcObject = stream;
              }}
              autoPlay
              className="w-full h-full object-cover rounded-lg shadow-lg"
            />
            <div className="absolute bottom-2 left-2 bg-green-500 text-white px-2 py-1 text-xs rounded-full">
              {participants.find((p) => p.id === peerId)?.name || 'Peer'}
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
      </div>
     
        {showSettings && (
          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Select Camera</label>
                  <select
                    value={selectedDevices.camera}
                    onChange={(e) => handleDeviceChange('video', e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    {devices.cameras.map((camera) => (
                      <option key={camera.deviceId} value={camera.deviceId}>
                        {camera.label || `Camera ${camera.deviceId.substr(0, 5)}`}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Select Microphone</label>
                  <select
                    value={selectedDevices.microphone}
                    onChange={(e) => handleDeviceChange('audio', e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    {devices.microphones.map((microphone) => (
                      <option key={microphone.deviceId} value={microphone.deviceId}>
                        {microphone.label || `Microphone ${microphone.deviceId.substr(0, 5)}`}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Select Speaker</label>
                  <select
                    value={selectedDevices.speaker}
                    onChange={(e) => handleDeviceChange('audiooutput', e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    {devices.speakers.map((speaker) => (
                      <option key={speaker.deviceId} value={speaker.deviceId}>
                        {speaker.label || `Speaker ${speaker.deviceId.substr(0, 5)}`}
                      </option>
                    ))}
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
      }).isRequired,
    })).isRequired,
    sendMessage: PropTypes.func.isRequired,
    leaveRoom: PropTypes.func.isRequired,
    showChat: PropTypes.bool.isRequired,
    toggleChat: PropTypes.func.isRequired,
  };

  export default VideoChat;
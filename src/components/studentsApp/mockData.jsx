// mockData.js
export const mockUsers = [
    { id: 1, name: 'Alice Johnson', avatar: 'https://i.pravatar.cc/150?img=1', online: true, lastMessage: 'Hey, how are you?', lastSeen: null },
    { id: 2, name: 'Bob Smith', avatar: 'https://i.pravatar.cc/150?img=2', online: false, lastMessage: 'See you tomorrow!', lastSeen: '2023-04-10T10:30:00' },
    { id: 3, name: 'Charlie Brown', avatar: 'https://i.pravatar.cc/150?img=3', online: true, lastMessage: 'Thanks for the help!', lastSeen: null },
  ];
  
  export const initialMessages = [
    { id: 1, senderId: 1, text: 'Hey there!', timestamp: '10:00 AM', status: 'read' },
    { id: 2, senderId: 2, text: 'Hi! How are you?', timestamp: '10:02 AM', status: 'read' },
    { id: 3, senderId: 1, text: 'I am good. What about you?', timestamp: '10:04 AM', status: 'sent' },
  ];
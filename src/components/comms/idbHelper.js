import { openDB } from 'idb';

const dbPromise = openDB('chatDB', 1, {
  upgrade(db) {
    const store = db.createObjectStore('messages', { keyPath: 'id', autoIncrement: true });
    store.createIndex('roomId', 'roomId');
    store.createIndex('timestamp', 'timestamp');
  },
});

export async function saveMessage(roomId, message) {
  const db = await dbPromise;
  const timestamp = new Date().toISOString();
  await db.add('messages', { roomId, timestamp, ...message });
}

export async function getMessages(roomId) {
  const db = await dbPromise;
  return await db.getAllFromIndex('messages', 'roomId', roomId);
}

export async function deleteMessages(roomId) {
  const db = await dbPromise;
  const tx = db.transaction('messages', 'readwrite');
  const store = tx.objectStore('messages');
  const messages = await store.index('roomId').getAllKeys(roomId);
  for (const id of messages) {
    await store.delete(id);
  }
}

export async function updateMessage(id, updatedMessage) {
  const db = await dbPromise;
  const tx = db.transaction('messages', 'readwrite');
  const store = tx.objectStore('messages');
  const existingMessage = await store.get(id);
  if (existingMessage) {
    await store.put({ ...existingMessage, ...updatedMessage, id });
  }
}

export async function getMessageById(id) {
  const db = await dbPromise;
  return await db.get('messages', id);
}

export async function getMessagesInRange(roomId, startDate, endDate) {
  const db = await dbPromise;
  const tx = db.transaction('messages', 'readonly');
  const store = tx.objectStore('messages');
  const index = store.index('timestamp');
  
  return await index.getAll(IDBKeyRange.bound(
    [roomId, startDate.toISOString()],
    [roomId, endDate.toISOString()]
  ));
}

export async function getLatestMessages(roomId, limit = 50) {
  const db = await dbPromise;
  const tx = db.transaction('messages', 'readonly');
  const store = tx.objectStore('messages');
  const index = store.index('timestamp');
  
  return await index.getAll(IDBKeyRange.bound(
    [roomId, '0'],
    [roomId, '9999-12-31T23:59:59.999Z']
  ), limit);
}

export async function clearAllMessages() {
  const db = await dbPromise;
  const tx = db.transaction('messages', 'readwrite');
  const store = tx.objectStore('messages');
  await store.clear();
}

// Define and export deleteMessage function
export async function deleteMessage(id) {
  const db = await dbPromise;
  const tx = db.transaction('messages', 'readwrite');
  const store = tx.objectStore('messages');
  await store.delete(id);
}
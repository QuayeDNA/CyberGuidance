import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

const ClientSessionNotesTable = ({ clients }) => {
  const [sortedClients, setSortedClients] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  useEffect(() => {
    let sortableClients = [...clients];
    if (sortConfig.key !== null) {
      sortableClients.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    setSortedClients(sortableClients);
  }, [clients, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (columnName) => {
    if (sortConfig.key === columnName) {
      return sortConfig.direction === 'ascending' ? <FaSortUp /> : <FaSortDown />;
    }
    return <FaSort />;
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Client Session Notes</h1>
      {sortedClients.map((client) => (
        <div key={client.id} className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{client.name}</h2>
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b text-left">
                  <button onClick={() => requestSort('date')} className="font-bold text-gray-700 flex items-center">
                    Date {getSortIcon('date')}
                  </button>
                </th>
                <th className="py-2 px-4 border-b text-left">
                  <button onClick={() => requestSort('time')} className="font-bold text-gray-700 flex items-center">
                    Time {getSortIcon('time')}
                  </button>
                </th>
                <th className="py-2 px-4 border-b text-left font-bold text-gray-700">Notes</th>
              </tr>
            </thead>
            <tbody>
              {client.sessions.map((session) => (
                <tr key={session.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{format(session.date, 'MMMM d, yyyy')}</td>
                  <td className="py-2 px-4 border-b">{format(session.date, 'h:mm a')}</td>
                  <td className="py-2 px-4 border-b">
                    {session.notes || <span className="text-gray-400 italic">No notes available</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default ClientSessionNotesTable;
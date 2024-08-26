import { useState, useEffect } from 'react';
import { Dialog, DialogPanel, DialogTitle, Description } from '@headlessui/react';
import moment from 'moment';
import { FaPrint, FaFileWord } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, Table, TableCell, TableRow } from 'docx';
import PropTypes from 'prop-types';

const SessionFormModal = ({ isOpen, appointmentId, onClose }) => {
  const [sessions, setSessions] = useState([]);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    // Fetch existing sessions for this appointment
    // This is a placeholder and should be replaced with actual API call
    setSessions([
      { id: 1, date: '2024-09-01', time: '14:00', notes: 'Initial session' },
      { id: 2, date: '2024-09-08', time: '14:00', notes: 'Follow-up session' },
    ]);
  }, [appointmentId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newSession = { id: sessions.length + 1, date, time, notes };
    setSessions([...sessions, newSession]);
    setDate('');
    setTime('');
    setNotes('');
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Date', 'Time', 'Notes']],
      body: sessions.map(session => [session.date, session.time, session.notes]),
    });
    doc.save('sessions.pdf');
  };

  const generateWord = () => {
    const table = new Table({
      rows: [
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph('Date')] }),
            new TableCell({ children: [new Paragraph('Time')] }),
            new TableCell({ children: [new Paragraph('Notes')] }),
          ],
        }),
        ...sessions.map(session => 
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph(session.date)] }),
              new TableCell({ children: [new Paragraph(session.time)] }),
              new TableCell({ children: [new Paragraph(session.notes)] }),
            ],
          })
        ),
      ],
    });

    const doc = new Document({
      sections: [{
        children: [
          new Paragraph('Session Details'),
          table,
        ],
      }],
    });

    Packer.toBlob(doc).then(blob => {
      saveAs(blob, 'sessions.docx');
    });
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="w-[60vw] space-y-4 border bg-white p-6 rounded-lg">
          <DialogTitle className="text-2xl font-bold mb-4">Session Form</DialogTitle>
          <Description>Manage your sessions for the appointment</Description>

          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700">Time</label>
              <input
                type="time"
                id="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </div>
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes</label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                rows="3"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
            >
              Add Session
            </button>
          </form>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sessions.map((session) => (
                  <tr key={session.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{session.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{session.time}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{session.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex justify-between">
            <div className="space-x-2">
              <button
                onClick={generatePDF}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <FaPrint className="mr-2" /> Print PDF
              </button>
              <button
                onClick={generateWord}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FaFileWord className="mr-2" /> Export to Word
              </button>
            </div>
            <button
              onClick={onClose}
              className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm"
            >
              Close
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

SessionFormModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default SessionFormModal;
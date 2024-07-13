import { useState } from 'react';
import { MdAdd, MdDownload, MdDelete } from 'react-icons/md';
import { FaEllipsisV } from 'react-icons/fa';
import { MdNote } from 'react-icons/md';
function Notes() {
    const notesList = [
        { id: 1, date: '2023-04-01', note: 'First note content that is very long and should overflow' },
        { id: 2, date: '2023-04-02', note: 'Second note content that is also quite long and needs to be truncated to fit the container width or other constraints if needed. This is the second note content that is also quite long and needs to be truncated to fit the container width or other constraints if needed.' },
        { id: 3, date: '2023-04-03', note: 'Third note content that is also quite long and needs to be truncated to fit the container width or other constraints if needed. This is the third note content that is also quite long and needs to be truncated to fit the container width or other constraints if needed. More content here and more content here and more content here and more content here and more content here.Third note content that is also quite long and needs to be truncated to fit the container width or other constraints if needed. This is the third note content that is also quite long and needs to be truncated to fit the container width or other constraints if needed. More content here and more content here and more content here and more content here and more content here.' },
        { id: 4, date: '2023-04-04', note: 'Fourth note content' },
        { id: 5, date: '2023-04-05', note: 'Fifth note content that is very long and should overflow.' },
    ];

    const [selectedNote, setSelectedNote] = useState(null);

    const handleNoteClick = (note) => {
        setSelectedNote(note);
    };

    return (
        <div>
            <div className="flex items-center p-4">
                <div className="flex space-x-4">
                    <button className="flex items-center mr-2 text-gray-700 hover:text-gray-900">
                        <MdAdd className="mr-1" /><span className="hidden sm:inline">Add</span>
                    </button>
                    <button className="flex items-center mr-2 text-gray-700 hover:text-gray-900">
                        <MdDownload className="mr-1" /><span className="hidden sm:inline">Download</span>
                    </button>
                    <button className="flex items-center text-red-500 hover:text-gray-900">
                        <MdDelete className="mr-1" /><span className="hidden sm:inline">Delete All</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 h-auto gap-4">
                <div className="flex flex-col items-center justify-start bg-gray-50 p-2 rounded-lg overflow-y-auto max-h-[270px] w-full">
                    {selectedNote ? (
                        <div className="p-2 rounded-lg w-full">
                            <p className="text-md font-bold text-gray-700 mb-2">{selectedNote.date}</p>
                            <p className="text-sm text-gray-800">{selectedNote.note}</p>
                        </div>
                    ) : (
                        <div className="text-center m-auto flex flex-col justify-center items-center p-6">
      {/* Add the notes icon to the top of the paragraph */}
      <MdNote className="text-gray-400 w-auto h-16" />
      <p className="text-sm text-gray-600 ">Select a note to view details.</p>
    </div>
                    )}
                </div>
                <div className="flex flex-col items-center justify-center rounded-lg">
                    <h3 className="text-md font-semibold mb-2">All Notes</h3>
                    <div className="overflow-y-auto max-h-60 w-full">
                        {notesList.map((note) => (
                            <button
                                key={note.id}
                                className="bg-white p-2 rounded-lg m-2 w-full text-left cursor-pointer overflow-hidden border border-gray-200 relative shadow-md"
                                onClick={() => handleNoteClick(note)}
                                style={{ maxWidth: '92%', maxHeight: '100px' }}
                            >
                                <button className="absolute top-0 right-0 p-2  text-gray-500">
                                    <FaEllipsisV />
                                </button>
                                <div className='mt-3 p-1'>
                                    <p className="text-gray-700 truncate">{note.note}</p>
                                    <p className="text-gray-600 text-sm">{note.date}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Notes;

import { useState, useEffect, useRef } from 'react';
import { MdAdd, MdDownload, MdDelete, MdNote, MdEdit, MdSave, MdClose } from 'react-icons/md';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import '../css/Notes.css';

function Notes() {
    const [notes, setNotes] = useState([]);
    const [selectedNote, setSelectedNote] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedNote, setEditedNote] = useState({ date: '', note: '' });
    const quillRef = useRef(null);

    useEffect(() => {
        const storedNotes = JSON.parse(localStorage.getItem('notes')) || [];
        setNotes(storedNotes);
    }, []);

    const saveNotesToLocalStorage = (updatedNotes) => {
        localStorage.setItem('notes', JSON.stringify(updatedNotes));
    };

    const handleAddNote = () => {
        const newNote = {
            id: Date.now(),
            date: new Date().toISOString().split('T')[0],
            note: ''
        };
        const updatedNotes = [newNote, ...notes];
        setNotes(updatedNotes);
        saveNotesToLocalStorage(updatedNotes);
        setSelectedNote(newNote);
        setIsEditing(true);
        setEditedNote(newNote);
    };

    const handleDeleteAll = () => {
        if (window.confirm('Are you sure you want to delete all notes?')) {
            setNotes([]);
            setSelectedNote(null);
            saveNotesToLocalStorage([]);
        }
    };

    const handleDeleteNote = (id) => {
        const updatedNotes = notes.filter(note => note.id !== id);
        setNotes(updatedNotes);
        saveNotesToLocalStorage(updatedNotes);
        if (selectedNote && selectedNote.id === id) {
            setSelectedNote(null);
        }
    };

    const handleNoteClick = (note) => {
        setSelectedNote(note);
        setIsEditing(false);
    };

    const handleEditClick = () => {
        setIsEditing(true);
        setEditedNote(selectedNote);
    };

    const handleSaveEdit = () => {
        const updatedNotes = notes.map(note =>
            note.id === editedNote.id ? editedNote : note
        );
        setNotes(updatedNotes);
        saveNotesToLocalStorage(updatedNotes);
        setSelectedNote(editedNote);
        setIsEditing(false);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditedNote(selectedNote);
    };

    const handleDownload = () => {
        const blob = new Blob([JSON.stringify(notes, null, 2)], { type: 'application/json' });
        const href = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = href;
        link.download = 'notes.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'image'],
            ['clean']
        ],
    };

    function stripHtml(html) {
        let tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
    }

    return (
        <div className="container mx-auto px-2 pt-4">
            <div className="flex items-center justify-between mb-2">
                <div className="flex space-x-2">
                    <button onClick={handleAddNote} className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300">
                        <MdAdd className="mr-0 lg:mr-1" /><span className="hidden sm:inline">Add Note</span>
                    </button>
                    <button onClick={handleDownload} className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300">
                        <MdDownload className="mr-0 lg:mr-1" /><span className="hidden sm:inline">Download</span>
                    </button>
                    <button onClick={handleDeleteAll} className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300">
                        <MdDelete className="mr-0 lg:mr-1" /><span className="hidden sm:inline">Delete All</span>
                    </button>
                </div>
                <div>
                    {selectedNote && isEditing ? (
                        <div>
                            <div className="justify-end space-x-2 hidden lg:flex">
                                <button
                                    onClick={handleSaveEdit}
                                    className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
                                >
                                    <MdSave className="mr-1" /> Save
                                </button>
                                <button
                                    onClick={handleCancelEdit}
                                    className="flex items-center px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition duration-300"
                                >
                                    <MdClose className="mr-1" /> Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div></div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="max-h-[300px] overflow-y-auto">
                    <h3 className="text-lg font-semibold mb-4">All Notes</h3>
                    {notes.map((note) => (
                                               <button
                            key={note.id}
                            className={`p-4 mb-4 rounded-lg cursor-pointer w-full text-left transition-all duration-200 ${selectedNote && selectedNote.id === note.id
                                ? 'bg-blue-100 border-blue-300'
                                : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
                                } border`}
                            onClick={() => handleNoteClick(note)}
                        >
                            <div className="flex justify-between items-start">
                                <p className="text-sm text-gray-600">{note.date}</p>
                                <span
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteNote(note.id);
                                    }}
                                    className="text-red-500 hover:text-red-700 cursor-pointer"
                                >
                                    <MdDelete />
                                </span>
                            </div>
                            <p className="mt-2 text-gray-800 truncate">{stripHtml(note.note)}</p>
                        </button>
                    ))}
                </div>

                <div className=" p-2 max-h-[300px] overflow-y-auto">
                    {selectedNote ? (
                        isEditing ? (
                            <div>
                                <div className="flex justify-end space-x-2 mb-4 lg:hidden">
                                    <button
                                        onClick={handleSaveEdit}
                                        className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
                                    >
                                        <MdSave className="mr-1" /> Save
                                    </button>
                                    <button
                                        onClick={handleCancelEdit}
                                        className="flex items-center px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition duration-300"
                                    >
                                        <MdClose className="mr-1" /> Cancel
                                    </button>
                                </div>
                                <ReactQuill
                                    ref={quillRef}
                                    theme="snow"
                                    value={editedNote.note}
                                    onChange={(content) => setEditedNote({ ...editedNote, note: content })}
                                    modules={modules}
                                    className="h-64 mb-12"
                                />
                            </div>
                        ) : (
                            <div className='p-2'>
                                <div className="flex justify-between items-center mb-4">
                                    <p className="text-lg font-semibold text-gray-700">{selectedNote.date}</p>
                                    <button
                                        onClick={handleEditClick}
                                        className="flex items-center p-2 text-gray-500 rounded-lg hover:bg-gray-300 transition duration-300"
                                    >
                                        <MdEdit className="mr-1" /> Edit
                                    </button>
                                </div>
                                <div className="mt-2 text-gray-800" dangerouslySetInnerHTML={{ __html: selectedNote.note }} />
                            </div>
                        )
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                            <MdNote className="text-6xl mb-4" />
                            <p>Select a note to view or edit</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Notes;
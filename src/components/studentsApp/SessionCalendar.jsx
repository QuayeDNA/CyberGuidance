import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { isSameDay } from 'date-fns';

const MeetingCalendar = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const meetingDates = [
        { date: '2024-07-05', details: 'Team meeting at 10:00 AM' },
        { date: '2024-07-10', details: 'Client presentation at 2:00 PM' },
        { date: '2024-07-15', details: 'Project review at 11:30 AM' },
        { date: '2024-07-18', details: 'Training session at 3:00 PM' },
        { date: '2024-07-25', details: 'Board meeting all day' },
    ];

    const tileClassName = ({ date }) => {
        return meetingDates.some(meeting => isSameDay(new Date(meeting.date), date)) ? 'bg-blue-500 text-white hover:bg-blue-600 cursor-pointer' : 'hover:bg-gray-100';
    };

    const getMeetingDetails = (date) => {
        const meeting = meetingDates.find(meeting => isSameDay(new Date(meeting.date), date));
        return meeting ? meeting.details : 'No meetings scheduled';
    };

    const handleDateClick = (date) => {
        setSelectedDate(date);
        const details = getMeetingDetails(date);
        alert(`Meetings on ${date.toDateString()}:\n${details}`);
    };

    return (
        <div className="max-w-full overflow-hidden rounded-lg sm:max-w-screen-md mx-auto">
            <div className="overflow-hidden rounded-lg">
                <Calendar
                    className="w-full bg-white rounded-lg shadow-md border-none text-gray-600"
                    onChange={setSelectedDate}
                    value={selectedDate}
                    tileClassName={tileClassName}
                    onClickDay={handleDateClick}
                    aria-label="Meeting Calendar"
                />
            </div>
        </div>
    );
};

export default MeetingCalendar;

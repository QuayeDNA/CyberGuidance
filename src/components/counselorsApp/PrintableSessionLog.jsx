import { forwardRef } from 'react';
import { format } from 'date-fns';
import PropTypes from 'prop-types';

const PrintableSessionLog = forwardRef(({ client, sessions }, ref) => {
  return (
    <div ref={ref} className="w-[210mm] h-[297mm] p-4 bg-gradient-to-b from-blue-100 to-purple-100 text-gray-800 font-sans text-sm">
      <div className="flex flex-col items-center mb-4 bg-white rounded-lg shadow-md p-2">
        <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg mb-2">LOGO</div>
        <div className="text-center">
          <h1 className="text-xl font-bold text-blue-600">Takoradi Technical University</h1>
          <h2 className="text-lg text-purple-600">Guidance and Counselling Centre</h2>
        </div>
      </div>

      <h3 className="text-lg font-bold mb-2 text-center bg-blue-200 py-1 rounded-lg shadow">COUNSELLING SESSION FORM</h3>

      <div className="grid grid-cols-2 gap-2 mb-4 bg-white rounded-lg shadow-md p-3 text-xs">
        <div className="col-span-2 text-sm font-semibold text-blue-600">Personal Information</div>
        <div className="flex items-center"><span className="font-semibold mr-1">Name:</span> {client.name}</div>
        <div className="flex items-center"><span className="font-semibold mr-1">I.D Card No.:</span> ________</div>
        <div className="flex items-center"><span className="font-semibold mr-1">Gender:</span> M [ ] F [ ]</div>
        <div className="flex items-center"><span className="font-semibold mr-1">Year:</span> ________</div>
        <div className="flex items-center"><span className="font-semibold mr-1">Age:</span> ________</div>
        <div className="flex items-center"><span className="font-semibold mr-1">Faculty:</span> ________</div>
        <div className="flex items-center"><span className="font-semibold mr-1">Programme:</span> ________</div>
        <div className="flex items-center"><span className="font-semibold mr-1">Religion:</span> ________</div>
        <div className="col-span-2 flex items-center">
          <span className="font-semibold mr-1">Department/Unit:</span> ________
        </div>
        <div className="col-span-2 flex items-center">
          <span className="font-semibold mr-1">Hall of Residence/Hostel:</span> ________
        </div>
        <div className="col-span-2 flex items-center">
          <span className="font-semibold mr-1">Marital Status:</span> 
          Married [ ] Single [ ] Widowed [ ] Divorced [ ]
        </div>
        <div className="col-span-2 flex items-center">
          <span className="font-semibold mr-1">Telephone Number(s):</span> ________
        </div>
      </div>

      <h4 className="text-sm font-bold mb-2 text-center bg-purple-200 py-1 rounded-lg shadow">COUNSELLING SESSIONS</h4>
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
        <table className="w-full text-xs">
          <thead className="bg-purple-500 text-white">
            <tr>
              <th className="px-2 py-1">DAY</th>
              <th className="px-2 py-1">DATE</th>
              <th className="px-2 py-1">TIME</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-purple-50' : 'bg-white'}>
                <td className="border px-2 py-1 text-center">{format(session.date, 'EEE')}</td>
                <td className="border px-2 py-1 text-center">{format(session.date, 'dd/MM/yy')}</td>
                <td className="border px-2 py-1 text-center">{format(session.date, 'HH:mm')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white rounded-lg shadow-md p-3 mb-2 text-xs">
        <p className="font-semibold mb-1">Referral:</p>
        <div className="border-b border-gray-300 mb-4"></div>
        <div className="border-b border-gray-300 mb-4"></div>
        <div className="border-b border-gray-300"></div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-3 text-xs">
        <p className="flex items-center mb-2">
          <span className="font-semibold mr-1">Counsellor on Case:</span>
          <span className="flex-grow border-b border-gray-300"></span>
        </p>
        <p className="flex items-center mb-2">
          <span className="font-semibold mr-1">Sign:</span>
          <span className="flex-grow border-b border-gray-300"></span>
        </p>
        <p className="flex items-center">
          <span className="font-semibold mr-1">Date:</span>
          <span className="flex-grow border-b border-gray-300"></span>
        </p>
      </div>
    </div>
  );
});

PrintableSessionLog.displayName = 'PrintableSessionLog';

PrintableSessionLog.propTypes = {
  client: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
  sessions: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.instanceOf(Date).isRequired,
    })
  ).isRequired,
};

export default PrintableSessionLog;
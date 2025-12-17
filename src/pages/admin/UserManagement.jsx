// components/UserManagement.jsx
import React from 'react';

const UserManagement = () => {
  const participants = [
    { name: 'Raya', role: 'Admin', email: 'TEST123@email.com' },
    { name: 'Raya', role: 'Mentor', email: 'TEST123@email.com' },
    { name: 'Raya', role: 'Mentor', email: 'TEST123@email.com' },
    { name: 'Raya', role: 'User', email: 'TEST123@email.com' },
    { name: 'Raya', role: 'User', email: 'TEST123@email.com' },
    { name: 'Raya', role: 'User', email: 'TEST123@email.com' },
    { name: 'Raya', role: 'User', email: 'TEST123@email.com' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Mandjemen Peserta</h1>
        <p className="text-gray-600 mt-2">Pengaturan dan pemeliharaan data pengguna.</p>
        <div className="h-0.5 w-full bg-gray-300 mt-4"></div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 mr-8">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Baranda</h2>
            <ul className="space-y-3">
              <li className="text-gray-700 hover:text-gray-900 cursor-pointer">Mandjemen Kelsa</li>
              <li className="font-semibold text-blue-600">Mandjemen Peserta</li>
              <li className="text-gray-700 hover:text-gray-900 cursor-pointer">Pengaturan</li>
              <li className="text-gray-700 hover:text-gray-900 cursor-pointer">Kelsar</li>
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Search People</h2>
            
            {/* Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {participants.map((participant, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{participant.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          participant.role === 'Admin' 
                            ? 'bg-red-100 text-red-800' 
                            : participant.role === 'Mentor'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {participant.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{participant.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <span className="text-gray-400">**</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
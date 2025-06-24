import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';

interface AddReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// ✅ Define the mutation once, with the same structure:
const CREATE_TEST_REPORT = gql`
  mutation CreateTestReport($input: CreateTestReportInput!) {
    createTestReport(input: $input) {
      id
      type
      date
      status
      patient {
        id
        name
        email
        phone
      }
    }
  }
`;

const AddReportModal: React.FC<AddReportModalProps> = ({ isOpen, onClose }) => {
  const [type, setType] = useState('');
  const [date, setDate] = useState('');
  const [status, setStatus] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientPhone, setPatientPhone] = useState('');

  // ✅ useMutation hook
  const [createTestReport, { loading, error }] = useMutation(CREATE_TEST_REPORT);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!type || !date || !status) {
      alert('Please fill in Type, Date, and Status.');
      return;
    }

    try {
      const { data } = await createTestReport({
        variables: {
          input: {
            type,
            date,
            status,
            patientEmail: patientEmail || null,
            patientPhone: patientPhone || null,
          },
        },
      });

      console.log('Report created:', data);
      alert('Report created successfully!');
      onClose();

      // Clear form
      setType('');
      setDate('');
      setStatus('');
      setPatientEmail('');
      setPatientPhone('');

    } catch (err) {
      console.error(err);
      alert('Failed to create report.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white text-black p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Add New Report</h2>
        <input
          type="text"
          placeholder="Report Type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full bg-white text-black border border-gray-300 rounded px-4 py-2 mb-4"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full bg-white text-black border border-gray-300 rounded px-4 py-2 mb-4"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full bg-white text-black border border-gray-300 rounded px-4 py-2 mb-4"
        >
          <option value="">Select Status</option>
          <option value="created">Created</option>
          <option value="processing">Processing</option>
          <option value="finished">Finished</option>
        </select>
        <input
          type="email"
          placeholder="Patient Email (optional)"
          value={patientEmail}
          onChange={(e) => setPatientEmail(e.target.value)}
          className="w-full bg-white text-black border border-gray-300 rounded px-4 py-2 mb-4"
        />
        <input
          type="tel"
          placeholder="Patient Phone (optional)"
          value={patientPhone}
          onChange={(e) => setPatientPhone(e.target.value)}
          className="w-full bg-white text-black border border-gray-300 rounded px-4 py-2 mb-4"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="bg-white border border-black text-black px-4 py-2 rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddReportModal;
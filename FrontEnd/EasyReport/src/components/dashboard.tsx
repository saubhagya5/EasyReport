import React, { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import AddReportModal from './AddReportModal';
import SearchFilter from './SearchFilter';
import ReportCard from './ReportCard';

export type Patient = {
  id: string;
  name: string;
  email: string;
  phone: string;
};

export type TestReport = {
  id: string;
  type: string;
  status: string;
  date: string;
  pdfUrl: string;
  patientEmail: string;
  patient: Patient | null;
};

const FILTER_REPORTS = gql`
  query FilterReports($filter: TestReportFilter) {
    filterTestReports(filter: $filter) {
      id
      type
      status
      date
      pdfUrl
      patientEmail
      patient {
        id
        name
        email
        phone
      }
    }
  }
`;

const Dashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchBy, setSearchBy] = useState('email');
  const [filters, setFilters] = useState({ type: '', date: '', status: '' });
  const [expandedReportId, setExpandedReportId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, loading, error } = useQuery<{ filterTestReports: TestReport[] }>(
    FILTER_REPORTS,
    {
      variables: {
        filter:
          searchTerm || Object.values(filters).some(v => v)
            ? {
                ...filters,
                [searchBy]: searchTerm || undefined,
              }
            : null,
      },
    }
  );

  const reports = data?.filterTestReports || [];
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">EasyReport</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-white border border-black text-black px-4 py-2 rounded hover:bg-gray-100 transition"
          >
            Add Report
          </button>
          <button
            onClick={handleLogout}
            className="bg-white border border-red-500 text-red-500 px-3 py-1 rounded hover:bg-gray-100 transition"
          >
            Logout
          </button>
        </div>
      </nav>
      <div className="p-6 space-y-6">
        {/* ✅ Search & Filter */}
        <SearchFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          searchBy={searchBy}
          setSearchBy={setSearchBy}
          filters={filters}
          setFilters={setFilters}
        />

        <button
          onClick={() => {
            setSearchTerm('');
            setSearchBy('email');
            setFilters({ type: '', date: '', status: '' });
          }}
          className="mt-2 bg-white border border-black text-black px-4 py-2 rounded hover:bg-gray-100 transition"
        >
          Reset Filters
        </button>

        <div className="space-y-4">
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">Error: {error.message}</p>}
          {reports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              expandedReportId={expandedReportId}
              setExpandedReportId={setExpandedReportId}
            />
          ))}
        </div>
      </div>

      <AddReportModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Dashboard;
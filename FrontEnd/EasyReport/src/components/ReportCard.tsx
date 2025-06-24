import React from 'react';
import { gql, useMutation, useApolloClient } from '@apollo/client';
import { TestReport } from './Dashboard';

// ✅ GraphQL mutations
const UPDATE_STATUS = gql`
  mutation UpdateStatus($id: ID!, $status: String!) {
    updateReportStatus(id: $id, status: $status) {
      id
      status
    }
  }
`;

type Props = {
  report: TestReport;
  expandedReportId: string | null;
  setExpandedReportId: (id: string | null) => void;
};

const ReportCard: React.FC<Props> = ({ report, expandedReportId, setExpandedReportId }) => {
  const [updateStatus] = useMutation(UPDATE_STATUS);
  const client = useApolloClient(); // ✅ your Apollo client (has authLink!)

  // Handle mark as processing
  const handleMarkProcessing = async () => {
    try {
      await updateStatus({
        variables: {
          id: report.id,
          status: 'processing',
        },
      });
      console.log('Status updated to processing');
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  // ✅ Use fetch for file upload to REST endpoint
  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const token = localStorage.getItem('token');

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/reports/${report.id}/upload`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token || ''}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      console.log('PDF uploaded successfully:', result.pdfUrl);
    } catch (err) {
      console.error('Failed to upload PDF:', err);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow-md text-black">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{report.patientEmail || 'No Email'}</h3>
          <p className="text-gray-700 text-sm">Status: {report.status}</p>
          <p className="text-gray-600 text-sm">
            Date: {new Date(report.date).toLocaleDateString()}
          </p>
          <p className="text-gray-500 text-sm">Type: {report.type || 'N/A'}</p>

          {report.status === 'finished' && (
            <button 
              onClick={async () => {
                try {
                  const response = await fetch(report.pdfUrl);
                  const blob = await response.blob();
                  const blobUrl = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
                  const link = document.createElement('a');
                  link.href = blobUrl;
                  link.download = `${report.type || 'report'}.pdf`;
                  document.body.appendChild(link);
                  link.click();
                  link.remove();
                  window.URL.revokeObjectURL(blobUrl);
                } catch (error) {
                  console.error('Failed to download PDF:', error);
                }
              }}
              className="mt-2 inline-block text-black bg-white border-black"
            >
              Download PDF
            </button>
          )}

          {report.status === 'created' && (
            <button
              onClick={handleMarkProcessing}
              className="mt-2 text-sm bg-white border border-yellow-500 text-yellow-500 px-3 py-1 rounded hover:bg-gray-100"
            >
              Mark as Processing
            </button>
          )}

          {report.status === 'processing' && (
            <div className="mt-2">
              <label className="block text-sm mb-1">Upload Report:</label>
              <input
                type="file"
                className="text-sm bg-white text-black"
                onChange={handlePdfUpload}
              />
            </div>
          )}
        </div>

        <button
          className="text-black bg-white border border-black text-sm px-3 py-1 rounded"
          onClick={() =>
            setExpandedReportId(
              expandedReportId === report.id ? null : report.id
            )
          }
        >
          {expandedReportId === report.id ? 'Hide' : 'Expand'} Patient Info
        </button>
      </div>

      {expandedReportId === report.id && (
        <div className="mt-4 text-sm">
          {report.patient ? (
            <>
              <p><strong>Patient Name:</strong> {report.patient.name || 'N/A'}</p>
              <p><strong>Email:</strong> {report.patient.email || 'N/A'}</p>
              <p><strong>Phone:</strong> {report.patient.phone || 'N/A'}</p>
              <p><strong>Patient ID:</strong> {report.patient.id || 'N/A'}</p>
            </>
          ) : (
            <p className="text-gray-600 italic">No patient information available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ReportCard;
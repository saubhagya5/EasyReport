import React, { useEffect, useState } from "react";

type Report = {
  id: number;
  type: string;
  date: string;
  status: string;
  pdfUrl: string;
};

const Home: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    const fetchReports = async () => {
      const res = await fetch("/api/reports");
      const data = await res.json();
      setReports(data);
    };

    fetchReports();
  }, []);

  const recentThreshold = new Date();
  recentThreshold.setDate(recentThreshold.getDate() - 30);

  const recentReports = reports.filter(
    (r) => new Date(r.date) >= recentThreshold
  );
  const previousReports = reports.filter(
    (r) => new Date(r.date) < recentThreshold
  );

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gray-100 text-black">
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">EasyReport</h1>
        <button
          onClick={handleLogout}
          className="text-red-500 bg-white border border-red-500 px-3 py-1 rounded hover:bg-red-50 transition"
        >
          Logout
        </button>
      </nav>

      <main className="max-w-3xl mx-auto p-6">
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Recent Reports</h2>
          <div className="space-y-4">
            {recentReports.length === 0 ? (
              <div className="text-gray-600">No recent reports.</div>
            ) : (
              recentReports.map((report) => (
                <div
                  key={report.id}
                  className="bg-white p-4 rounded shadow-md"
                >
                  <h3 className="text-lg font-semibold">{report.type}</h3>
                  <p className="text-gray-600 text-sm">
                    Status: {report.status}
                  </p>
                  <p className="text-gray-500 text-sm">
                    Date: {new Date(report.date).toLocaleDateString()}
                  </p>
                  {report.status === "finished" && (
                    <a
                      href={report.pdfUrl}
                      download
                      className="mt-2 inline-block text-blue-600 underline"
                    >
                      Download PDF
                    </a>
                  )}
                </div>
              ))
            )}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Previous Tests</h2>
          <div className="space-y-4">
            {previousReports.length === 0 ? (
              <div className="text-gray-600">No previous tests found.</div>
            ) : (
              previousReports.map((report) => (
                <div
                  key={report.id}
                  className="bg-white p-4 rounded shadow-md"
                >
                  <h3 className="text-lg font-semibold">{report.type}</h3>
                  <p className="text-gray-600 text-sm">
                    Status: {report.status}
                  </p>
                  <p className="text-gray-500 text-sm">
                    Date: {new Date(report.date).toLocaleDateString()}
                  </p>
                  {report.status === "finished" && (
                    <a
                      href={report.pdfUrl}
                      download
                      className="mt-2 inline-block text-blue-600 underline"
                    >
                      Download PDF
                    </a>
                  )}
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
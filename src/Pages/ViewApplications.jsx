import React, { useEffect, useState } from "react";
import { getAllApplications } from "../Api/jobApi"; // Create this function in jobApi.js
import { socket } from "../Api/socket";

const ViewApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all applications
  const fetchApplications = async () => {
    try {
      const data = await getAllApplications();
      setApplications(data);
    } catch (err) {
      console.error("Failed to fetch applications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();

    // Subscribe to real-time updates
    socket.on("jobApplicationCreated", (application) => {
      setApplications((prev) => [application, ...prev]);
    });

    return () => {
      socket.off("jobApplicationCreated");
    };
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-[#FF721F]">Job Applications</h1>
      {loading ? (
        <p>Loading applications...</p>
      ) : applications.length === 0 ? (
        <p className="text-gray-500">No applications found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border-b">#</th>
                <th className="px-4 py-2 border-b">Job ID</th>
                <th className="px-4 py-2 border-b">Name</th>
                <th className="px-4 py-2 border-b">Email</th>
                <th className="px-4 py-2 border-b">Phone</th>
                <th className="px-4 py-2 border-b">Resume</th>
                <th className="px-4 py-2 border-b">Applied On</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app, index) => (
                <tr
                  key={app._id}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-4 py-2 border-b">{index + 1}</td>
                  <td className="px-4 py-2 border-b">{app.jobId}</td>
                  <td className="px-4 py-2 border-b">{app.name}</td>
                  <td className="px-4 py-2 border-b">{app.email}</td>
                  <td className="px-4 py-2 border-b">{app.phone}</td>
                  <td className="px-4 py-2 border-b">
                    {app.resumeUrl ? (
                      <a
                        href={`${import.meta.env.VITE_BACKEND_URL}${app.resumeUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View Resume
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="px-4 py-2 border-b">
                    {new Date(app.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewApplications;

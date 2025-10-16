import React, { useEffect, useState } from "react";
import { getAllApplications } from "../Api/jobApi";
import { socket } from "../Api/socket";
import { motion, AnimatePresence } from "framer-motion";

const ResumeModal = ({ show, onClose, resumeUrl, applicantName }) => {
  if (!show) return null;

  const pdfUrl = `${import.meta.env.VITE_BACKEND_URL}${resumeUrl}`;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold text-[#FF721F]">
                {applicantName ? `${applicantName}'s Resume` : "Resume Viewer"}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-800 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            {/* PDF viewer */}
            <div className="flex-1 overflow-hidden">
              <iframe
                src={pdfUrl}
                title="Resume PDF"
                className="w-full h-full"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ViewApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showResume, setShowResume] = useState(false);
  const [selectedResume, setSelectedResume] = useState(null);
  const [selectedApplicant, setSelectedApplicant] = useState("");

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

    socket.on("jobApplicationCreated", (application) => {
      setApplications((prev) => [application, ...prev]);
    });

    return () => {
      socket.off("jobApplicationCreated");
    };
  }, []);

  const openResume = (resumeUrl, name) => {
    setSelectedResume(resumeUrl);
    setSelectedApplicant(name);
    setShowResume(true);
  };

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
                      <button
                        onClick={() => openResume(app.resumeUrl, app.name)}
                        className="text-blue-600 hover:underline"
                      >
                        View Resume
                      </button>
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

      {/* Resume Modal */}
      <ResumeModal
        show={showResume}
        onClose={() => setShowResume(false)}
        resumeUrl={selectedResume}
        applicantName={selectedApplicant}
      />
    </div>
  );
};

export default ViewApplications;

import React, { useEffect, useState, useMemo } from "react";
import { getAllApplications, updateApplicationStatus } from "../Api/jobApi";
import { socket } from "../Api/socket";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Download,
  ChevronUp,
  ChevronDown,
  X,
  FileText,
  Star,
  ChevronLeft,
  ChevronRight,
  Menu,
  MoreVertical
} from "lucide-react";

const ResumeModal = ({ show, onClose, resumeUrl, applicantName }) => {
  if (!show) return null;

  const pdfUrl = `${import.meta.env.VITE_BACKEND_URL}${resumeUrl}`;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `${applicantName || 'resume'}.pdf`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden border border-gray-200"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-[#FF721F]" />
                <h2 className="text-xl font-bold text-gray-900">
                  {applicantName ? `${applicantName}'s Resume` : "Resume Viewer"}
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#FF721F] rounded-lg hover:bg-[#E5671C] transition-colors duration-200"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* PDF viewer */}
            <div className="flex-1 overflow-hidden bg-gray-100">
              <iframe
                src={pdfUrl}
                title="Resume PDF"
                className="w-full h-full border-0"
                loading="lazy"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const MobileApplicationCard = ({ application, index, onShortlist, onViewResume }) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#FF721F] rounded-full flex items-center justify-center text-white text-sm font-semibold">
            {index}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{application.name}</h3>
            <p className="text-sm text-gray-500">Job Position: {application.position || "N/A"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onShortlist(application._id, !application.shortlisted)}
            className={`p-2 rounded-lg transition-colors duration-200 ${application.shortlisted
              ? 'text-yellow-500 bg-yellow-50'
              : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50'
              }`}
          >
            {application.shortlisted ? <Star className="w-5 h-5" /> : <Star className="w-5 h-5" />}
          </button>
          <div className="relative">
            <button
              onClick={() => setShowActions(!showActions)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
            {showActions && (
              <div className="absolute right-0 top-10 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10 min-w-[120px]">
                <button
                  onClick={() => {
                    onViewResume(application.resumeUrl, application.name);
                    setShowActions(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  View Resume
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium text-gray-600">Email:</span>
          <span className="text-gray-900">{application.email}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium text-gray-600">Phone:</span>
          <span className="text-gray-900">{application.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium text-gray-600">Applied:</span>
          <span className="text-gray-900">
            {new Date(application.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Status */}
      <div className="flex justify-between items-center">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${application.shortlisted
          ? 'bg-green-100 text-green-800 border border-green-200'
          : 'bg-gray-100 text-gray-600 border border-gray-200'
          }`}>
          {application.shortlisted ? 'Shortlisted ★' : 'Under Review'}
        </span>
        {application.resumeUrl && (
          <button
            onClick={() => onViewResume(application.resumeUrl, application.name)}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[#FF721F] bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors duration-200"
          >
            <FileText className="w-4 h-4" />
            Resume
          </button>
        )}
      </div>
    </motion.div>
  );
};

const ViewApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showResume, setShowResume] = useState(false);
  const [selectedResume, setSelectedResume] = useState(null);
  const [selectedApplicant, setSelectedApplicant] = useState("");

  // New state for enhanced features
  const [searchTerm, setSearchTerm] = useState("");
  const [jobIdFilter, setJobIdFilter] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Detect mobile screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  // Shortlist functionality
  const handleShortlist = async (applicationId, shortlisted) => {
    try {
      await updateApplicationStatus(applicationId, { shortlisted });
      setApplications(prev => prev.map(app =>
        app._id === applicationId ? { ...app, shortlisted } : app
      ));
    } catch (err) {
      console.error("Failed to update application status:", err);
    }
  };

  const [statusFilter, setStatusFilter] = useState(""); // "" = All, "shortlisted", "notShortlisted"


  // Filter and search functionality
  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
      const matchesSearch = searchTerm === "" ||
        app.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.phone?.includes(searchTerm);

      const matchesJobId = jobIdFilter === "" ||
        app.jobId?.toString().includes(jobIdFilter);

      const matchesStatus =
        statusFilter === "" ||
        (statusFilter === "shortlisted" && app.shortlisted) ||
        (statusFilter === "notShortlisted" && !app.shortlisted);

      return matchesSearch && matchesJobId && matchesStatus;
    });
  }, [applications, searchTerm, jobIdFilter, statusFilter]);

  // Sorting functionality
  const sortedApplications = useMemo(() => {
    if (!sortConfig.key) return filteredApplications;

    return [...filteredApplications].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      // Handle date sorting
      if (sortConfig.key === 'createdAt') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      // Handle string sorting
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredApplications, sortConfig]);

  // Pagination functionality
  const totalPages = Math.ceil(sortedApplications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedApplications = sortedApplications.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (key) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ?
      <ChevronUp className="w-4 h-4" /> :
      <ChevronDown className="w-4 h-4" />;
  };

  const clearFilters = () => {
    setSearchTerm("");
    setJobIdFilter("");
    setSortConfig({ key: null, direction: 'asc' });
    setCurrentPage(1);
  };

  // Pagination controls
  const PaginationControls = () => (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
      <div className="flex items-center gap-4 text-sm text-gray-600">
        <span>
          Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedApplications.length)} of{" "}
          {sortedApplications.length} applications
        </span>
        <select
          value={itemsPerPage}
          onChange={(e) => {
            setItemsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-[#FF721F] focus:border-transparent"
        >
          <option value={5}>5 per page</option>
          <option value={10}>10 per page</option>
          <option value={25}>25 per page</option>
          <option value={50}>50 per page</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let pageNum;
          if (totalPages <= 5) {
            pageNum = i + 1;
          } else if (currentPage <= 3) {
            pageNum = i + 1;
          } else if (currentPage >= totalPages - 2) {
            pageNum = totalPages - 4 + i;
          } else {
            pageNum = currentPage - 2 + i;
          }

          return (
            <button
              key={pageNum}
              onClick={() => setCurrentPage(pageNum)}
              className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors duration-200 ${currentPage === pageNum
                ? "bg-[#FF721F] text-white"
                : "border border-gray-300 text-gray-600 hover:bg-gray-50"
                }`}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Job Applications</h1>
          <p className="text-gray-600 text-sm sm:text-base">Manage and review all job applications in one place</p>
        </div>

        {/* Controls Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full">
              {/* Search Bar */}
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type="text"
                  placeholder="Search applications..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF721F] focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white text-sm sm:text-base"
                />
              </div>

              {/* Job ID Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type="text"
                  placeholder="Job ID..."
                  value={jobIdFilter}
                  onChange={(e) => {
                    setJobIdFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-9 sm:pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF721F] focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white text-sm sm:text-base min-w-[150px]"
                />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-3 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF721F] focus:border-transparent bg-gray-50 text-sm sm:text-base"
                >
                  <option value="">All</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="notShortlisted">Not Shortlisted</option>
                </select>
              </div>

            </div>

            {/* Clear Filters Button */}
            {(searchTerm || jobIdFilter || sortConfig.key) && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors duration-200 whitespace-nowrap"
              >
                <X className="w-4 h-4" />
                Clear Filters
              </button>
            )}
          </div>

          {/* Results Count */}
          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs sm:text-sm text-gray-500">
              Showing {sortedApplications.length} of {applications.length} applications
              {sortedApplications.length !== applications.length && " (filtered)"}
            </span>
            {sortedApplications.length > 0 && (
              <span className="text-xs sm:text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </span>
            )}
          </div>
        </div>

        {/* Applications Table/Cards */}
        {loading ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-[#FF721F] mx-auto mb-4"></div>
            <p className="text-gray-600 text-sm sm:text-base">Loading applications...</p>
          </div>
        ) : sortedApplications.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
            <FileText className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No applications found</h3>
            <p className="text-gray-500 text-sm sm:text-base mb-4">
              {applications.length === 0
                ? "No job applications have been submitted yet."
                : "No applications match your current filters."}
            </p>
            {(searchTerm || jobIdFilter) && (
              <button
                onClick={clearFilters}
                className="text-[#FF721F] hover:text-[#E5671C] font-medium text-sm sm:text-base"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : isMobile ? (
          // Mobile View - Cards
          <div className="space-y-4">
            {paginatedApplications.map((app, index) => (
              <MobileApplicationCard
                key={app._id}
                application={app}
                index={startIndex + index + 1}
                onShortlist={handleShortlist}
                onViewResume={openResume}
              />
            ))}
            <PaginationControls />
          </div>
        ) : (
          // Desktop View - Table
          <>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-75 border-b border-gray-200">
                    <tr>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        #
                      </th>
                      <th
                        className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-150"
                        onClick={() => handleSort('jobId')}
                      >
                        <div className="flex items-center gap-1">
                          Job Position
                          {getSortIcon('jobId')}
                        </div>
                      </th>
                      <th
                        className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-150"
                        onClick={() => handleSort('name')}
                      >
                        <div className="flex items-center gap-1">
                          Name
                          {getSortIcon('name')}
                        </div>
                      </th>
                      <th
                        className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-150"
                        onClick={() => handleSort('email')}
                      >
                        <div className="flex items-center gap-1">
                          Email
                          {getSortIcon('email')}
                        </div>
                      </th>
                      <th
                        className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-150"
                        onClick={() => handleSort('phone')}
                      >
                        <div className="flex items-center gap-1">
                          Phone
                          {getSortIcon('phone')}
                        </div>
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Resume
                      </th>
                      <th
                        className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-150"
                        onClick={() => handleSort('createdAt')}
                      >
                        <div className="flex items-center gap-1">
                          Applied On
                          {getSortIcon('createdAt')}
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginatedApplications.map((app, index) => (
                      <motion.tr
                        key={app._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.02 }}
                        className="hover:bg-gray-50 transition-colors duration-150 group"
                      >
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {startIndex + index + 1}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {app.position || "N/A"}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          {app.name}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {app.email}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {app.phone}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => handleShortlist(app._id, !app.shortlisted)}
                            className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border transition-colors duration-200 ${app.shortlisted
                              ? 'bg-amber-400 text-white  border border-amber-500'
                              : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                              }`}
                          >
                            {app.shortlisted ? <Star className="w-3 h-3" /> : <Star className="w-3 h-3" />}
                            {app.shortlisted ? 'Shortlisted' : 'Shortlist'}
                          </button>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                          {app.resumeUrl ? (
                            <button
                              onClick={() => openResume(app.resumeUrl, app.name)}
                              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[#FF721F] bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors duration-200 group-hover:bg-orange-100"
                            >
                              <FileText className="w-4 h-4" />
                              View Resume
                            </button>
                          ) : (
                            <span className="text-gray-400">N/A</span>
                          )}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(app.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <PaginationControls />
          </>
        )}

        {/* Resume Modal */}
        <ResumeModal
          show={showResume}
          onClose={() => setShowResume(false)}
          resumeUrl={selectedResume}
          applicantName={selectedApplicant}
        />
      </div>
    </div>
  );
};

export default ViewApplications;
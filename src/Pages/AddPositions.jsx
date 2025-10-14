import React, { useEffect, useState } from "react";
import { getAllJobs, createJob, updateJob, deleteJob, subscribeToJobEvents } from "../Api/jobApi";

const AddPositions = () => {
  const [jobs, setJobs] = useState([]);
  const [formData, setFormData] = useState({
    jobId: "",
    position: "",
    location: "",
    experience: "",
    pdf: null,
  });
  const [editingJobId, setEditingJobId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch jobs on mount
  useEffect(() => {
    fetchJobs();

    const unsubscribe = subscribeToJobEvents({
      onJobCreated: (job) => setJobs((prev) => [job, ...prev]),
      onJobUpdated: (job) =>
        setJobs((prev) => prev.map((j) => (j.jobId === job.jobId ? job : j))),
      onJobDeleted: (jobId) =>
        setJobs((prev) => prev.filter((j) => j.jobId !== jobId)),
    });

    return () => unsubscribe();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const data = await getAllJobs();
      setJobs(data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    if (e.target.name === "pdf") {
      setFormData({ ...formData, pdf: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("jobId", formData.jobId);
    data.append("position", formData.position);
    data.append("location", formData.location);
    data.append("experience", formData.experience);
    if (formData.pdf) data.append("pdf", formData.pdf);

    try {
      if (editingJobId) {
        await updateJob(editingJobId, data);
        setEditingJobId(null);
        alert("Job updated successfully");
      } else {
        await createJob(data);
        alert("Job created successfully");
      }
      setFormData({ jobId: "", position: "", location: "", experience: "", pdf: null });
      setShowModal(false);
      fetchJobs(); // Refresh the list
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || err.message || "Something went wrong");
    }
  };

  const handleEdit = (job) => {
    setEditingJobId(job.jobId);
    setFormData({
      jobId: job.jobId,
      position: job.position,
      location: job.location,
      experience: job.experience,
      pdf: null,
    });
    setShowModal(true);
  };

  const handleDelete = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        await deleteJob(jobId);
        alert("Job deleted successfully");
        fetchJobs(); // Refresh the list
      } catch (err) {
        alert("Failed to delete job");
      }
    }
  };

  const handleAddNew = () => {
    setEditingJobId(null);
    setFormData({ jobId: "", position: "", location: "", experience: "", pdf: null });
    setShowModal(true);
  };

  const handleViewPdf = (pdfUrl) => {
    setSelectedPdf(`${import.meta.env.VITE_BACKEND_URL}${pdfUrl}`);
    setShowPdfModal(true);
  };

  const filteredJobs = jobs.filter(job =>
    job.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.jobId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 8px 0', color: '#1f2937' }}>
              Career Positions
            </h1>
            <p style={{ color: '#6b7280', margin: 0 }}>
              Manage job openings and descriptions
            </p>
          </div>
          <button
            onClick={handleAddNew}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px'
            }}
          >
            + Add New Position
          </button>
        </div>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search positions, locations, or job IDs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            maxWidth: '400px',
            padding: '10px 16px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            fontSize: '14px'
          }}
        />
      </div>

      {/* Jobs Count */}
      <div style={{ marginBottom: '20px', color: '#6b7280', fontSize: '14px' }}>
        {filteredJobs.length} {filteredJobs.length === 1 ? 'position' : 'positions'} found
      </div>

      {/* Loading State */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '3px solid #f3f4f6', 
            borderTop: '3px solid #3b82f6', 
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px auto'
          }}></div>
          <p style={{ color: '#6b7280' }}>Loading positions...</p>
        </div>
      )}

      {/* Jobs List - Mobile Cards */}
      <div style={{ display: 'block' }}>
        {!loading && filteredJobs.map((job) => (
          <div key={job.jobId} style={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '16px',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 12px 0', color: '#1f2937' }}>
                  {job.position}
                </h3>
                
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '12px' }}>
                  <span style={{ 
                    backgroundColor: '#dbeafe', 
                    color: '#1e40af', 
                    padding: '4px 8px', 
                    borderRadius: '6px', 
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {job.jobId}
                  </span>
                  <span style={{ 
                    backgroundColor: '#dcfce7', 
                    color: '#166534', 
                    padding: '4px 8px', 
                    borderRadius: '6px', 
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {job.location}
                  </span>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ color: '#374151', fontSize: '14px' }}>Experience Required:</strong>
                  <p style={{ color: '#6b7280', margin: '4px 0 0 0', fontSize: '14px' }}>{job.experience}</p>
                </div>

                <div style={{ color: '#6b7280', fontSize: '12px', marginBottom: '12px' }}>
                  Posted on: {formatDate(job.postedOn)}
                </div>

                {job.pdfUrl && (
                  <button
                    onClick={() => handleViewPdf(job.pdfUrl)}
                    style={{
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    📄 View Job Description
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => handleEdit(job)}
                  style={{
                    backgroundColor: '#f59e0b',
                    color: 'white',
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(job.jobId)}
                  style={{
                    backgroundColor: '#ef4444',
                    color: 'white',
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {!loading && filteredJobs.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px',
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '12px'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📄</div>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
            No positions found
          </h3>
          <p style={{ color: '#6b7280', marginBottom: '20px' }}>
            {searchTerm ? "Try adjusting your search terms" : "Get started by adding your first position"}
          </p>
          {!searchTerm && (
            <button
              onClick={handleAddNew}
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              + Add New Position
            </button>
          )}
        </div>
      )}

      {/* Add/Edit Job Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            width: '100%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', margin: 0 }}>
                {editingJobId ? "Edit Position" : "Add New Position"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {!editingJobId && (
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                    Job ID *
                  </label>
                  <input
                    type="text"
                    name="jobId"
                    placeholder="e.g., DEV-001"
                    value={formData.jobId}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              )}
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                  Position Title *
                </label>
                <input
                  type="text"
                  name="position"
                  placeholder="e.g., Senior Frontend Developer"
                  value={formData.position}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    placeholder="e.g., Remote, New York"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                    Experience Required *
                  </label>
                  <input
                    type="text"
                    name="experience"
                    placeholder="e.g., 3-5 years"
                    value={formData.experience}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                  Job Description PDF
                </label>
                <input
                  type="file"
                  name="pdf"
                  accept=".pdf"
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  {editingJobId ? "Update Position" : "Add Position"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PDF Viewer Modal */}
      {showPdfModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            width: '100%',
            maxWidth: '1200px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', margin: 0 }}>
                📄 Job Description PDF
              </h2>
              <button
                onClick={() => setShowPdfModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                ×
              </button>
            </div>

            <div style={{ height: '70vh' }}>
              <iframe
                src={selectedPdf}
                style={{ width: '100%', height: '100%', border: 'none', borderRadius: '8px' }}
                title="Job Description PDF"
              />
            </div>
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default AddPositions;
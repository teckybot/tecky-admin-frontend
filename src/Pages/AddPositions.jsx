
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
    try {
      const data = await getAllJobs();
      setJobs(data);
    } catch (err) {
      console.error(err);
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
      } else {
        await createJob(data);
      }
      setFormData({ jobId: "", position: "", location: "", experience: "", pdf: null });
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
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
  };

  const handleDelete = async (jobId) => {
    if (window.confirm("Are you sure to delete this job?")) {
      await deleteJob(jobId);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{editingJobId ? "Edit Job" : "Add Position"}</h1>
      <form onSubmit={handleSubmit} className="mb-6">
        {!editingJobId && (
          <input
            type="text"
            name="jobId"
            placeholder="Job ID"
            value={formData.jobId}
            onChange={handleChange}
            required
            className="border p-2 mb-2 w-full"
          />
        )}
        <input
          type="text"
          name="position"
          placeholder="Position"
          value={formData.position}
          onChange={handleChange}
          required
          className="border p-2 mb-2 w-full"
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          required
          className="border p-2 mb-2 w-full"
        />
        <input
          type="text"
          name="experience"
          placeholder="Experience"
          value={formData.experience}
          onChange={handleChange}
          required
          className="border p-2 mb-2 w-full"
        />
        <input type="file" name="pdf" onChange={handleChange} className="mb-2" />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">
          {editingJobId ? "Update Job" : "Add Job"}
        </button>
      </form>

      <h2 className="text-xl font-bold mb-2">Jobs List</h2>
      <table className="border w-full">
        <thead>
          <tr>
            <th className="border p-2">Job ID</th>
            <th className="border p-2">Position</th>
            <th className="border p-2">Location</th>
            <th className="border p-2">Experience</th>
            <th className="border p-2">Posted On</th>
            <th className="border p-2">PDF</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.jobId}>
              <td className="border p-2">{job.jobId}</td>
              <td className="border p-2">{job.position}</td>
              <td className="border p-2">{job.location}</td>
              <td className="border p-2">{job.experience}</td>
              <td className="border p-2">{job.postedOn}</td>
              <td className="border p-2">
                {job.pdfUrl && (
                  <a href={`${import.meta.env.VITE_BACKEND_URL}${job.pdfUrl}`} target="_blank" rel="noreferrer">
                    View PDF
                  </a>
                )}
              </td>
              <td className="border p-2">
                <button
                  onClick={() => handleEdit(job)}
                  className="bg-yellow-500 text-white px-2 py-1 mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(job.jobId)}
                  className="bg-red-500 text-white px-2 py-1"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AddPositions;

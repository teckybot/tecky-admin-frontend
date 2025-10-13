import React, { useState, useEffect } from "react";
import { createJob, getAllJobs, updateJob, deleteJob, subscribeToJobEvents } from "../Api/api";

function AddPositions() {
  const [form, setForm] = useState({
    jobId: "",
    position: "",
    location: "",
    experience: "",
    pdf: null,
  });

  const [jobs, setJobs] = useState([]);

  // Fetch jobs on load
  useEffect(() => {
    loadJobs();

    // Subscribe to real-time updates
    const unsubscribe = subscribeToJobEvents({
      onJobCreated: (job) => setJobs((prev) => [job, ...prev]),
      onJobUpdated: (updatedJob) =>
        setJobs((prev) =>
          prev.map((job) => (job.jobId === updatedJob.jobId ? updatedJob : job))
        ),
      onJobDeleted: (jobId) =>
        setJobs((prev) => prev.filter((job) => job.jobId !== jobId)),
    });

    return () => unsubscribe();
  }, []);

  const loadJobs = async () => {
    try {
      const data = await getAllJobs();
      setJobs(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({ ...form, [name]: files ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      await createJob(formData);
      alert("Job added successfully!");
      setForm({
        jobId: "",
        position: "",
        location: "",
        experience: "",
        pdf: null,
      });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error adding job");
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await deleteJob(jobId);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6 text-center text-blue-600">
        Add New Job Position
      </h2>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md p-6 rounded-lg space-y-4"
      >
        <input
          type="text"
          name="jobId"
          placeholder="Job ID"
          value={form.jobId}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          name="position"
          placeholder="Position"
          value={form.position}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          name="experience"
          placeholder="Experience (e.g. 2+ years)"
          value={form.experience}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />

        <input
          type="file"
          name="pdf"
          accept="application/pdf"
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Add Job
        </button>
      </form>

      {/* Job List */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-4">All Job Positions</h3>
        {jobs.length === 0 ? (
          <p>No jobs added yet.</p>
        ) : (
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Job ID</th>
                <th className="border p-2">Position</th>
                <th className="border p-2">Location</th>
                <th className="border p-2">Experience</th>
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
                  <td className="border p-2">
                    <a
                      href={import.meta.env.VITE_API_URL.replace("/api", "") + job.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      View PDF
                    </a>
                  </td>
                  <td className="border p-2">
                    <button
                      onClick={() => handleDelete(job.jobId)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AddPositions;

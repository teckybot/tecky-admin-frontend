import axios from "axios";
import { socket } from "./socket";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/jobs",
});

const APPLICATION_API = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/job-applications",
});

// REST API functions
export const createJob = async (formData) => {
  return await API.post("/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getAllJobs = async () => {
  const res = await API.get("/");
  return res.data;
};

export const updateJob = async (jobId, formData) => {
  return await API.put(`/${jobId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteJob = async (jobId) => {
  return await API.delete(`/${jobId}`);
};

// Fetch all job applications
export const getAllApplications = async (jobId) => {
  const res = await APPLICATION_API.get("/", { params: { jobId } });
  return res.data;
};

export const updateApplicationStatus = async (id, data) => {
  const res = await APPLICATION_API.patch(`/applications/${id}/status`, data);
  return res.data;
};


// Real-time subscriptions
export const subscribeToJobEvents = (callbacks) => {
  if (!callbacks) return;

  if (callbacks.onJobCreated)
    socket.on("jobCreated", (job) => callbacks.onJobCreated(job));

  if (callbacks.onJobUpdated)
    socket.on("jobUpdated", (job) => callbacks.onJobUpdated(job));

  if (callbacks.onJobDeleted)
    socket.on("jobDeleted", (jobId) => callbacks.onJobDeleted(jobId));

  // Return unsubscribe function
  return () => {
    socket.off("jobCreated");
    socket.off("jobUpdated");
    socket.off("jobDeleted");
  };
};

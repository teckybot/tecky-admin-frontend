import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/contacts",
});

// GET all contacts
export const getAllContacts = async () => {
  const res = await API.get("/");
  return res.data;
};

// POST new contact (for form submission)
export const submitContact = async (contactData) => {
  return await axios.post(import.meta.env.VITE_API_URL + "/contact", contactData);
};

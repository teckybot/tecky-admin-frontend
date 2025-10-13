import axios from "axios";
import { socket } from "./socket.js";

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL + "/contacts" });

export const getAllContacts = () => API.get("/").then(res => res.data);
export const submitContact = (data) => API.post("/", data);

export const subscribeToContactEvents = (callbacks) => {
  if (callbacks.onContactCreated) socket.on("contactCreated", callbacks.onContactCreated);

  return () => { socket.off("contactCreated"); };
};

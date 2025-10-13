import { socket } from "./socket";

export const subscribeToContactEvents = (callbacks) => {
  if (!callbacks) return;

  if (callbacks.onContactCreated)
    socket.on("contactCreated", (contact) => callbacks.onContactCreated(contact));

  // Cleanup function
  return () => {
    socket.off("contactCreated");
  };
};

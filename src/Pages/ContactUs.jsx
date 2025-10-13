import { useEffect, useState } from "react";
import { getAllContacts, subscribeToContactEvents } from "../api/contactApi";

export default function ContactDashboard() {
  const [contacts, setContacts] = useState([]);

  // Load existing contacts
  useEffect(() => {
    fetchContacts();

    // Subscribe to real-time updates
    const unsubscribe = subscribeToContactEvents({
      onContactCreated: (contact) => setContacts((prev) => [contact, ...prev]),
    });

    return () => unsubscribe();
  }, []);

  const fetchContacts = async () => {
    const data = await getAllContacts();
    setContacts(data);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Contact Messages</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Phone</th>
            <th className="border p-2">Message</th>
            <th className="border p-2">Submitted At</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((c) => (
            <tr key={c._id}>
              <td className="border p-2">{c.name}</td>
              <td className="border p-2">{c.email}</td>
              <td className="border p-2">{c.phone}</td>
              <td className="border p-2">{c.message}</td>
              <td className="border p-2">{c.submittedAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

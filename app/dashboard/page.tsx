"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function DashboardPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/events");
      const data = await res.json();
      setEvents(data.events || []);
    } catch (err) {
      console.error("Fetch events failed", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const deleteEvent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      console.log("Deleting id:", id);
      const res = await fetch(`/api/events/${encodeURIComponent(id)}`, { method: "DELETE" });
      const body = await res.json().catch(() => ({}));

      if (!res.ok) {
        alert(body.message || `Delete failed (status ${res.status})`);
        console.error("Delete error:", body);
        return;
      }

      // Show server-side message so we can see which branch matched
      alert(body.message || "Deleted");

      // Optimistically remove from UI
      setEvents(prev => prev.filter(ev => {
        // handle cases where _id might be an object or string
        const idVal = (ev._id && typeof ev._id === "object" && ev._id.$oid) ? ev._id.$oid : ev._id;
        return idVal !== id;
      }));

    } catch (err) {
      console.error("Network error during delete", err);
      alert("Network error while deleting event. See console.");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Link href="/add-event" className="px-4 py-2 bg-blue-600 text-white rounded">Add Event</Link>
      </div>

      {loading ? <p>Loading...</p> : (
        events.length === 0 ? <p>No events found.</p> : (
          <div className="space-y-4">
            {events.map((event: any) => {
              const idVal = (event._id && typeof event._id === "object" && event._id.$oid) ? event._id.$oid : event._id;
              return (
                <div key={String(idVal)} className="border p-4 rounded flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold">{event.title}</h2>
                    <p className="text-gray-600">{event.date}</p>

                  </div>
                  <button onClick={() => deleteEvent(String(idVal))} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
                </div>
              );
            })}
          </div>
        )
      )}
    </div>
  );
}

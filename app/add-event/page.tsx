"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddEventPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Form state:
  const [form, setForm] = useState({
    title: "",
    description: "",
    overview: "",
    venue: "",
    location: "",
    date: "",
    time: "",
    mode: "",
    audience: "",
    organizer: "",
    tags: "",
    agenda: "",
    image: null as File | null,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm({ ...form, image: file });

    if (file) {
      const preview = URL.createObjectURL(file);
      setImagePreview(preview);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const fd = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        if (key === "tags" || key === "agenda") {
          fd.append(key, JSON.stringify(value.split(",").map((v) => v.trim())));
        } else if (key === "image" && value) {
          fd.append("image", value);
        } else {
          fd.append(key, value as string);
        }
      });

      const res = await fetch("/api/events", {
        method: "POST",
        body: fd,
      });

      if (res.ok) {
        router.push("/dashboard");
      } else {
        const data = await res.json();
        alert(data.message || "Failed to create event");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Add New Event</h1>

      <form className="space-y-5" onSubmit={handleSubmit}>
        {/* Title */}
        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input
            required
            name="title"
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            required
            name="description"
            onChange={handleChange}
            className="w-full p-2 border rounded"
          ></textarea>
        </div>

        {/* Overview */}
        <div>
          <label className="block mb-1 font-medium">Overview</label>
          <textarea
            required
            name="overview"
            onChange={handleChange}
            className="w-full p-2 border rounded"
          ></textarea>
        </div>

        {/* Venue */}
        <div>
          <label className="block mb-1 font-medium">Venue</label>
          <input
            required
            name="venue"
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block mb-1 font-medium">Location</label>
          <input
            required
            name="location"
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Date */}
        <div>
          <label className="block mb-1 font-medium">Date</label>
          <input
            required
            type="date"
            name="date"
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Time */}
        <div>
          <label className="block mb-1 font-medium">Time</label>
          <input
            required
            type="time"
            name="time"
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Mode */}
        <div>
          <label className="block mb-1 font-medium">Mode</label>
          <select
            required
            name="mode"
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select mode</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>

        {/* Audience */}
        <div>
          <label className="block mb-1 font-medium">Audience</label>
          <input
            required
            name="audience"
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Organizer */}
        <div>
          <label className="block mb-1 font-medium">Organizer</label>
          <input
            required
            name="organizer"
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block mb-1 font-medium">Tags (comma separated)</label>
          <input
            required
            name="tags"
            placeholder="e.g. AI, Cloud, Networking"
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Agenda */}
        <div>
          <label className="block mb-1 font-medium">Agenda (comma separated)</label>
          <input
            required
            name="agenda"
            placeholder="Intro, Keynote, Workshop"
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Image */}
        <div>
          <label className="block mb-1 font-medium">Event Image</label>
          <input
            required
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full"
          />

          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-3 w-48 h-48 object-cover rounded border"
            />
          )}
        </div>

        {/* Button */}
        <button
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {loading ? "Creating..." : "Create Event"}
        </button>
      </form>
    </div>
  );
}

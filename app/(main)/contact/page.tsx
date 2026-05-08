"use client";

import { useState } from "react";
import { Mail, MessageSquare, Send } from "lucide-react";
import toast from "react-hot-toast";
import type { Metadata } from "next";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all required fields");
      return;
    }
    setLoading(true);
    // Mock submission
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    toast.success("Message sent! We'll reply within 24 hours.");
    setForm({ name: "", email: "", subject: "", message: "" });
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-display font-bold text-3xl mb-2">Contact Us</h1>
      <p className="text-base-content/60 mb-6">
        Have a question or suggestion? We'd love to hear from you.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-7">
        {[
          { icon: <Mail size={16} />, label: "Email", val: "hello@eaglepredict.com" },
          { icon: <MessageSquare size={16} />, label: "Telegram", val: "@eaglepredict" },
          { icon: <Send size={16} />, label: "Response Time", val: "Within 24 hours" },
        ].map((c) => (
          <div key={c.label} className="bg-base-100 border border-base-300 rounded-xl p-3 text-center text-sm">
            <div className="flex justify-center text-primary mb-1">{c.icon}</div>
            <p className="font-semibold text-xs">{c.label}</p>
            <p className="text-base-content/60 text-xs mt-0.5">{c.val}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="bg-base-100 border border-base-300 rounded-2xl p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label text-xs font-semibold pb-1">Name *</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
              className="input input-bordered w-full text-sm"
            />
          </div>
          <div>
            <label className="label text-xs font-semibold pb-1">Email *</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className="input input-bordered w-full text-sm"
            />
          </div>
        </div>

        <div>
          <label className="label text-xs font-semibold pb-1">Subject</label>
          <select name="subject" value={form.subject} onChange={handleChange} className="select select-bordered w-full text-sm">
            <option value="">Select a topic</option>
            <option value="prediction">Prediction Query</option>
            <option value="site">Site Issue</option>
            <option value="advertising">Advertising</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="label text-xs font-semibold pb-1">Message *</label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Write your message..."
            rows={5}
            className="textarea textarea-bordered w-full text-sm"
          />
        </div>

        <button type="submit" className="btn btn-primary w-full sm:w-auto gap-2" disabled={loading}>
          {loading ? <span className="loading loading-spinner loading-sm" /> : <Send size={14} />}
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
}

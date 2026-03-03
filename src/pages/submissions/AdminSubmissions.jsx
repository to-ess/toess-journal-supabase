import { useEffect, useState } from "react";
import {
  getAllSubmissions,
  updateSubmission,
} from "../../services/submissionService";

export default function AdminSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [filter, setFilter] = useState("submitted");

  useEffect(() => {
    getAllSubmissions().then(setSubmissions);
  }, []);

  const filtered = submissions.filter(s =>
    filter === "all" ? true : s.status === filter
  );

  const publish = async (id) => {
    await updateSubmission(id, {
      // In the current schema, "published" is the
      // final state that makes a paper visible in
      // the public Archives.
      status: "published",
    });
    getAllSubmissions().then(setSubmissions);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">Admin Submissions</h1>

      <div className="flex gap-3 mb-6">
        {["all", "submitted", "under_review", "revision_requested", "accepted", "rejected", "published"].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold ${
              filter === s ? "bg-indigo-600 text-white" : "bg-gray-200"
            }`}
          >
            {s === "all" ? "ALL" : s.replace("_", " ").toUpperCase()}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map(p => (
          <div key={p.id} className="bg-white p-6 rounded-xl border">
            <h3 className="font-semibold">{p.title}</h3>
            <p className="text-sm text-gray-600">{p.authorEmail}</p>

            {p.status === "submitted" && (
              <div className="mt-4 flex gap-2">
                <button onClick={() => updateSubmission(p.id, { status: "revision_requested" })}>
                  Request Revision
                </button>
                <button onClick={() => updateSubmission(p.id, { status: "accepted" })}>
                  Accept
                </button>
                <button onClick={() => publish(p.id)}>
                  Publish
                </button>
                <button onClick={() => updateSubmission(p.id, { status: "rejected" })}>
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

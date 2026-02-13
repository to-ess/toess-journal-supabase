import { useEffect, useState } from "react";
import { auth } from "../../services/firebase";
import { getMySubmissions } from "../../services/submissionService";

export default function MySubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const data = await getMySubmissions(user.uid);
      setSubmissions(data);
      setLoading(false);
    };

    load();
  }, []);

  if (loading) {
    return <p className="p-10">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <h1 className="text-3xl font-bold mb-6">My Submissions</h1>

      {submissions.length === 0 ? (
        <p>No submissions found.</p>
      ) : (
        <div className="space-y-4">
          {submissions.map((s) => (
            <div
              key={s.id}
              className="bg-white p-6 rounded-xl border"
            >
              <h3 className="text-lg font-semibold">{s.title}</h3>
              <p className="text-sm text-gray-600">
                Status: <b>{s.status}</b>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

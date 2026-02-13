import { useState } from "react";
import { Mail, CheckCircle } from "lucide-react";

export default function EmailPreferences() {
  const [prefs, setPrefs] = useState({
    submissionUpdates: true,
    reviewUpdates: true,
    announcements: false,
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (key) => {
    setPrefs({ ...prefs, [key]: !prefs[key] });
    setSaved(false);
  };

  const handleSave = () => {
    // Later: save to Firestore user profile
    setSaved(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-3xl mx-auto bg-white border rounded-xl p-6">

        <h1 className="text-2xl font-bold mb-2">Email Preferences</h1>
        <p className="text-sm text-gray-600 mb-6">
          Choose which emails you want to receive from ToESS
        </p>

        {saved && (
          <div className="mb-4 flex items-center gap-2 text-green-600 text-sm">
            <CheckCircle className="w-4 h-4" />
            Preferences saved
          </div>
        )}

        <div className="space-y-4">
          {[
            {
              key: "submissionUpdates",
              label: "Submission status updates",
            },
            {
              key: "reviewUpdates",
              label: "Peer review & editorial updates",
            },
            {
              key: "announcements",
              label: "Journal announcements & calls for papers",
            },
          ].map((item) => (
            <label
              key={item.key}
              className="flex items-center justify-between p-4 border rounded-lg cursor-pointer"
            >
              <span className="text-sm font-medium">{item.label}</span>
              <input
                type="checkbox"
                checked={prefs[item.key]}
                onChange={() => handleChange(item.key)}
                className="w-5 h-5 accent-indigo-600"
              />
            </label>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}

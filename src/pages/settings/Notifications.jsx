import { useState } from "react";
import { Bell, CheckCircle } from "lucide-react";

export default function Notifications() {
  const [settings, setSettings] = useState({
    dashboardAlerts: true,
    emailAlerts: true,
    adminMessages: true,
  });

  const [saved, setSaved] = useState(false);

  const toggle = (key) => {
    setSettings({ ...settings, [key]: !settings[key] });
    setSaved(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-3xl mx-auto bg-white border rounded-xl p-6">

        <h1 className="text-2xl font-bold mb-2">Notifications</h1>
        <p className="text-sm text-gray-600 mb-6">
          Control how you receive alerts and system notifications
        </p>

        {saved && (
          <div className="mb-4 flex items-center gap-2 text-green-600 text-sm">
            <CheckCircle className="w-4 h-4" />
            Notification settings saved
          </div>
        )}

        <div className="space-y-4">
          {[
            {
              key: "dashboardAlerts",
              label: "Dashboard notifications",
            },
            {
              key: "emailAlerts",
              label: "Email notifications",
            },
            {
              key: "adminMessages",
              label: "Editorial / admin messages",
            },
          ].map((item) => (
            <label
              key={item.key}
              className="flex items-center justify-between p-4 border rounded-lg cursor-pointer"
            >
              <span className="text-sm font-medium">{item.label}</span>
              <input
                type="checkbox"
                checked={settings[item.key]}
                onChange={() => toggle(item.key)}
                className="w-5 h-5 accent-indigo-600"
              />
            </label>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={() => setSaved(true)}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}

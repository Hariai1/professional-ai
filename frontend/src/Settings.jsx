import { useEffect, useState } from "react";

const Settings = ({ userId }) => {
  const [form, setForm] = useState({ preferred_level: "CA Final", theme: "light" });

  useEffect(() => {
    if (!userId) return;
    fetch(`${import.meta.env.VITE_API_URL}/get-settings?user_id=${userId}`)
      .then(res => res.json())
      .then(data => setForm(data))
      .catch(err => console.error("Failed to load settings", err));
  }, [userId]);

  const save = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/update-settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, ...form }),
      });

      if (!res.ok) throw new Error("Save failed");
      alert("✅ Settings saved");
    } catch (err) {
      alert("❌ Failed to save settings");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">User Settings</h2>
      <div className="mb-4">
        <label className="block">Preferred Level</label>
        <select
          value={form.preferred_level}
          onChange={e => setForm({ ...form, preferred_level: e.target.value })}
          className="p-2 border rounded"
        >
          <option>CA Final</option>
          <option>CA Inter</option>
          <option>CA Foundation</option>
          <option>CMA Final</option>
          <option>CMA Inter</option>
          <option>CS Executive</option>
          <option>CS Foundation</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block">Theme</label>
        <select
          value={form.theme}
          onChange={e => setForm({ ...form, theme: e.target.value })}
          className="p-2 border rounded"
        >
          <option>light</option>
          <option>dark</option>
        </select>
      </div>

      <button onClick={save} className="bg-blue-500 text-white px-4 py-2 rounded">
        Save Settings
      </button>
    </div>
  );
};

export default Settings;

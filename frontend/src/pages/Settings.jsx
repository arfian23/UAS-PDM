import { useState, useEffect } from "react";

export default function Settings() {
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [reminderTime, setReminderTime] = useState(15);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [saved, setSaved] = useState(false);

  // Muat pengaturan tersimpan saat halaman dibuka
  useEffect(() => {
    const stored = localStorage.getItem("appSettings");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setNotifEnabled(parsed.notifEnabled ?? true);
        setReminderTime(parsed.reminderTime ?? 15);
        setSoundEnabled(parsed.soundEnabled ?? true);
      } catch (err) {
        console.error("Gagal memuat pengaturan:", err);
      }
    }
  }, []);

  function handleSave() {
    const settings = { notifEnabled, reminderTime, soundEnabled };
    localStorage.setItem("appSettings", JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">⚙ Pengaturan</h1>
        <p className="text-gray-400 mt-2">
          Sesuaikan notifikasi dan pengingat sesuai kebutuhanmu.
        </p>
      </div>

      <div className="max-w-xl bg-slate-800 border border-slate-700 rounded-xl shadow-xl p-6 space-y-6">
        {/* Aktifkan Notifikasi */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white font-medium flex items-center gap-2">
              🔔 Aktifkan Notifikasi
            </p>
            <p className="text-slate-400 text-sm mt-1">
              Terima notifikasi untuk jadwal dan tugas mendatang.
            </p>
          </div>
          <ToggleSwitch
            checked={notifEnabled}
            onChange={() => setNotifEnabled(!notifEnabled)}
          />
        </div>

        <div className="border-t border-slate-700" />

        {/* Dropdown Pengingat */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white font-medium flex items-center gap-2">
              ⏰ Waktu Pengingat
            </p>
            <p className="text-slate-400 text-sm mt-1">
              Berapa menit sebelum jadwal, pengingat akan muncul.
            </p>
          </div>
          <select
            value={reminderTime}
            onChange={(e) => setReminderTime(Number(e.target.value))}
            disabled={!notifEnabled}
            className={`bg-slate-700 border border-slate-600 text-white text-sm rounded-xl px-3 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors ${
              !notifEnabled ? "opacity-50 cursor-not-allowed" : "hover:bg-slate-600"
            }`}
          >
            <option value={5}>5 menit</option>
            <option value={10}>10 menit</option>
            <option value={15}>15 menit</option>
            <option value={30}>30 menit</option>
            <option value={60}>60 menit</option>
          </select>
        </div>

        <div className="border-t border-slate-700" />

        {/* Switch Suara */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white font-medium flex items-center gap-2">
              🔊 Suara Notifikasi
            </p>
            <p className="text-slate-400 text-sm mt-1">
              Mainkan suara saat notifikasi muncul.
            </p>
          </div>
          <ToggleSwitch
            checked={soundEnabled}
            onChange={() => setSoundEnabled(!soundEnabled)}
          />
        </div>

        <div className="border-t border-slate-700" />

        {/* Tombol Simpan */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-sm shadow-md transition-colors duration-200 flex items-center gap-2 cursor-pointer"
          >
            💾 Simpan Pengaturan
          </button>
          {saved && (
            <span className="text-green-400 text-sm font-medium animate-pulse">
              ✓ Tersimpan
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// Komponen toggle switch custom (pill shape, gaya iOS)
function ToggleSwitch({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 cursor-pointer ${
        checked ? "bg-cyan-600" : "bg-slate-600"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-200 ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}
import CalendarView from "../components/CalendarView";

export default function Calendar() {
  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          📅 Kalender Jadwal
        </h1>
        <p className="text-gray-400 mt-2">
          Semua jadwal akan ditampilkan dalam tampilan kalender.
        </p>
      </div>
      <CalendarView />
    </div>
  );
}
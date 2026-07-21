import { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./calendar-dark.css";
import { getTasks } from "../services/taskService";

const localizer = momentLocalizer(moment);

const PRIORITY_COLORS = {
  High: { bg: "#ef4444", border: "#b91c1c" },
  Medium: { bg: "#eab308", border: "#a16207" },
  Low: { bg: "#22c55e", border: "#15803d" },
};

function getPriorityColor(priority) {
  return PRIORITY_COLORS[priority] || { bg: "#06b6d4", border: "#0e7490" };
}

// Toolbar custom
function CustomToolbar({ label, view, onView, date, onNavigateDate }) {
  const views = ["month", "week", "day", "agenda"];

  function goToday() {
    onNavigateDate(new Date());
  }

  function goPrev() {
    const newDate = moment(date)
      .subtract(1, view === "month" ? "month" : view === "week" ? "week" : "day")
      .toDate();
    onNavigateDate(newDate);
  }

  function goNext() {
    const newDate = moment(date)
      .add(1, view === "month" ? "month" : view === "week" ? "week" : "day")
      .toDate();
    onNavigateDate(newDate);
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 px-1 relative z-10">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={goToday}
          className="px-4 py-2 rounded-xl bg-cyan-600 text-white text-sm font-medium hover:bg-cyan-500 transition-colors duration-200 shadow-md cursor-pointer"
        >
          Hari Ini
        </button>
        <button
          type="button"
          onClick={goPrev}
          className="px-3 py-2 rounded-xl bg-slate-700 text-slate-200 hover:bg-slate-600 transition-colors duration-200 shadow-md cursor-pointer"
        >
          ← Sebelumnya
        </button>
        <button
          type="button"
          onClick={goNext}
          className="px-3 py-2 rounded-xl bg-slate-700 text-slate-200 hover:bg-slate-600 transition-colors duration-200 shadow-md cursor-pointer"
        >
          Berikutnya →
        </button>
      </div>

      <h2 className="text-lg font-semibold text-white tracking-wide">
        {label}
      </h2>

      <div className="flex items-center gap-1 bg-slate-800 border border-slate-700 rounded-xl p-1">
        {views.map((v) => (
          <button
            type="button"
            key={v}
            onClick={() => onView(v)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors duration-200 cursor-pointer ${
              view === v
                ? "bg-cyan-600 text-white"
                : "text-slate-300 hover:bg-slate-700"
            }`}
          >
            {v === "month"
              ? "Bulan"
              : v === "week"
              ? "Minggu"
              : v === "day"
              ? "Hari"
              : "Agenda"}
          </button>
        ))}
      </div>
    </div>
  );
}

// Custom event agar tampil waktu + prioritas
function CustomEvent({ event }) {
  return (
    <div className="flex flex-col leading-tight overflow-hidden">
      <span className="font-semibold text-[11px] truncate">{event.title}</span>
      <span className="text-[10px] opacity-90">
        {moment(event.start).format("HH:mm")}–{moment(event.end).format("HH:mm")}
        {event.priority ? ` · ${event.priority}` : ""}
      </span>
    </div>
  );
}

// Custom date header (angka tanggal) — tampilkan nama libur jika ada
function CustomDateHeader({ date, label, holidays }) {
  const isSunday = date.getDay() === 0;
  const dateKey = moment(date).format("YYYY-MM-DD");
  const holidayName = holidays[dateKey] || null;
  const isRed = isSunday || holidayName;

  return (
    <div className="flex flex-col items-end px-1 pt-1">
      <span
        className={`text-xs font-semibold ${
          isRed ? "text-red-400" : "text-slate-200"
        }`}
      >
        {label}
      </span>
      {holidayName && (
        <span
          title={holidayName}
          className="text-[8px] text-red-400 font-medium truncate max-w-[80px] leading-tight"
        >
          {holidayName}
        </span>
      )}
    </div>
  );
}

export default function CalendarView() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState("month");
  const [holidays, setHolidays] = useState({}); // { "2026-01-01": "Tahun Baru Masehi" }
  const [loadedYears, setLoadedYears] = useState([]);

  useEffect(() => {
    loadEvents();
  }, []);

  // Fetch hari libur setiap kali tahun yang ditampilkan berubah
  useEffect(() => {
    const year = currentDate.getFullYear();
    if (!loadedYears.includes(year)) {
      loadHolidays(year);
    }
  }, [currentDate]);

  async function loadEvents() {
    try {
      setLoading(true);
      const data = await getTasks();
      const calendarEvents = data.map((task) => ({
        id: task.id,
        title: task.title,
        priority: task.priority,
        start: new Date(`${task.task_date}T${task.start_time}`),
        end: new Date(`${task.task_date}T${task.end_time}`),
      }));
      setEvents(calendarEvents);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function loadHolidays(year) {
    try {
      const res = await fetch(
        `https://date.nager.at/api/v3/PublicHolidays/${year}/ID`
      );
      if (!res.ok) throw new Error("Gagal mengambil data hari libur");
      const data = await res.json();

      const holidayMap = {};
      data.forEach((item) => {
        holidayMap[item.date] = item.localName;
      });

      setHolidays((prev) => ({ ...prev, ...holidayMap }));
      setLoadedYears((prev) => [...prev, year]);
    } catch (err) {
      console.error("Gagal memuat hari libur:", err);
      // Kalender tetap jalan normal walau gagal fetch holiday
    }
  }

  function eventPropGetter(event) {
    const color = getPriorityColor(event.priority);
    return {
      style: {
        backgroundColor: color.bg,
        borderLeft: `4px solid ${color.border}`,
        borderRadius: "8px",
        color: "white",
        border: "none",
        padding: "2px 6px",
      },
    };
  }

  function dayPropGetter(date) {
    const today = new Date();
    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    const isSunday = date.getDay() === 0;
    const dateKey = moment(date).format("YYYY-MM-DD");
    const holidayName = holidays[dateKey];

    if (isToday) {
      return {
        className: "rbc-today-highlight",
        style: {
          backgroundColor: "rgba(34, 211, 238, 0.15)",
          border: "2px solid #22d3ee",
        },
      };
    }

    if (holidayName) {
      return {
        style: {
          backgroundColor: "rgba(239, 68, 68, 0.18)",
          border: "1px solid rgba(239, 68, 68, 0.4)",
        },
      };
    }

    if (isSunday) {
      return {
        style: {
          backgroundColor: "rgba(239, 68, 68, 0.08)",
        },
      };
    }

    return {};
  }

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-xl">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-xl font-bold text-white">📅 Smart Calendar</h2>
        {loading && (
          <span className="text-xs text-slate-400 animate-pulse">memuat…</span>
        )}
      </div>

      <div className="rc-dark-theme h-[650px]">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "100%" }}
          date={currentDate}
          view={currentView}
          onNavigate={(newDate) => setCurrentDate(newDate)}
          onView={(newView) => setCurrentView(newView)}
          components={{
            toolbar: (props) => (
              <CustomToolbar
                {...props}
                onNavigateDate={(newDate) => setCurrentDate(newDate)}
              />
            ),
            event: CustomEvent,
            month: {
              dateHeader: (props) => (
                <CustomDateHeader {...props} holidays={holidays} />
              ),
            },
          }}
          eventPropGetter={eventPropGetter}
          dayPropGetter={dayPropGetter}
        />
      </div>

      {/* Legenda */}
      <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-slate-300">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm bg-red-500 inline-block" /> High
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm bg-yellow-500 inline-block" /> Medium
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm bg-green-500 inline-block" /> Low
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm bg-cyan-500 inline-block" /> Hari Ini
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm bg-red-500/30 border border-red-500 inline-block" />{" "}
          Minggu / Tanggal Merah
        </span>
      </div>
    </div>
  );
}
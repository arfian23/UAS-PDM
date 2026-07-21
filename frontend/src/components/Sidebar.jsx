import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const menus = [
    { icon: "💬", title: "Chat AI", path: "/" },
    { icon: "📊", title: "Dashboard", path: "/dashboard" },
    { icon: "📅", title: "Kalender", path: "/calendar" },
    { icon: "✅", title: "Jadwal", path: "/schedule" },
    { icon: "⚙️", title: "Pengaturan", path: "/settings" },
  ];

  return (
    <div className="w-72 bg-slate-950 border-r border-slate-800 flex flex-col">

      <div className="p-6">
        <h1 className="text-2xl font-bold text-white">
          🤖 Smart Scheduler
        </h1>

        <p className="text-slate-400 text-sm mt-2">
          AI Assistant
        </p>
      </div>

      <div className="px-4 space-y-2">

        {menus.map((menu) => (
          <NavLink
            key={menu.title}
            to={menu.path}
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-xl transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-white hover:bg-slate-800"
              }`
            }
          >
            <span className="text-xl">{menu.icon}</span>
            <span>{menu.title}</span>
          </NavLink>
        ))}

      </div>

      <div className="mt-auto p-5 text-slate-500 text-sm">
        Smart Scheduler AI v1.0
      </div>

    </div>
  );
}
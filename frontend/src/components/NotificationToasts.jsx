const PRIORITY_COLORS = {
  High: "border-red-500",
  Medium: "border-yellow-500",
  Low: "border-green-500",
};

export default function NotificationToasts({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 w-80">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`bg-slate-800 border-l-4 ${
            PRIORITY_COLORS[toast.priority] || "border-cyan-500"
          } border-t border-r border-b border-slate-700 rounded-xl shadow-xl p-4 animate-slide-in`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <p className="text-white font-semibold text-sm flex items-center gap-2">
                ⏰ Pengingat Jadwal
              </p>
              <p className="text-slate-200 text-sm mt-1">{toast.title}</p>
              <p className="text-slate-400 text-xs mt-1">
                Mulai pukul {toast.time}
                {toast.priority ? ` · ${toast.priority}` : ""}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="text-slate-400 hover:text-white text-lg leading-none cursor-pointer"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
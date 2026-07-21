export default function DashboardCard({
  title,
  value,
  icon,
  color,
}) {
  return (
    <div
      className="
      rounded-2xl
      p-6
      shadow-lg
      transition
      hover:scale-105
      duration-300
      bg-slate-900
      border
      border-slate-800
      "
    >
      <div className="flex justify-between items-center">

        <div>

          <p className="text-slate-400 text-sm">
            {title}
          </p>

          <h2 className="text-4xl font-bold text-white mt-3">
            {value}
          </h2>

        </div>

        <div
          className={`text-5xl ${color}`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
}
export default function AIMessageCard({
  text,
  onCopy,
  onSave,
}) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 text-white">

      <div className="whitespace-pre-wrap leading-7">
        {text}
      </div>

      <div className="flex gap-3 mt-5">

        <button
          onClick={onCopy}
          className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg"
        >
          📋 Copy
        </button>

        <button
          onClick={onSave}
          className="bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded-lg"
        >
          📅 Simpan ke Jadwal
        </button>

      </div>

    </div>
  );
}
import { useEffect, useRef, useState } from "react";
import api from "../services/api";
import { createTask } from "../services/taskService";

const STORAGE_KEY = "smart_scheduler_chat_messages";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem(STORAGE_KEY);

    if (!savedMessages) return [];

    try {
      return JSON.parse(savedMessages);
    } catch {
      return [];
    }
  });

  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const createUserMessage = (text) => ({
    id: crypto.randomUUID(),
    sender: "user",
    text,
    createdAt: new Date().toISOString(),
  });

  const createAiMessage = (text, task = null) => ({
    id: crypto.randomUUID(),
    sender: "ai",
    text,
    task,
    saved: false,
    createdAt: new Date().toISOString(),
  });

  const sendMessage = async () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage || loading) return;

    const userMessage = createUserMessage(trimmedMessage);

    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setLoading(true);

    try {
      const response = await api.post("/graph/chat", {
        message: trimmedMessage,
      });

      const aiMessage = createAiMessage(
        response.data.response || "Tidak ada respons dari AI.",
        response.data.task || null
      );

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);

      const errorMessage = createAiMessage("❌ Gagal terhubung ke server.");

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      window.alert("Jawaban berhasil disalin.");
    } catch {
      window.alert("Gagal menyalin jawaban.");
    }
  };

  const saveTask = async (messageId, task) => {
    try {
      await createTask(task);

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? {
                ...msg,
                saved: true,
              }
            : msg
        )
      );

      window.alert("✅ Jadwal berhasil disimpan.");
    } catch (err) {
      console.error(err);
      window.alert("❌ Gagal menyimpan jadwal.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-white">
          🤖 Smart Scheduler AI
        </h1>

        <p className="text-slate-400 mt-2">
          Asisten penjadwalan berbasis Gemini, RAG, dan LangGraph.
        </p>
      </div>

      <div className="flex-1 bg-slate-900 rounded-2xl border border-slate-800 p-6 overflow-y-auto">
        {messages.length === 0 && !loading && <EmptyChat />}

        <div className="space-y-5">
          {messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              msg={msg}
              onCopy={copyText}
              onSaveTask={saveTask}
            />
          ))}
        </div>

        {loading && <LoadingBubble />}

        <div ref={messagesEndRef} />
      </div>

      <div className="mt-5 flex gap-3">
        <textarea
          className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-5 py-4 text-white outline-none focus:border-cyan-500 resize-none min-h-[58px] max-h-40"
          placeholder="Tulis perintah atau pertanyaan..."
          value={message}
          rows={1}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />

        <button
          onClick={sendMessage}
          disabled={loading || !message.trim()}
          className={`text-white px-8 rounded-xl transition ${
            loading || !message.trim()
              ? "bg-cyan-900 cursor-not-allowed opacity-60"
              : "bg-cyan-600 hover:bg-cyan-700"
          }`}
        >
          Kirim
        </button>

        <button
          onClick={clearChat}
          disabled={messages.length === 0 && !loading}
          className={`text-white px-6 rounded-xl transition ${
            messages.length === 0 && !loading
              ? "bg-red-900 cursor-not-allowed opacity-60"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          Hapus
        </button>
      </div>
    </div>
  );
}

function EmptyChat() {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl text-white font-semibold">
          Selamat Datang 👋
        </h2>

        <p className="text-slate-400 mt-3">Contoh:</p>

        <div className="mt-6 space-y-3">
          <ExamplePrompt text="Jadwalkan rapat besok pukul 09.00" />
          <ExamplePrompt text="Buat jadwal belajar Machine Learning" />
          <ExamplePrompt text="Kapan waktu terbaik untuk presentasi?" />
        </div>
      </div>
    </div>
  );
}

function ExamplePrompt({ text }) {
  return (
    <div className="bg-slate-800 rounded-xl p-4 text-slate-300">
      {text}
    </div>
  );
}

function MessageBubble({ msg, onCopy, onSaveTask }) {
  const isUser = msg.sender === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[75%] rounded-2xl p-5 ${
          isUser
            ? "bg-blue-600 text-white"
            : "bg-slate-800 border border-slate-700 text-white"
        }`}
      >
        <p className="whitespace-pre-wrap">{msg.text}</p>

        {msg.task && <TaskCard task={msg.task} />}

        {!isUser && (
          <div className="flex gap-3 mt-4 flex-wrap">
            <button
              onClick={() => onCopy(msg.text)}
              className="bg-slate-700 hover:bg-slate-600 px-3 py-2 rounded-lg text-sm"
            >
              📋 Copy
            </button>

            {msg.task && (
              <button
                onClick={() => onSaveTask(msg.id, msg.task)}
                disabled={msg.saved}
                className={`px-3 py-2 rounded-lg text-sm transition ${
                  msg.saved
                    ? "bg-emerald-700 cursor-not-allowed opacity-80"
                    : "bg-cyan-600 hover:bg-cyan-700"
                }`}
              >
                {msg.saved ? "✅ Sudah Disimpan" : "📅 Simpan ke Jadwal"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function TaskCard({ task }) {
  return (
    <div className="mt-4 bg-slate-900 rounded-xl border border-slate-700 p-4">
      <h3 className="font-semibold text-cyan-400 mb-2">
        Jadwal yang dibuat AI
      </h3>

      <div className="space-y-1 text-sm">
        <p>
          <b>Judul:</b> {task.title || "-"}
        </p>

        <p>
          <b>Tanggal:</b> {task.task_date || "-"}
        </p>

        <p>
          <b>Jam:</b> {task.start_time || "-"} - {task.end_time || "-"}
        </p>

        <p>
          <b>Durasi:</b> {task.duration || "-"} menit
        </p>

        <p>
          <b>Prioritas:</b> {task.priority || "-"}
        </p>
      </div>
    </div>
  );
}

function LoadingBubble() {
  return (
    <div className="mt-5 flex justify-start">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 w-fit text-white flex items-center gap-3">
        <span className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <span>AI sedang berpikir...</span>
      </div>
    </div>
  );
}

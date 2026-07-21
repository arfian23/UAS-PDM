import { useEffect, useRef, useState, useCallback } from "react";
import { getTasks } from "../services/taskService";

export default function useNotificationScheduler() {
  const notifiedTasksRef = useRef(new Set());
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    const interval = setInterval(checkSchedules, 30000);
    checkSchedules();

    return () => clearInterval(interval);
  }, []);

  async function checkSchedules() {
    const settings = getSettings();
    if (!settings.notifEnabled) return;

    try {
      const tasks = await getTasks();
      const now = new Date();

      tasks.forEach((task) => {
        const taskId = task.id;
        if (notifiedTasksRef.current.has(taskId)) return;

        const startTime = new Date(`${task.task_date}T${task.start_time}`);
        const reminderMs = settings.reminderTime * 60 * 1000;
        const notifyAt = new Date(startTime.getTime() - reminderMs);

        if (now >= notifyAt && now <= startTime) {
          triggerNotification(task, settings);
          notifiedTasksRef.current.add(taskId);
        }
      });
    } catch (err) {
      console.error("Gagal cek jadwal notifikasi:", err);
    }
  }

  function triggerNotification(task, settings) {
    // 1. Notifikasi sistem Windows/browser
    if ("Notification" in window && Notification.permission === "granted") {
      const notif = new Notification("⏰ Pengingat Jadwal", {
        body: `${task.title} akan dimulai pukul ${task.start_time}`,
        icon: "/favicon.ico",
        tag: `task-${task.id}`,
      });
      notif.onclick = () => {
        window.focus();
        notif.close();
      };
    }

    // 2. Toast popup di dalam web
    addToast(task);

    // 3. Suara
    if (settings.soundEnabled) {
      playNotificationSound();
    }
  }

  function addToast(task) {
    const toastId = `${task.id}-${Date.now()}`;
    const newToast = {
      id: toastId,
      title: task.title,
      time: task.start_time,
      priority: task.priority,
    };

    setToasts((prev) => [...prev, newToast]);

    // Otomatis hilang setelah 8 detik
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== toastId));
    }, 8000);
  }

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  function playNotificationSound() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();

      oscillator.connect(gain);
      gain.connect(ctx.destination);

      oscillator.frequency.value = 880;
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

      oscillator.start();
      oscillator.stop(ctx.currentTime + 0.4);
    } catch (err) {
      console.error("Gagal memutar suara notifikasi:", err);
    }
  }

  function getSettings() {
    const stored = localStorage.getItem("appSettings");
    if (!stored) {
      return { notifEnabled: true, reminderTime: 15, soundEnabled: true };
    }
    try {
      return JSON.parse(stored);
    } catch {
      return { notifEnabled: true, reminderTime: 15, soundEnabled: true };
    }
  }

  return { toasts, dismissToast };
}
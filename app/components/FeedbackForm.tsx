"use client";

import { useState } from "react";

type FormState = "idle" | "submitting" | "success";

export default function FeedbackForm() {
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("umum");
  const [state, setState] = useState<FormState>("idle");
  const maxChars = 500;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    setState("submitting");
    // TODO: Hubungkan ke API route / database
    await new Promise((r) => setTimeout(r, 800));
    setState("success");
    setMessage("");
    setCategory("umum");
  }

  if (state === "success") {
    return (
      <div className="flex flex-col items-center text-center gap-3 py-10">
        <span className="w-12 h-12 rounded-pill bg-black  text-white text-xl font-semibold flex items-center justify-center">
          ✓
        </span>
        <p className="text-lg font-semibold text-ink m-0">Terima kasih!</p>
        <p className="text-sm text-body m-0">Feedback kamu sudah kami terima secara anonim.</p>
        <button
          className="text-sm font-medium text-black bg-transparent border-none cursor-pointer px-4 py-2 outline-none hover:bg-black hover:text-white transition-colors mt-2"
          onClick={() => setState("idle")}
        >
          Kirim feedback lagi
        </button>
      </div>
    );
  }

  const inputClass =
    "w-full bg-canvas border border-hairline rounded-button px-4 py-1.5 text-base text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary-soft transition-colors disabled:opacity-60 disabled:cursor-not-allowed";

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
      {/* Kategori */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="feedback-category" className="text-sm font-medium text-ink">
          Kategori
        </label>
        <select
          id="feedback-category"
          className={inputClass + " h-10 cursor-pointer appearance-none"}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          disabled={state === "submitting"}
        >
          <option value="umum">Umum</option>
          <option value="kegiatan">Kegiatan</option>
          <option value="fasilitas">Fasilitas</option>
          <option value="saran">Saran &amp; Kritik</option>
          <option value="lainnya">Lainnya</option>
        </select>
      </div>

      {/* Pesan */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="feedback-message" className="text-sm font-medium text-ink">
          Pesan
        </label>
        <textarea
          id="feedback-message"
          className={inputClass + " resize-y min-h-[120px]"}
          placeholder="Tulis feedback kamu di sini... Identitas kamu akan tetap anonim."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={maxChars}
          rows={5}
          disabled={state === "submitting"}
          required
        />
        <span className="text-xs text-muted text-right">
          {message.length}/{maxChars}
        </span>
      </div>

      <button
        type="submit"
        disabled={state === "submitting" || !message.trim()}
        className="self-start bg-black text-white text-base font-medium px-6 py-1.5 h-10 cursor-pointer border-none hover:bg-black/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {state === "submitting" ? "Mengirim..." : "Kirim"}
      </button>

      <p className="text-xs text-muted m-0">Kami tidak menyimpan identitas pengirim.</p>
    </form>
  );
}

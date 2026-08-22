"use client";

import { useActionState, useEffect, useRef } from "react";
import { submitFeedbackAction, FeedbackState } from "@/app/action/feedback/action";

const initialState: FeedbackState = { success: false, error: "", fieldErrors: {} };
const CATEGORIES = ["Saran", "Kritik", "Pertanyaan", "Lainnya"] as const;

export default function FeedbackForm() {
  const [state, formAction, pending] = useActionState<FeedbackState, FormData>(
    submitFeedbackAction,
    initialState
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  if (state.success) {
    return (
      <div className="flex flex-col items-center text-center gap-3 py-10">
        <span className="w-12 h-12 rounded-full bg-zinc-900 text-white text-xl font-semibold flex items-center justify-center">
          ✓
        </span>
        <p className="text-lg font-semibold text-zinc-900 m-0">Terima kasih!</p>
        <p className="text-sm text-zinc-500 m-0">Feedback kamu sudah kami terima secara anonim.</p>
        <button
          className="text-sm font-medium text-zinc-900 bg-transparent border-none cursor-pointer px-4 py-2 outline-none hover:bg-zinc-100 rounded-md transition-colors mt-2"
          onClick={() => window.location.reload()}
        >
          Kirim feedback lagi
        </button>
      </div>
    );
  }

  const inputClass =
    "w-full bg-white border border-zinc-200 rounded-md px-4 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-colors disabled:opacity-60 disabled:cursor-not-allowed";

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-4" noValidate>
      {state.error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {state.error}
        </div>
      )}

      {/* Kategori */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="feedback-category" className="text-sm font-medium text-zinc-900">
          Kategori <span className="text-red-500">*</span>
        </label>
        <select
          id="feedback-category"
          name="category"
          className={inputClass + " h-10 cursor-pointer appearance-none"}
          disabled={pending}
          defaultValue="Saran"
        >
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        {state.fieldErrors.category?.[0] && (
          <p className="text-xs text-red-500">{state.fieldErrors.category[0]}</p>
        )}
      </div>

      {/* Pesan */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="feedback-message" className="text-sm font-medium text-zinc-900">
          Pesan <span className="text-red-500">*</span>
        </label>
        <textarea
          id="feedback-message"
          name="message"
          className={inputClass + " resize-y min-h-[120px]"}
          placeholder="Tulis feedback kamu di sini... Identitas kamu akan tetap anonim."
          disabled={pending}
          rows={5}
        />
        {state.fieldErrors.message?.[0] && (
          <p className="text-xs text-red-500">{state.fieldErrors.message[0]}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-md bg-zinc-900 text-white text-sm font-medium px-6 py-2.5 cursor-pointer hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {pending ? "Mengirim..." : "Kirim Feedback"}
      </button>

      <p className="text-xs text-zinc-400 m-0">Kami tidak menyimpan identitas pengirim.</p>
    </form>
  );
}

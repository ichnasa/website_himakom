"use client";

import { useFormStatus } from "react-dom";

export default function SubmitButton() {
    const { pending,data } = useFormStatus();
    
    return (
        <button type="submit" disabled={pending} className="w-full text-white bg-black hover:bg-neutral-800 focus:ring-4 focus:outline-none focus:ring-neutral-300 font-medium text-sm px-5 py-2.5 text-center transition-colors">
            {pending ? "Loading..." : "Submit"}
        </button>
    );
}
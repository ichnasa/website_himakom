"use client"

import { useActionState } from "react";
import { loginAction } from "./action";
import SubmitButton from "../components/SubmitButton";

const initialState = {
    error: ""
}

export default function Login() {
    const [state, formAction, pending] = useActionState(loginAction, initialState);

    return (
        <>
            <section className="bg-gray-50">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                                Masuk ke akun anda
                            </h1>
                            {state?.error && (
                                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded">
                                    {state.error}
                                </div>
                            )}
                            <form action={formAction} className="space-y-4 md:space-y-6">
                                <div>
                                    <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900">Username</label>
                                    <input type="text" name="username" id="username" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="name@gmail.com" required />
                                </div>
                                <div>
                                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Password</label>
                                    <input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" required />
                                </div>
                                <SubmitButton />
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
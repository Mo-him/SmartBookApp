"use client"

import { useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function Home() {

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            if (data.session) {
                window.location.href = "/dashboard"
            }
        })
    }, [])

    const login = async () => {
        await supabase.auth.signInWithOAuth({
            provider: "google",
        })
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-6 text-center">

                <h1 className="text-2xl font-bold text-gray-800">
                    Smart Bookmark App
                </h1>

                <p className="text-gray-500 text-sm">
                    Save and manage your bookmarks securely
                </p>

                <button
                    onClick={login}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium cursor-pointer"
                >
                    Continue with Google
                </button>

            </div>
        </div>
    )
}

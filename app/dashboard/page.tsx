"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function Dashboard() {
    const [bookmarks, setBookmarks] = useState<any[]>([])
    const [title, setTitle] = useState("")
    const [url, setUrl] = useState("")
    const [userId, setUserId] = useState<string | null>(null)

    useEffect(() => {
        initialize()
    }, [])

    const initialize = async () => {
        const { data: sessionData } = await supabase.auth.getSession()

        if (!sessionData.session) {
            window.location.href = "/"
            return
        }

        const uid = sessionData.session.user.id
        setUserId(uid)

        await fetchBookmarks(uid)

        // 🔥 Realtime only for current user
        const channel = supabase
            .channel("realtime-bookmarks")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "bookmarks",
                    filter: `user_id=eq.${uid}`,
                },
                () => fetchBookmarks(uid)
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }

    const fetchBookmarks = async (uid: string) => {
        const { data, error } = await supabase
            .from("bookmarks")
            .select("*")
            .eq("user_id", uid)
            .order("created_at", { ascending: false })

        if (!error) {
            setBookmarks(data || [])
        }
    }

    const addBookmark = async () => {
        if (!userId || !title || !url) return

        const { error } = await supabase.from("bookmarks").insert({
            title,
            url,
            user_id: userId,
        })

        if (!error) {
            setTitle("")
            setUrl("")
            fetchBookmarks(userId) // immediate UI update
        }
    }

    const deleteBookmark = async (id: string) => {
        if (!userId) return

        const { error } = await supabase
            .from("bookmarks")
            .delete()
            .eq("id", id)

        if (!error) {
            fetchBookmarks(userId)
        }
    }

    const logout = async () => {
        await supabase.auth.signOut()
        window.location.href = "/"
    }

    return (
        <div className="min-h-screen bg-gray-100 py-10">
            <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-md space-y-6">

                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800">Smart Bookmarks App</h1>
                    <button
                        onClick={logout}
                        className="px-3 py-1 bg-red-500 text-white rounded cursor-pointer"
                    >
                        Logout
                    </button>
                </div>

                <div className="space-y-3">
                    <input
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Bookmark Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    <input
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="https://example.com"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                    />

                    <button
                        onClick={addBookmark}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
                    >
                        Add Bookmark
                    </button>
                </div>

                <div className="space-y-3">
                    {bookmarks.map((b) => (
                        <div
                            key={b.id}
                            className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border"
                        >
                            <a
                                href={b.url}
                                target="_blank"
                                className="text-blue-600 hover:underline"
                            >
                                {b.title}
                            </a>

                            <button
                                onClick={() => deleteBookmark(b.id)}
                                className="text-red-500 hover:text-red-700 cursor-pointer"
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>

    )
}

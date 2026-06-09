"use client";

import { createComment } from "@/actions/comments";
import { useState } from "react";

export default function CommentForm({ postId }: { postId: string }) {
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleAction(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsPending(true);
        setError(null);
        const formData = new FormData(e.currentTarget);
        try {
            await createComment(postId, formData);
            (e.target as HTMLFormElement).reset();
        } catch (err: any) {
            setError(err.message || "Failed to post comment");
        } finally {
            setIsPending(false);
        }
    }

    return (
        <form onSubmit={handleAction} className="mt-8 flex items-start gap-4">
            <div className="flex-grow">
                {error && <div className="text-red-500 text-xs mb-2">{error}</div>}
                <input
                    type="text"
                    name="content"
                    required
                    placeholder="Add a comment..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-sm"
                />
            </div>
            <button
                type="submit"
                disabled={isPending}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-full shadow-sm transition-all disabled:opacity-70 text-sm whitespace-nowrap"
            >
                {isPending ? "..." : "Reply"}
            </button>
        </form>
    );
}

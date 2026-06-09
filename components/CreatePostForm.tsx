"use client";

import { createPost } from "@/actions/posts";
import { useState } from "react";

export default function CreatePostForm({ onSuccess, onCancel }: { onSuccess?: () => void, onCancel?: () => void }) {
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleAction(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsPending(true);
        setError(null);
        const formData = new FormData(e.currentTarget);
        try {
            await createPost(formData);
            (e.target as HTMLFormElement).reset();
            if (onSuccess) onSuccess();
        } catch (err: any) {
            setError(err.message || "Failed to create post");
        } finally {
            setIsPending(false);
        }
    }

    return (
        <form onSubmit={handleAction} className="space-y-4">
            {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded">{error}</div>}

            <div>
                <input
                    type="text"
                    name="title"
                    required
                    placeholder="Give your post a catchy title..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                />
            </div>

            <div>
                <textarea
                    name="content"
                    required
                    rows={4}
                    placeholder="Share your thoughts with the community..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition resize-none"
                ></textarea>
            </div>

            <div className="flex justify-end gap-3 pt-2">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-2 border border-gray-300 bg-white text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
                    >
                        Cancel
                    </button>
                )}
                <button
                    type="submit"
                    disabled={isPending}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg shadow-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isPending ? "Posting..." : "Publish Post"}
                </button>
            </div>
        </form>
    );
}

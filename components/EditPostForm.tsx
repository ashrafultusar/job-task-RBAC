"use client";

import { updatePost } from "@/actions/posts";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EditPostForm({ post }: { post: { id: string; title: string; content: string; } }) {
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    async function handleAction(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsPending(true);
        setError(null);
        const formData = new FormData(e.currentTarget);
        try {
            await updatePost(post.id, formData);
            router.push(`/post/${post.id}`);
            router.refresh();
        } catch (err: any) {
            setError(err.message || "Failed to update post");
        } finally {
            setIsPending(false);
        }
    }

    return (
        <form onSubmit={handleAction} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">Edit Post</h3>
            {error && <div className="text-red-500 text-sm bg-red-50 p-3 mb-4 rounded">{error}</div>}

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                        type="text"
                        name="title"
                        required
                        defaultValue={post.title}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-black outline-none transition"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                    <textarea
                        name="content"
                        required
                        rows={6}
                        defaultValue={post.content}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-black outline-none transition resize-none"
                    ></textarea>
                </div>
            </div>

            <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
                <button
                    type="button"
                    onClick={() => router.push(`/post/${post.id}`)}
                    className="px-6 py-2 border border-gray-300 bg-white text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isPending}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg shadow-sm transition disabled:opacity-70"
                >
                    {isPending ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </form>
    );
}

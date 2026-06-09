"use client";

import { createComment } from "@/actions/comments";
import { useState } from "react";


interface CommentFormProps {
    postId: string;
    parentCommentId?: string;
    onCancel?: () => void;
}

export default function CommentForm({ postId, parentCommentId, onCancel }: CommentFormProps) {
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
            onCancel?.();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to post comment");
        } finally {
            setIsPending(false);
        }
    }

    return (
        <form onSubmit={handleAction} className="mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full">
            <div className="flex-grow w-full">
                {error && <div className="text-red-500 text-xs mb-2">{error}</div>}
                {parentCommentId && <input type="hidden" name="parentCommentId" value={parentCommentId} />}
                <input
                    type="text"
                    name="content"
                    required
                    placeholder={parentCommentId ? "Write a reply..." : "Add a comment..."}
                    className="w-full px-5 py-2.5 bg-white border border-slate-200 rounded-full focus:ring-2 focus:ring-indigo-500
                    text-slate-800 placeholder-slate-400 focus:border-indigo-500 outline-none transition text-sm shadow-sm"
                />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="text-slate-500 font-medium py-2.5 px-4 rounded-full text-sm hover:bg-slate-100 transition-all w-full sm:w-auto"
                    >
                        Cancel
                    </button>
                )}
                <button
                    type="submit"
                    disabled={isPending}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-6 rounded-full shadow-md shadow-indigo-200 transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 text-sm whitespace-nowrap w-full sm:w-auto"
                >
                    {isPending ? "..." : (parentCommentId ? "Reply" : "Post")}
                </button>
            </div>
        </form>
    );
}
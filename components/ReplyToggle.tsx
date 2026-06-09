"use client";

import { useState } from "react";
import CommentForm from "./CommentForm";

export default function ReplyToggle({ postId, parentCommentId }: { postId: string, parentCommentId: string }) {
    const [show, setShow] = useState(false);

    if (!show) {
        return (
            <button onClick={() => setShow(true)} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors mt-3 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                </svg>
                Reply
            </button>
        );
    }

    return (
        <div className="mt-4 border-l-2 border-indigo-100 pl-4 py-1">
            <CommentForm postId={postId} parentCommentId={parentCommentId} onCancel={() => setShow(false)} />
        </div>
    );
}

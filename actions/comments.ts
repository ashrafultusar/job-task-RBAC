"use server";

import { auth } from "@/auth";
import Comment from "@/models/Comment";
import { connectDB } from "@/db/dbConfig";
import { revalidatePath } from "next/cache";

export async function createComment(postId: string, formData: FormData) {
    const session = await auth();
    if (!session || !session.user) {
        throw new Error("Unauthorized");
    }

    const role = session.user.role;
    // Guest cannot create comments
    if (role === "guest") {
        throw new Error("Guests are not allowed to create comments");
    }

    const content = formData.get("content") as string;
    const parentCommentId = formData.get("parentCommentId") as string | null;

    await connectDB();
    await Comment.create({
        content,
        post: postId,
        author: session.user.id,
        parentComment: parentCommentId || null,
    });

    revalidatePath(`/post/${postId}`);
    return { success: true };
}

export async function deleteComment(commentId: string, postId: string) {
    const session = await auth();
    if (!session || !session.user) {
        throw new Error("Unauthorized");
    }

    const role = session.user.role;
    const userId = session.user.id;

    // Guest cannot delete comments
    if (role === "guest") {
        throw new Error("Guests are not allowed to delete comments");
    }

    await connectDB();
    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new Error("Comment not found");
    }

    if (role === "user") {
        const Post = (await import("@/models/Post")).default;
        const post = await Post.findById(comment.post);
        const isCommentOwner = comment.author.toString() === userId;
        const isPostOwner = post && post.author.toString() === userId;

        if (!isCommentOwner && !isPostOwner) {
            throw new Error("You can only delete your own comments or comments on your posts");
        }
    }

    // Moderator and Super Admin bypass the ownership check
    await Comment.findByIdAndDelete(commentId);

    // Cascade delete any nested replies
    await Comment.deleteMany({ parentComment: commentId });

    revalidatePath(`/post/${postId}`);
    return { success: true };
}

"use server";

import { auth } from "@/auth";
import Post from "@/models/Post";
import { connectDB } from "@/db/dbConfig";
import { revalidatePath } from "next/cache";

export async function createPost(formData: FormData) {
    const session = await auth();
    if (!session || !session.user) {
        throw new Error("Unauthorized");
    }

    const role = session.user.role;
    // Guest cannot create posts
    if (role === "guest") {
        throw new Error("Guests are not allowed to create posts");
    }

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;

    await connectDB();
    await Post.create({
        title,
        content,
        author: session.user.id,
    });

    revalidatePath("/posts"); // Assuming /posts is the route
    return { success: true };
}

export async function deletePost(postId: string) {
    const session = await auth();
    if (!session || !session.user) {
        throw new Error("Unauthorized");
    }

    const role = session.user.role;
    const userId = session.user.id;

    // Guest cannot delete posts
    if (role === "guest") {
        throw new Error("Guests are not allowed to delete posts");
    }

    await connectDB();
    const post = await Post.findById(postId);

    if (!post) {
        throw new Error("Post not found");
    }

    // Regular users can only delete their own posts
    if (role === "user") {
        if (post.author.toString() !== userId) {
            throw new Error("You can only delete your own posts");
        }
    }

    // Moderators and Super Admins can delete any post 
    // (the above condition handles the restriction for users)

    await Post.findByIdAndDelete(postId);
    revalidatePath("/posts");
    return { success: true };
}

export async function updatePost(postId: string, formData: FormData) {
    const session = await auth();
    if (!session || !session.user) {
        throw new Error("Unauthorized");
    }

    const role = session.user.role;
    const userId = session.user.id;

    // Guest cannot update posts
    if (role === "guest") {
        throw new Error("Guests are not allowed to update posts");
    }

    await connectDB();
    const post = await Post.findById(postId);

    if (!post) {
        throw new Error("Post not found");
    }

    // Even moderators cannot update other users' posts if we restrict it, 
    // but let's say only the creator can update the post
    if (post.author.toString() !== userId) {
        // Typically, moderators only delete. Let's restrict update to Owner only
        throw new Error("You can only update your own posts");
    }

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;

    post.title = title || post.title;
    post.content = content || post.content;
    await post.save();

    revalidatePath("/posts");
    return { success: true };
}

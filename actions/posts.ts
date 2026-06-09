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

    revalidatePath("/posts");
    return { success: true };
}

export async function deletePost(postId: string) {
    const session = await auth();
    if (!session || !session.user) {
        throw new Error("Unauthorized");
    }

    const role = session.user.role;
    const userId = session.user.id;

    if (role === "guest") {
        throw new Error("Guests are not allowed to delete posts");
    }

    await connectDB();
    const post = await Post.findById(postId);

    if (!post) {
        throw new Error("Post not found");
    }

    if (role === "user") {
        if (post.author.toString() !== userId) {
            throw new Error("You can only delete your own posts");
        }
    }

   

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

    if (role === "guest") {
        throw new Error("Guests are not allowed to update posts");
    }

    await connectDB();
    const post = await Post.findById(postId);

    if (!post) {
        throw new Error("Post not found");
    }

    
    if (post.author.toString() !== userId) {
       
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

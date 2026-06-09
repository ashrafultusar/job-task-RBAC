import Post from "@/models/Post";
import { connectDB } from "@/db/dbConfig";
import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import EditPostForm from "@/components/EditPostForm";
import { Types } from "mongoose";

interface LeanPostDoc {
    _id: Types.ObjectId;
    title: string;
    content: string;
    author: Types.ObjectId;
}

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const id = resolvedParams.id;

    await connectDB();
    const session = await auth();

    if (!session || !session.user) {
        redirect("/login");
    }

    const post = await Post.findById(id).lean<LeanPostDoc>();

    if (!post) {
        notFound();
    }

    if (post.author.toString() !== session.user.id) {
        redirect(`/post/${post._id.toString()}`);
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <EditPostForm post={{
                id: post._id.toString(),
                title: post.title,
                content: post.content
            }} />
        </div>
    );
}
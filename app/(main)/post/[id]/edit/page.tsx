import Post from "@/models/Post";
import { connectDB } from "@/db/dbConfig";
import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import EditPostForm from "@/components/EditPostForm";

export default async function EditPostPage({ params }: { params: { id: string } }) {
    await connectDB();
    const session = await auth();

    if (!session || !session.user) {
        redirect("/login");
    }

    const rawPost = await Post.findById(params.id).lean();

    if (!rawPost) {
        notFound();
    }

    const post: any = rawPost;

    // The strict role policy states only Owners can edit their own posts. 
    // It does not explicitly mention Moderators editing. We will restrict it strictly to owners.
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

import Post from "@/models/Post";
import User from "@/models/User";
import { connectDB } from "@/db/dbConfig";
import { auth } from "@/auth";
import Link from "next/link";
import CreatePostModal from "@/components/CreatePostModal";
import DeleteActionButton from "@/components/DeleteActionButton";

export default async function PostsPage() {
  const session = await auth();
  const role = session?.user?.role;
  const userId = session?.user?.id;

  await connectDB();
  const posts = await Post.find()
    .populate({ path: "author", model: User, select: "name email" })
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 cursor-pointer">Community Feed</h1>
        
      {role !== "guest" && session && <CreatePostModal />}
      </div>


      <div className="space-y-6 mt-8">
        {posts.map((postRaw: any) => {
          const post: any = postRaw;
          const isOwner = post.author._id.toString() === userId;
          const canDelete =
            role === "super_admin" || role === "moderator" || isOwner;

          return (
            <div
              key={post._id.toString()}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <Link
                  href={`/post/${post._id.toString()}`}
                  className="block group"
                >
                  <h2 className="text-2xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {post.title}
                  </h2>
                  <p className="mt-2 text-gray-600 line-clamp-3 leading-relaxed">
                    {post.content}
                  </p>
                </Link>

                {canDelete && (
                  <DeleteActionButton id={post._id.toString()} type="post" />
                )}
              </div>
              <div className="flex items-center gap-2 mt-4 text-sm text-gray-500 border-t pt-4 border-gray-100">
                <div className="flex items-center gap-1 font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded">
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  {post.author?.name}
                </div>
                <span>•</span>
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          );
        })}
        {posts.length === 0 && (
          <div className="text-center py-20 text-gray-500 bg-white rounded-xl shadow-sm border border-gray-100">
            No posts found. Start interacting by creating one!
          </div>
        )}
      </div>
    </div>
  );
}

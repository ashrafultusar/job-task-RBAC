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

  const Comment = (await import("@/models/Comment")).default;
  const postsWithComments = await Promise.all(
    posts.map(async (postRaw: any) => {
      const post: any = postRaw;
      const commentsCount = await Comment.countDocuments({ post: post._id });
      const comments = await Comment.find({ post: post._id })
        .populate({ path: "author", model: User, select: "name email" })
        .sort({ createdAt: -1 })
        .limit(3)
        .lean();
      return { ...post, comments, commentsCount };
    })
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 cursor-pointer">Community Feed</h1>
        {role !== "guest" && session && <CreatePostModal />}
      </div>

      {/* Posts Feed */}
      <div className="space-y-6 mt-8">
        {postsWithComments.map((postRaw: any) => {
          const post: any = postRaw;
          const isOwner = post.author._id.toString() === userId;
          const canDelete =
            role === "super_admin" || role === "moderator" || isOwner;

          return (
            <div
              key={post._id.toString()}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow flex flex-col"
            >
              {/* ১. পোস্টের মূল বডি (Title & Content) */}
              <div className="flex justify-between items-start">
                <Link
                  href={`/post/${post._id.toString()}`}
                  className="block group flex-1 mr-4"
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

              {/* ২. অথর ইনফো এবং ডেট (এখন কমেন্টের উপরে চলে এসেছে) */}
              <div className="flex items-center gap-2 mt-4 text-sm text-gray-500 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-1 font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded">
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  {post.author?.name}
                </div>
                <span>•</span>
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>

              {/* ৩. কমেন্ট সেকশন (কার্ডের একদম নিচে/সর্বশেষে) */}
              <div className="mt-4">
                {post.comments && post.comments.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Recent Comments</h4>
                    <div className="space-y-3">
                      {post.comments.map((comment: any) => (
                        <div key={comment._id.toString()} className="bg-gray-50 rounded-lg p-3 text-sm border border-gray-100">
                          <div className="flex gap-2 items-center mb-1">
                            <span className="font-semibold text-gray-900">{comment.author?.name}</span>
                            <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {post.commentsCount > 3 ? (
                  <Link href={`/post/${post._id.toString()}`} className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                    View all {post.commentsCount} comments / details
                  </Link>
                ) : (
                  <Link href={`/post/${post._id.toString()}`} className="text-sm text-gray-500 hover:text-gray-700 font-medium flex items-center gap-1 w-max">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.38-.494 2.651-2.072 3.869-2.072 3.869s1.884-.367 3.535-1.121A8.956 8.956 0 0012 20.25z" />
                    </svg>
                    Add a comment
                  </Link>
                )}
              </div>

            </div>
          );
        })}
        {postsWithComments.length === 0 && (
          <div className="text-center py-20 text-gray-500 bg-white rounded-xl shadow-sm border border-gray-100">
            No posts found. Start interacting by creating one!
          </div>
        )}
      </div>
    </div>
  );
}
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
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="h-10 w-2.5 rounded-full bg-indigo-600 shadow-sm shadow-indigo-300"></div>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">Community Feed</h1>
        </div>
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
              className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] transition-all duration-300 group/card relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500 transform scale-x-0 group-hover/card:scale-x-100 transition-transform origin-left duration-300"></div>

              <div className="flex justify-between items-start">
                <Link
                  href={`/post/${post._id.toString()}`}
                  className="block group flex-1 mr-4"
                >
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {post.title}
                  </h2>
                  <p className="mt-3 text-slate-600 line-clamp-3 leading-relaxed text-[15px]">
                    {post.content}
                  </p>
                </Link>

                {canDelete && (
                  <DeleteActionButton id={post._id.toString()} type="post" />
                )}
              </div>

              <div className="flex items-center gap-3 mt-5 text-sm text-slate-500 pb-5 border-b border-slate-100">
                <div className="flex items-center gap-2 font-medium text-slate-800 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-full">
                  <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-bold">
                    {post.author?.name[0]?.toUpperCase()}
                  </div>
                  {post.author?.name}
                </div>
                <span>•</span>
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>

              <div className="mt-5">
                {post.comments && post.comments.length > 0 && (
                  <div className="mb-5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.38-.494 2.651-2.072 3.869-2.072 3.869s1.884-.367 3.535-1.121A8.956 8.956 0 0012 20.25z" />
                      </svg>
                      Recent Activity
                    </h4>
                    <div className="space-y-3 border-l-2 border-indigo-100 pl-4 ml-2">
                      {post.comments.map((comment: any) => (
                        <div key={comment._id.toString()} className="bg-slate-50/70 rounded-xl p-3.5 text-sm border border-slate-100">
                          <div className="flex gap-2 items-center mb-1.5">
                            <span className="font-bold text-slate-800">{comment.author?.name}</span>
                            <span className="text-xs font-medium text-slate-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{comment.content}</p>
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
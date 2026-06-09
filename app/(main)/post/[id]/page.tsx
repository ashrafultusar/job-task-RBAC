import Post from "@/models/Post";
import Comment from "@/models/Comment";
import User from "@/models/User";
import { connectDB } from "@/db/dbConfig";
import { auth } from "@/auth";
import { notFound } from "next/navigation";
import CommentForm from "@/components/CommentForm";
import DeleteActionButton from "@/components/DeleteActionButton";
import Link from "next/link";

export default async function PostDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  await connectDB();
  const session = await auth();
  const role = session?.user?.role;
  const userId = session?.user?.id;

  const rawPost = await Post.findById(params.id)
    .populate({ path: "author", model: User, select: "name email" })
    .lean();

  if (!rawPost) {
    notFound();
  }

  const post: any = rawPost;

  const comments = await Comment.find({ post: params.id })
    .populate({ path: "author", model: User, select: "name email" })
    .sort({ createdAt: 1 })
    .lean();

  const isPostOwner = post.author._id.toString() === userId;
  const canDeletePost =
    role === "super_admin" || role === "moderator" || isPostOwner;
  const canEditPost = role === "user" && isPostOwner;
  const isUpdatableByThisUser = isPostOwner;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Post Article */}
      <article className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8 relative">
        <div className="flex justify-between items-start gap-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center gap-2">
            {isUpdatableByThisUser && (
              <Link
                href={`/post/${post._id.toString()}/edit`}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center shadow-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-4 text-gray-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                  />
                </svg>
              </Link>
            )}
            {canDeletePost && (
              <DeleteActionButton id={post._id.toString()} type="post" />
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm text-gray-600 mb-8 border-b pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
              {(post.author as any).name[0]?.toUpperCase()}
            </div>
            <span className="font-semibold text-gray-800">
              {(post.author as any).name}
            </span>
          </div>
          <span>•</span>
          <time dateTime={new Date(post.createdAt).toISOString()}>
            {new Date(post.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </div>

        <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
          {post.content}
        </div>
      </article>

      {/* Comments Section */}
      <section className="bg-gray-50 rounded-2xl p-6 md:p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Discussion ({comments.length})
        </h3>

        <div className="space-y-6">
          {comments.map((commentRaw: any) => {
            const comment: any = commentRaw;
            const isCommentOwner = comment.author._id.toString() === userId;
            const canDeleteComment =
              role === "super_admin" ||
              role === "moderator" ||
              isCommentOwner ||
              isPostOwner;

            return (
              <div
                key={comment._id.toString()}
                className="flex gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100"
              >
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex-shrink-0 flex items-center justify-center text-indigo-700 font-bold text-xs mt-1">
                  {comment.author.name[0]?.toUpperCase()}
                </div>
                <div className="flex-grow">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-gray-900 text-sm">
                      {comment.author.name}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </div>
                {canDeleteComment && (
                  <DeleteActionButton
                    id={comment._id.toString()}
                    postId={post._id.toString()}
                    type="comment"
                  />
                )}
              </div>
            );
          })}

          {comments.length === 0 && (
            <p className="text-center text-gray-500 italic py-4">
              Be the first to share your thoughts!
            </p>
          )}
        </div>

        {/* Comment Form */}
        {role !== "guest" && session && (
          <CommentForm postId={post._id.toString()} />
        )}
      </section>
    </div>
  );
}

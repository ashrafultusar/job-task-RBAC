import Post from "@/models/Post";
import Comment from "@/models/Comment";
import User from "@/models/User";
import { connectDB } from "@/db/dbConfig";
import { auth } from "@/auth";
import { notFound } from "next/navigation";
import CommentForm from "@/components/CommentForm";
import DeleteActionButton from "@/components/DeleteActionButton";
import Link from "next/link";
import ReplyToggle from "@/components/ReplyToggle";
import { Types } from "mongoose";

interface PopulatedAuthor {
  _id: Types.ObjectId;
  name: string;
  email: string;
}

interface LeanPostDoc {
  _id: Types.ObjectId;
  title: string;
  content: string;
  createdAt: Date | string;
  author: PopulatedAuthor; 
}

interface LeanCommentDoc {
  _id: Types.ObjectId;
  post: Types.ObjectId;
  content: string;
  createdAt: Date | string;
  author: PopulatedAuthor; 
  parentComment?: Types.ObjectId;
}

export default async function PostDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  await connectDB();
  const session = await auth();
  const role = session?.user?.role;
  const userId = session?.user?.id;

  const post = await Post.findById(id)
    .populate({ path: "author", model: User, select: "name email" })
    .lean<LeanPostDoc | null>();

  if (!post) {
    notFound();
  }

  const comments = await Comment.find({ post: id })
    .populate({ path: "author", model: User, select: "name email" })
    .sort({ createdAt: 1 })
    .lean<LeanCommentDoc[]>();

  const isPostOwner = post.author._id.toString() === userId;
  const canDeletePost =
    role === "super_admin" || role === "moderator" || isPostOwner;
  const isUpdatableByThisUser = isPostOwner;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Post Article */}
      <article className="bg-white p-8 lg:p-12 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 mb-8 relative">
        <div className="flex justify-between items-start gap-4 mb-8">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
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

        <div className="flex items-center gap-3 text-sm text-slate-500 mb-10 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 px-4 py-2 rounded-2xl">
            <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold shadow-inner">
              {post.author.name?.[0]?.toUpperCase() || "?"}
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Written By
              </span>
              <span className="font-bold text-slate-800 text-sm leading-tight">
                {post.author.name}
              </span>
            </div>
          </div>
          <span>•</span>
          <time dateTime={new Date(post.createdAt).toISOString()}>
            {new Date(post.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              }
            )}
          </time>
        </div>

        <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
          {post.content}
        </div>
      </article>

      {/* Comments Section */}
      <section className="bg-slate-50/50 rounded-3xl p-6 md:p-10 border border-slate-100 mb-10">
        <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-2">
          Discussion
          <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-bold">
            {comments.length}
          </span>
        </h3>

        <div className="space-y-6">
          {comments
            .filter((c) => !c.parentComment)
            .map((comment) => {
              const isCommentOwner = comment.author._id.toString() === userId;
              const canDeleteComment =
                role === "super_admin" ||
                role === "moderator" ||
                isCommentOwner ||
                isPostOwner;

              const commentReplies = comments.filter(
                (c) => c.parentComment?.toString() === comment._id.toString()
              );

              return (
                <div
                  key={comment._id.toString()}
                  className="flex flex-col gap-3"
                >
                  <div className="flex gap-4 p-5 bg-white rounded-2xl shadow-sm border border-slate-100 group/comment transition-all hover:shadow-md">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 flex-shrink-0 flex items-center justify-center text-indigo-600 font-black text-sm mt-0.5">
                      {comment.author.name?.[0]?.toUpperCase() || "?"}
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-slate-900 text-[15px]">
                          {comment.author.name}
                        </span>
                        <span className="text-xs font-medium text-slate-400">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-slate-600 leading-relaxed text-[15px] whitespace-pre-wrap">
                        {comment.content}
                      </p>

                      {/* Inline Reply Form Toggle */}
                      {role !== "guest" && session && (
                        <ReplyToggle
                          postId={post._id.toString()}
                          parentCommentId={comment._id.toString()}
                        />
                      )}
                    </div>

                    {canDeleteComment && (
                      <DeleteActionButton
                        id={comment._id.toString()}
                        postId={post._id.toString()}
                        type="comment"
                      />
                    )}
                  </div>

                  {/* Nested Replies Section */}
                  {commentReplies.length > 0 && (
                    <div className="ml-8 md:ml-14 space-y-3 mt-1">
                      {commentReplies.map((reply) => {
                        const isReplyOwner = reply.author._id.toString() === userId;
                        const canDeleteReply =
                          role === "super_admin" ||
                          role === "moderator" ||
                          isReplyOwner ||
                          isPostOwner;

                        return (
                          <div
                            key={reply._id.toString()}
                            className="flex gap-4 p-4 bg-slate-50/80 rounded-2xl border border-slate-100 transition-all hover:shadow-sm relative"
                          >
                            <div className="absolute -left-6 md:-left-8 top-6 w-6 h-5 border-l-2 border-b-2 border-indigo-200 rounded-bl-xl origin-bottom"></div>

                            <div className="w-8 h-8 rounded-full bg-white border border-indigo-100 flex-shrink-0 flex items-center justify-center text-indigo-600 font-black text-xs shadow-sm">
                              {reply.author.name?.[0]?.toUpperCase() || "?"}
                            </div>

                            <div className="flex-grow">
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="font-bold text-slate-800 text-sm">
                                  {reply.author.name}
                                </span>
                                <span className="text-xs font-medium text-slate-400">
                                  {new Date(reply.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-slate-600 leading-relaxed text-[14px] whitespace-pre-wrap">
                                {reply.content}
                              </p>
                            </div>

                            {canDeleteReply && (
                              <DeleteActionButton
                                id={reply._id.toString()}
                                postId={post._id.toString()}
                                type="comment"
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

          {comments.length === 0 && (
            <p className="text-center text-slate-500 font-medium py-10 bg-white shadow-sm rounded-2xl border border-slate-100 border-dashed">
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
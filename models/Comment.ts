import mongoose, { Schema, Document, Model } from "mongoose";

export interface IComment extends Document {
    content: string;
    post: mongoose.Types.ObjectId;
    author: mongoose.Types.ObjectId;
    parentComment?: mongoose.Types.ObjectId | null;
    createdAt: Date;
    updatedAt: Date;
}

const CommentSchema: Schema<IComment> = new mongoose.Schema(
    {
        content: {
            type: String,
            required: [true, "Please provide comment content"],
        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            required: true,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        parentComment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const Comment: Model<IComment> =
    mongoose.models?.Comment || mongoose.model<IComment>("Comment", CommentSchema);

export default Comment;

import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPost extends Document {
    title: string;
    content: string;
    author: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const PostSchema: Schema<IPost> = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Please provide a title"],
        },
        content: {
            type: String,
            required: [true, "Please provide content"],
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Post: Model<IPost> =
    mongoose.models?.Post || mongoose.model<IPost>("Post", PostSchema);

export default Post;

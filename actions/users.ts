"use server";

import { auth } from "@/auth";
import User from "@/models/User";
import { connectDB } from "@/db/dbConfig";
import { revalidatePath } from "next/cache";

export async function deleteUserActivity(targetUserId: string) {
    const session = await auth();
    if (!session || !session.user) {
        throw new Error("Unauthorized");
    }

    const role = session.user.role;

    // Only super_admin can manage users
    if (role !== "super_admin") {
        throw new Error("Forbidden: Only Super Admin can delete users");
    }

    await connectDB();
    const user = await User.findById(targetUserId);

    if (!user) {
        throw new Error("User not found");
    }

    // Optionally delete all posts and comments by this user
    // await Post.deleteMany({ author: targetUserId });
    // await Comment.deleteMany({ author: targetUserId });

    await User.findByIdAndDelete(targetUserId);
    revalidatePath("/admin");
    return { success: true };
}

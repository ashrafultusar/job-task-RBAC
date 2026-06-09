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

    if (role !== "super_admin") {
        throw new Error("Forbidden: Only Super Admin can delete users");
    }

    await connectDB();
    const user = await User.findById(targetUserId);

    if (!user) {
        throw new Error("User not found");
    }


    await User.findByIdAndDelete(targetUserId);
    revalidatePath("/admin");
    return { success: true };
}

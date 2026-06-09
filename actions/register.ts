"use server";

import User from "@/models/User";
import { connectDB } from "@/db/dbConfig";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export async function registerUser(formData: FormData) {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const role = (formData.get("role") as "user" | "guest" | "moderator" | "super_admin") || "user";

    if (!email || !password || !name) {
        throw new Error("Missing required fields");
    }

    await connectDB();
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new Error("Email is already in use");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
        name,
        email,
        password: hashedPassword,
        role,
    });

    redirect("/login");
}

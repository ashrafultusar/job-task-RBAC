/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { connectDB } from "@/db/dbConfig";

async function getUser(email: string) {
  try {
    await connectDB();
    const user = await User.findOne({ email }).select("+password");
    return user;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user || !user.password) return null;

          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch)
            return {
              id: user._id.toString(),
              name: user.name,
              email: user.email,
              role: user.role,
            };
        }

        console.log("Invalid credentials");
        return null;
      },
    }),
  ],
  secret: process.env.AUTH_SECRET,
});
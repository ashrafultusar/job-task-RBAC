import { auth, signOut } from "@/auth";
import Link from "next/link";

export default async function Navbar() {
    const session = await auth();

    return (
        <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center gap-6">
                        <Link href="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                            RBAC Platform
                        </Link>

                        {session && (
                            <div className="hidden md:flex gap-4">
                                <Link href="/posts" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">
                                    Feed
                                </Link>
                                {session?.user?.role === "super_admin" && (
                                    <Link href="/users" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">
                                        Manage Users
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        {session ? (
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                                    {session.user.role.toUpperCase()}
                                </span>
                                <span className="text-sm text-gray-600 border-r pr-4 border-gray-300">
                                    {session.user.name}
                                </span>
                                <form
                                    action={async () => {
                                        "use server";
                                        await signOut({ redirectTo: "/login" });
                                    }}
                                >
                                    <button type="submit" className="text-sm font-medium text-red-600 hover:text-red-500 transition-colors">
                                        Log out
                                    </button>
                                </form>
                            </div>
                        ) : (
                            <div className="flex gap-3">
                                <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-indigo-600 px-3 py-2">
                                    Log in
                                </Link>
                                <Link href="/register" className="text-sm font-medium bg-indigo-600 text-white rounded-lg px-4 py-2 hover:bg-indigo-700 transition">
                                    Sign up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

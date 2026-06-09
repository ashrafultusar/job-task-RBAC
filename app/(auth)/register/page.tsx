import RegisterForm from "@/components/RegisterForm";

export default function RegisterPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden p-8 space-y-6">
                <div className="text-center">
                    <h1 className="text-3xl font-extrabold text-gray-900">Create an Account</h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Select your role to test the RBAC capabilities.
                    </p>
                </div>
                <RegisterForm />
            </div>
        </div>
    );
}

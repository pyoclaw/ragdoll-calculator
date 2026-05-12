import { SignupForm } from "./SignupForm";

export const metadata = {
  title: "Sign Up — Ragdoll Breeder Tools",
};

export default function SignupPage() {
  return (
    <main className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Create your account
          </h1>
          <p className="text-sm text-gray-600 mb-6">
            Track your cats, save crosses, and plan litters in one place.
          </p>
          <SignupForm />
        </div>
      </div>
    </main>
  );
}

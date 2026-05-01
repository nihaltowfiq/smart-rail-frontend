import { SignupForm } from "@/components/SignupForm";
import { Ticket } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <div className="relative min-h-[calc(100vh-65px)] w-full overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-gradient-to-br from-blue-200 to-purple-300 opacity-20 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-gradient-to-tr from-purple-200 to-blue-200 opacity-20 blur-3xl" />

      <div className="relative flex min-h-[calc(100vh-65px)] w-full items-center justify-center px-4 py-8 md:px-6">
        <div className="w-full max-w-md space-y-6">
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 p-3 shadow-lg">
              <Ticket className="h-8 w-8 text-white" />
            </div>
            <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">
              SmartRail
            </h1>
            <p className="mt-2 text-gray-600">Join millions booking smarter</p>
          </div>

          <SignupForm />

          <div className="space-y-4 text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-gradient-to-br from-blue-50 via-white to-purple-50 px-2 text-gray-500">
                  Already have an account?
                </span>
              </div>
            </div>
            <Link href="/signin">
              <button className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 py-2.5 font-medium text-white transition-all hover:from-blue-700 hover:to-purple-700 active:scale-95">
                Sign in
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

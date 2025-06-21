import { auth } from "@/auth"; // Adjust path if needed
import { redirect } from "next/navigation";
import { SignInForm } from "../components/SignInForm";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard"); // 🔁 Redirect logged-in users
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-6">
      <div className="max-w-2xl text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Welcome to PlanPilot 🚀
        </h1>
        <p className="text-xl text-gray-700 mb-8">
          Your mission control for projects, kanban boards, and real-time
          collaboration.
        </p>
        <SignInForm />
      </div>
    </main>
  );
}

import { signIn } from "../auth";
export function SignInForm() {
  const handleFormAction = async (formData) => {
    "use server";
    await signIn("mailgun", formData);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <form
        action={handleFormAction}
        className="bg-white shadow-md rounded-lg p-6 w-full max-w-md flex flex-col gap-4"
      >
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          className="border border-gray-300 p-2 rounded-md"
          required
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
        >
          Sign in with Mailgun
        </button>
      </form>
    </div>
  );
}

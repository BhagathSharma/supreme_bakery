import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }) {
  const session = await auth();
  console.log("Session in DashboardLayout:", session);
  if (!session?.user) redirect("/");

  return <>{children}</>;
}

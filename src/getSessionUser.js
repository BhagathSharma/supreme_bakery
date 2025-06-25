import { auth } from "@/auth";
import { prisma } from "@/prisma";
export async function getSessionUser() {
  const session = await auth();

  const email = session?.user?.email;

  if (!email) throw new Error("No email in session");

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) throw new Error("User not found in DB");

  return user;
}

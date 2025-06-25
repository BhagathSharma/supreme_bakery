import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/prisma";
import Mailgun from "next-auth/providers/mailgun";
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Mailgun({
      from: process.env.MAIL_SENDER,
      apiKey: process.env.MAIL_KEY,
    }),
  ],
});

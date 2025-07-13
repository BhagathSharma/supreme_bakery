# 🧭 PlanPilot – A Simple Project Management Tool
[![codecov](https://codecov.io/gh/BhagathSharma/supreme_bakery/branch/main/graph/badge.svg)](https://codecov.io/gh/BhagathSharma/supreme_bakery)
**PlanPilot** is a college project built using [Next.js](https://nextjs.org) with PostgreSQL via Prisma and email-based authentication using Mailgun. This is a starter-friendly project focused on functionality over production security.

---

## ⚙️ Tech Stack

* **Framework:** Next.js (App Router)
* **Database:** PostgreSQL
* **ORM:** Prisma
* **Auth:** NextAuth.js + Mailgun Email Login
* **Package Manager:** pnpm

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
pnpm install
```

---

### 2. Set up your database

Add your PostgreSQL connection string to `.env`:

```env
DATABASE_URL=your postgres
```

Run the database migration:

```bash
pnpm exec prisma migrate dev
```

---

### 3. Configure authentication

Add this to `.env`:

```env
AUTH_SECRET="secret"
NEXTAUTH_URL=http://localhost:3000
```

Authentication is configured in `src/auth.js` using Mailgun:

```js
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/prisma";
import Mailgun from "next-auth/providers/mailgun";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Mailgun({
      from: "your sender",
      apiKey: "your api key",
    }),
  ],
});
```



---

### 4. Start the development server

```bash
pnpm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the app.





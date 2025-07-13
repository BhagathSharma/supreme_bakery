# PlanPilot – A Simple Project Management Tool  
[![codecov](https://codecov.io/gh/BhagathSharma/supreme_bakery/branch/main/graph/badge.svg)](https://codecov.io/gh/BhagathSharma/supreme_bakery)

---

## Introduction

**OUTAKE Studios** is a creative production house specializing in:

- Wedding planning, photography, and videography  
- Commercial advertisements and promotional videos  
- Graphic design and computer-generated (CG) visuals  

Based in India and operating internationally, OUTAKE Studios works with a network of passionate freelancers. The studio’s commitment is not just business—it’s about delivering outstanding creative quality and customer satisfaction.

Location: [Google Maps](https://share.google/uNoDUzLHFSPFFDFMS)

---

## Project Goal

The goal of **PlanPilot** is to deliver a clean, focused project management tool tailored for small teams and creative agencies like OUTAKE Studios.

It helps:

- Organize and track tasks using a Kanban-style board  
- Support role-based collaboration (PMs, Contributors, Viewers)  
- Provide secure, email-based authentication using magic links  
- Automate testing and reporting for maintainability

---

## Tech Stack

- **Framework:** Next.js (App Router)
- **Database:** PostgreSQL (hosted on Aiven.io)
- **ORM:** Prisma
- **Authentication:** Auth.js (Magic link) + Mailgun
- **UI Library:** MUI (migrated from Tailwind CSS)
- **Data Fetching:** React Query
- **Notifications:** Sonner Toast
- **Testing:** Jest
- **CI/CD:** GitHub Actions + Codecov
- **Deployment:** Vercel

---

## Getting Started

### 1. Install dependencies

```bash
pnpm install
````

---

### 2. Set up your database

Add your PostgreSQL connection string to `.env`:

```env
DATABASE_URL=your_postgres_url
```

Run the database migration:

```bash
pnpm exec prisma migrate dev
```

---

### 3. Configure authentication

Add this to `.env`:

```env
AUTH_SECRET=your_auth_secret
NEXTAUTH_URL=http://localhost:3000
MAIL_SENDER=your_sender_email
MAIL_KEY=your_mailgun_api_key
```

Authentication is configured in `src/auth.js`:

```ts
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
```

---

### 4. Start the development server

```bash
pnpm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the app.

---

## Features

* Task creation, editing, and deletion
* Email-based login using magic links
* Role-based access (PM, Contributor, Viewer)
* Projects with column-based task organization (Kanban layout)
* Button-based task movement
* Unit and integration tests using Jest
* GitHub Actions CI
* Codecov for test coverage
* Vercel deployment

---

## Notes

* Tailwind CSS was replaced by MUI due to better compatibility with GenAI-assisted UI generation.
* Most UI components and React hooks were generated using GenAI and manually customized.
* Email service setup required debugging Mailgun’s API key mismatch.
* Initial drag-and-drop support was removed due to implementation complexity.
* Coverage tracking was introduced with Codecov via GitHub Actions.

---

## License

MIT – Free to use and extend for learning and small-team projects.

---

## About OUTAKE Studios

> "We do Wedding planning, wedding photography, videography, professional advertisements, graphic designing and CG works. We take works throughout India and outside India. We are a team of freelance workers who do what we are passionate about. For us, it's not only about the business—our main concern is the quality of work and the joy of satisfying our customers with commitment."

Google Maps: [https://share.google/uNoDUzLHFSPFFDFMS](https://share.google/uNoDUzLHFSPFFDFMS)

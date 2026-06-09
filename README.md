# Full Stack Developer Task - Production Grade RBAC System

This repository contains the completed Full Stack Developer assessment task. It features a robust, secure, and modern web application built using **Next.js**, **NextAuth**, **MongoDB/Mongoose**, and **Tailwind CSS**.

The primary focus of this application is delivering a highly secure **Role-Based Access Control (RBAC)** architecture alongside a **Facebook-Style Nested Comments UI**.

## 🚀 Key Features

* **Strict Role-Based Access Control (RBAC):** Implementation of 4 distinct user roles utilizing server-side validation to prevent unauthorized actions entirely.
* **Facebook-Style Nested Comments:** A recursive, infinitely nestable UI thread where users can reply directly to top-level comments or specific replies natively, with clear visual routing indicating exactly who a user is "Replying to".
* **Tailwind CSS & Framer Motion:** A sleek, premium SaaS-like interface designed for top-tier user experience.
* **Server Actions:** Cutting edge Next.js Server Actions used exclusively for all CRUD operations, minimizing client-side javascript load while maintaining airtight security.

## 🛡️ RBAC Implementation & Rules Checked

The application strictly adheres to all provided task rules, both on the UI rendering level (hiding actions dynamically) and deep in the backend (Server Actions throwing unauthorized exceptions).

### Roles Matrix

| Role | Permissions |
| :--- | :--- |
| **Super Admin** | Full, unrestricted access to delete any post or comment in the system. |
| **Moderator** | Elevated access. Can delete *any* post or comment in the system. |
| **Regular User** | Standard access. Can create posts and comments. Can strictly only update or delete their *own* posts. |
| **Guest** | Read-Only. Cannot post, comment, edit, or delete anything. Registration/Login flows are enforced to interact. |

### Post Rules Strictly Enforced:
1. **Regular Users** can create posts securely.
2. **Author-Only Edits:** Each user can definitively only update or delete their own posts. Mod/Admin cannot hijack updates, only deletion.

### Specialized Comment Rules Fully Met:
1. **Thread Interactions:** If User A creates a post, User B can comment on it comfortably.
2. **Post-Owner Authority:** User A (the post creator) retains authoritative rights over their space and **can delete User B's comment.**
3. **Comment-Owner Authority:** User B can safely delete their own comment at any time.
4. **Third-Party Restriction:** User C (any other regular user wandering in) is completely locked out of managing User B's comment. They cannot intercept or delete it.

## 🛠️ Technological Stack

* **Framework:** Next.js (App Router, Server Components)
* **Language:** TypeScript
* **Database / ORM:** MongoDB with Mongoose
* **Authentication:** NextAuth.js
* **Styling:** Tailwind CSS

## ⚙️ Getting Started Locally

1. **Clone the repository.**
2. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`
3. **Configure Environment Variables:**
   Rename \`.env.example\` to \`.env\` (if provided) and fill out your MongoDB URI and NextAuth secret.
   \`\`\`bash
   MONGODB_URI="your_mongodb_connection_string"
   AUTH_SECRET="your_nextauth_secret"
   \`\`\`
4. **Run the local development server:**
   \`\`\`bash
   npm run dev
   \`\`\`
5. Open [https://jobtaskrbac.vercel.app/posts](https://jobtaskrbac.vercel.app/posts) with your browser to experience the platform.

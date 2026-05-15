# Project Rules for AI Assistant

This document outlines the strict guidelines and best practices that the AI must follow when generating, modifying, or reviewing code for this project to ensure high-quality, consistent, and maintainable results.

## 1. Core Tech Stack
- **Framework:** Next.js (App Router)
- **Library:** React
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Backend/DB:** Supabase

## 2. Architectural & Framework Guidelines
- **App Router Paradigm:** Strictly use the Next.js App Router (`app/` directory) conventions. Never use Pages Router (`pages/`) features unless explicitly working on legacy code. Use `next/navigation` instead of `next/router`.
- **Server vs. Client Components:** Default to Server Components for performance and SEO. Add the `"use client"` directive only at the top of files that require browser APIs, state (`useState`), or lifecycle hooks (`useEffect`).
- **Metadata:** Use the Next.js Metadata API for SEO (e.g., `export const metadata`) rather than legacy components like `next/head`.
- **Component Modularity:** Break down large files into small, focused, and reusable components. 

## 3. TypeScript & Code Quality
- **Strict Typing:** Avoid `any` at all costs. Always define explicit `interface` or `type` definitions for component props, state, and API responses.
- **Descriptive Naming:** Use clear, descriptive names for variables, functions, and components (e.g., `handleGuestSubmit` instead of `handleSubmit`).
- **Error Handling:** Always implement proper error handling using `try/catch` blocks for async operations. Avoid silent failures and ensure the UI handles errors gracefully.
- **Code Preservation:** Do not randomly delete existing code, comments, or functionality unless explicitly instructed to do so.

## 4. Design & Styling (Tailwind CSS)
- **Mobile-First Approach:** Always design for mobile screens first, using Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`) for larger screens.
- **Premium Aesthetics:** Ensure the UI feels premium, modern, and elegant. Use appropriate spacing, typography, and subtle animations (e.g., Framer Motion or smooth CSS transitions).
- **No Inline Styles:** Use Tailwind utility classes instead of inline `style={{ ... }}` whenever possible, unless dynamic calculations strictly require it.

## 5. Database & API (Supabase)
- **Validation:** Always verify the database schema and table structures before writing data-fetching or mutation logic.
- **Environment Variables:** Never hardcode sensitive credentials. Always use `process.env.NEXT_PUBLIC_SUPABASE_URL` and `process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY`.

## 6. General Behavior
- **Think Before Coding:** Analyze the root cause of an issue before providing a fix.
- **No Hallucinations:** If you are unsure about a specific project configuration, ask the user for clarification rather than making assumptions.
- **Atomic Changes:** When modifying files, ensure changes are focused and do not inadvertently break unrelated features.

# Technical Implementation Blueprint

This document is your high-level project plan and task list. Use it to outline the features and changes you want to implement in the `tasKey` application. When you're ready to have your AI partner work on a task, you can copy the relevant section and use it in your prompt.

## How to Use This File

1.  **Outline Features:** Break down large features into smaller, manageable tasks.
2.  **Structure Your Tasks:** For each task, use the "Perfect Prompt" structure we discussed in `HOW_TO_COLLABORATE_WITH_AI.md`.
3.  **Track Progress:** You can use markdown checklists (`- [ ]`) to keep track of what's done and what's next.

---

## High-Level To-Do List

### Phase 1: Core Functionality & UI Polish

- [ ] **Onboarding & Profiles:**
    - [ ] Refine the helper onboarding flow.
    - [ ] Add more details to the public-facing helper profile page.

- [ ] **Task Management:**
    - [ ] Implement task cancellation logic for customers.
    - [ ] Build out the task dispute resolution flow.

- [ ] **Authentication & Security:**
    - [ ] Implement phone number verification for customers.
    - [ ] Add multi-factor authentication (MFA) options.

- [ ] **AI & Advanced Features:**
    - [ ] Implement AI-powered helper recommendations on the task details page.
    - [ ] Create a system to automatically calculate and update helper reliability scores.

---

## Task Breakdown (Example)

### Task: Implement Phone Verification for Customers

*   **Goal:** I want to ensure that all customer accounts have a verified phone number to improve security and trust.
*   **Location:**
    *   `src/app/dashboard/profile/page.tsx`
    *   `src/lib/data.ts` (for the Customer type)
    *   `src/app/login/auth-form.tsx` (or a new component for phone auth)
*   **Specifics:**
    1.  Add a `phoneVerified: boolean` field to the `Customer` type in `src/lib/data.ts`.
    2.  On the profile page, display a "Verify Now" button next to the phone number if `phoneVerified` is false.
    3.  Create a dialog component that allows the user to trigger Firebase phone authentication, enter the SMS code, and confirm.
    4.  Upon successful verification, update the customer's document in Firestore to set `phoneVerified` to `true`.

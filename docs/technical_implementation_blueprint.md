---
# Phase 1 — Core Helper Experience (MVP)

This phase establishes the foundational journey for a Helper, from discovery to their first successful task completion. The primary goal is to create a **safe, low-pressure, and transparent** environment.

**Guardrails:**
- **No Bidding Wars:** Helpers propose a price; they don't see others' offers.
- **No Race-to-the-Bottom:** The customer's budget range is visible, setting a fair expectation.
- **Privacy by Default:** Exact locations are revealed only after a task is assigned.
- **Opt-In Communication:** No unsolicited contact outside the platform's messaging system.

---

## ✅ 1. Page A — Helper Dashboard (Home)
*The helper's mission control. What they see when they log in.*

### UI
- At-a-glance performance stats:
  - Reliability score (e.g., "GREEN")
  - Completion rate (%)
  - Average rating
  - Total earnings (lifetime)
- Prominent "Availability" toggle
- Main content: Curated task feed ("Tasks Near You")

### Backend
- `Helper` model includes:
  - `isAvailable` (boolean)
  - `stats` object (reliability, completionRate, ratingAvg)
  - `walletSummary` object (lifetimeEarnings)
- Task feed algorithm:
  - Sorts open tasks by a **relevance score**, not just time.
  - Score = (skill match) + (location proximity) + (recency)

### Tests
- Toggling availability updates `isAvailable` in Firestore.
- Feed correctly prioritizes tasks that match the helper's skills and service area.

---

## ✅ 2. Page B — Task Feed (Opportunity Without Pressure)
*The scrollable list of available jobs, surfaced on the Helper Dashboard.*

### UI
- Task Cards:
  - Clear title, category, budget range, and location (area, not exact address).
  - "Time Posted" (e.g., "2 hours ago").
- Filtering controls:
  - By category
  - By location/area
  - By time window (e.g., "Today", "This Weekend")
- No "number of offers" displayed on cards.

### Backend
- `Task` model includes `dueDate`.
- Firestore queries support filtering by category, area, and `createdAt` timestamp.

### Tests
- Filters work independently and in combination.
- Expired tasks (past `dueDate`) are not shown in the feed.

---

## ✅ 3. Page C — Task Detail (Decision Screen)
*What a helper sees when they click on a Task Card.*

### UI
- All details from the Task Card, plus:
  - Full, unabridged task description.
  - Customer's first name and profile picture.
  - Customer's rating/review history.
  - Required tools/skills listed clearly.
  - **Due date and time**.
- A "Task Fit Indicator" that shows how well the task matches the helper's skills, location, and availability (High/Medium/Low).
- A clear call-to-action: "Make Offer".

### Backend
- Firestore rules: Any signed-in user can `get` a task if its status is `OPEN`.

### Tests
- "Task Fit Indicator" correctly assesses skill and location match.
- All required data is present and correctly formatted.

---

## ✅ 4. Page D — Send Offer (Structured & Professional)
*The form a helper uses to propose their service for a task.*

### UI
- Simple, structured form:
  - Price (single input, pre-filled with budget minimum).
  - ETA / Availability (e.g., "Tomorrow afternoon").
  - A short, professional message to the customer.
- Form is disabled if helper is not verified.

### Backend
- On submit, creates a document in `tasks/{taskId}/offers/{offerId}`.
- `Offer` model includes `helperId`, `price`, `eta`, `message`, `status: 'ACTIVE'`.
- Firestore rules:
  - Only verified helpers (`helpers/{uid}.verificationStatus == 'APPROVED'`) can create offers.
  - Helpers can only create offers for themselves (`request.auth.uid == resource.data.helperId`).

### Tests
- Unverified helpers cannot submit the form.
- Offer document is created with the correct data structure.

---

## ✅ 5. Page E — Assigned Task (Responsibility View)
*What the helper sees after a customer accepts their offer.*

### UI
- A clear, prominent banner: "You've been assigned! The customer is expecting you."
- Exact task location is now visible.
- Customer's contact information (phone number) is revealed.
- Action buttons: "Start Task", "Report a Problem".

### Backend
- When customer accepts, `Task` status becomes `ASSIGNED`.
- `Task.assignedHelperId` is set to the helper's UID.
- Firestore rules: Only the `customerId` or `assignedHelperId` can `get` a task once its status is `ASSIGNED` or later.

### Tests
- Non-assigned helpers can no longer view the task detail page.
- Assigned helper can see the exact location.

---

## ✅ 6. Task Execution (Evidence-Based)
*The UI and logic for while the task is being performed.*

### UI
- Status buttons:
  - Arrived
  - Started
  - Completed
- Task checklist
- Optional before/after photos

### Backend
- Task status transitions: `ASSIGNED` -> `ACTIVE` -> `COMPLETED`.
- Evidence (photos) stored in Cloud Storage, linked to the task.
- Checklist completion state is persisted.

### Tests
- Status transitions are atomic and logged.
- Photo uploads are correctly associated with the task and user.

---

## ✅ 7. Completion & Feedback (Closing the Loop)
*The process for confirming completion and leaving reviews.*

### UI
- Customer View:
  - "Confirm Completion" button.
  - Optional rating (1-5 stars) and a short feedback comment.
- Helper View:
  - "Awaiting Customer Confirmation" status.

### Backend
- `Feedback` model: `taskId`, `customerId`, `helperId`, `rating`, `comment`.
- Firestore rules:
  - Feedback is immutable (cannot be edited or deleted after creation).
  - Only the `customerId` of the completed task can create feedback.
- (Optional, Advanced) A Cloud Function calculates and updates the helper's `stats` upon new feedback submission.

### Tests
- Customer can only review a task once.
- Helper cannot modify feedback left for them.

---

## ✅ 8. Performance & Growth (Transparency)
*A dedicated page for the helper to see their own stats.*

### UI
- Clear display of all `stats` from the Helper model.
- Explanation of how reliability is calculated (e.g., "Based on cancellations and disputes").
- Visual tier system (e.g., Bronze, Silver, Gold) with progress to the next tier.

### Backend
- (Assumes a scheduled function or trigger updates stats periodically).
- `Helper` model contains `currentTier` and `progressToNextTier` fields.

### Tests
- UI correctly reflects all fields in the `stats` object.

---

## ✅ 9. Profile & Journey (Lifecycle View)
*The helper's main profile page.*

### UI
- Displays all public-facing helper info (name, skills, bio, rating).
- A "Your Journey" checklist showing completed milestones:
  - [x] Account Registered
  - [x] Profile Complete
  - [ ] Identity Verified
  - [ ] First Gig Completed
  - [ ] Become a Top Rated Helper

### Backend
- `useHelperJourney` hook or similar logic derives the checklist state from the `Helper` document.

### Tests
- Checklist accurately reflects the helper's current lifecycle stage.

---
---

# Phase 2 — Advanced Features (Helper Side)

Phase 2 focuses on **safety, stress reduction, growth, and community**.
These features deepen trust, reduce disputes, and improve long-term helper retention.

All Phase 2 features MUST preserve Phase 1 guardrails and must not introduce pressure patterns.

---

## ✅ 5. Safety & Protection Features

### Objective
Protect Helpers during real-world task execution and provide safe escalation paths without drama.

---

### ✅ 5.1 Arrival Check-In (Geofenced)

#### Backend
- Implement `/api/tasks/{id}/check-in`
- Validate:
  - Caller is assigned Helper
  - Task status is ASSIGNED
- Capture:
  - Timestamp
  - Helper GPS coordinates
- Validate location within **100m radius** of task location
- Write audit event:
  - `ARRIVED`
  - location hash (not raw coordinates in logs)

#### Frontend
- “Arrived” button visible only for ASSIGNED tasks
- Handle location permission states:
  - Granted → proceed
  - Denied → show guidance message
- Visual confirmation after successful check-in

#### Security
- Only assigned Helper may check in
- Customer cannot spoof arrival

#### Tests
- Reject check-in outside radius
- Reject check-in by non-assigned Helper
- Arrival event written exactly once

---

### ✅ 5.2 Incident Reporting

#### Backend
- Incident model:
  - `taskId`
  - `helperId`
  - `type` (abuse, unsafe_location, payment_issue, other)
  - `description`
  - `createdAt`
- Endpoint:
  - `/api/incidents/report`
- Notify admins (dashboard + email/Slack optional)

#### Frontend
- “Report Issue” action available during IN_PROGRESS
- Simple form (type + short description)
- Confirmation screen after submission

#### Security
- Incidents visible only to admins
- Customers cannot see reports directly

#### Tests
- Incident submission by assigned Helper only
- Admin visibility enforced

---

### 5.3 Emergency Contact (Optional, Non-Intrusive)

#### Backend
- Store optional emergency contact per Helper
- Admin-only visibility

#### Frontend
- Emergency contact setup in Profile
- Shown only during active tasks (no panic UI)

---

## ✅ 6. Stress Reduction Features

### Objective
Reduce cognitive load and disputes by guiding Helpers step-by-step.

---

### ✅ 6.1 Task Checklists

#### Backend
- Checklist templates per task category
- On task assignment:
  - Generate task-instance checklist
- Enforce completion:
  - Task cannot be marked DONE unless all items checked

#### Frontend
- Checklist UI:
  - Large tappable items
  - Visual progress indicator
- Completion confirmation modal

#### Tests
- Checklist auto-generated correctly
- Completion blocked if checklist incomplete

---

### ✅ 6.2 Progress Tracking

#### Backend
- Track checklist progress events
- Store completion timestamps

#### Frontend
- Visual progress bar
- Clear “X of Y completed” text

---

## 🚧 7. Growth & Motivation Features

### Objective
Encourage quality work and long-term engagement through transparency and progression.

---

### 🚧 7.1 Tier System

#### Backend
- Define tiers:
  - Bronze
  - Silver
  - Gold
- Progression rules:
  - Completed tasks
  - Reliability threshold
- Store:
  - `currentTier`
  - `nextTierRequirements`

#### Frontend
- Tier badge on dashboard
- Progress bar with explanation

#### Tests
- Tier upgrades triggered correctly
- Downgrades handled gracefully (no shaming)

---

### 7.2 Skill Suggestions

#### Backend
- Analyze helper history
- Suggest additional skills that unlock more tasks
- Endpoint:
  - `/api/helpers/{id}/growth-suggestions`

#### Frontend
- Suggestion cards:
  - “Add Deep Cleaning to access more tasks”
- Dismissible (no pressure)

---

## 8. Community Features (Area Circles)

### Objective
Create local trust and relevance without turning the app into a social network.

---

### 8.1 Area Circles

#### Backend
- AreaCircle model:
  - `areaId`
  - `members`
- Auto-assign Helpers based on service areas
- Aggregate:
  - demand trends
  - peak times

#### Frontend
- Area Circle dashboard:
  - Insights (busy times)
  - Local tips (read-only initially)

#### Security
- Only Helpers in the area can view content

---

# Phase 3 — System-Wide Features

Phase 3 ensures **fairness, transparency, resilience, and low-tech accessibility** across the entire system.

---

## 9. Fairness & Transparency

### Objective
Ensure Helpers understand how scores change and can appeal unfair outcomes.

---

### 9.1 Reliability Impact Transparency

#### Backend
- Log every reliability score change:
  - reason
  - before / after
- Store in transparency log

#### Frontend
- Reliability detail screen:
  - “Why your score changed”
- Simple explanations only

---

### 9.2 Appeals System

#### Backend
- Appeal model:
  - `helperId`
  - `taskId`
  - `reason`
  - `status`
- Admin workflow:
  - review
  - approve / reject
- Endpoint:
  - `/api/appeals/submit`

#### Frontend
- Appeal submission form
- Appeal status tracking

#### Tests
- Appeals create admin tickets
- Helper cannot appeal same event twice

---

## 10. Low-Tech Friendly Features

### Objective
Make tasKey usable in low connectivity environments common in Tanzania.

---

### 10.1 Offline Mode (Lite)

#### Backend
- Support idempotent sync endpoints
- Conflict resolution rules:
  - Server state wins for task status
  - Client state merged for notes/checklists

#### Frontend
- Detect offline state
- Queue actions:
  - checklist updates
  - status changes
- Sync status indicator

#### Tests
- Offline actions sync correctly
- No duplicate events after reconnect

---

### 10.2 SMS Fallback (Phase-Gated)

#### Backend
- SMS gateway integration
- Critical notifications only:
  - assignment
  - cancellation

#### Frontend
- SMS preference toggle (opt-in)

---

## Phase 2 & 3 Acceptance Criteria

Phase 2 and 3 are complete only if:
- No Phase 1 guardrails are violated
- Safety flows work without exposing PII
- Growth features do not pressure Helpers
- Appeals and transparency are auditable
- Offline mode does not corrupt task state
- Admin visibility and controls are intact

---

End of Phase 2 & Phase 3 specification.

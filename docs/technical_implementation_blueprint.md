# tasKey — FULL HELPER APP (Page-by-Page Experience)
## Technical Implementation Blueprint (Mobile-First, Production-Grade)

This document defines the **authoritative implementation contract** for the tasKey Helper side.
All instructions must be implemented **end-to-end**:
- Frontend (UI/UX)
- Backend (Firestore + Cloud Functions)
- Security rules
- Performance constraints
- Tests and QA checks

This is not a design suggestion.  
This is the **required system behavior**.

---

## 0. Global Guardrails (Non-Negotiable)

Every implementation MUST preserve the following principles:

1. **Dignity First**
   - Helpers are professionals.
   - UI copy must be respectful and calm.
   - No language implying desperation, rush, or subordination.

2. **Clarity Over Pressure**
   - No forced calls.
   - No countdown timers.
   - No dark patterns.
   - Every action must clearly explain its outcome.

3. **Predictable Income**
   - Helpers must see effort, approximate area, time window, and tools **before** sending an offer.

4. **Fair Visibility**
   - Task visibility is influenced by skills, area match, availability, and reliability.
   - No unexplained randomness.

5. **Safety for Both Sides**
   - No customer phone number or exact address before assignment.
   - All task state changes must be auditable.
   - Evidence-friendly execution flow.

If any requested change violates these guardrails, implementation must stop and propose a compliant alternative.

---

## 1. Page A — Helper Dashboard (Home) - ✅ COMPLETE

### Goal
Provide a calm, one-glance control center showing:
- Availability
- Trust status
- Nearby opportunities
- Current commitments
- Earnings summary (informational)

### UI Requirements
- Mobile-first (target width: 360–390px)
- Light theme
- Single primary action per section
- No clutter

### Backend Requirements
- Read from `workers/{uid}`:
  - `availability`
  - `verificationStatus`
  - `reliability.level`
  - `stats`
- Read sanitized OPEN tasks only
- Active tasks query:
  - `assignedWorkerId == uid`
  - `status in [ASSIGNED, IN_PROGRESS]`

### Security
- Helper may read only their own worker document
- Sensitive task data excluded unless assigned

### Tests
- Availability toggle updates worker document
- Suspended helpers see locked dashboard
- Pending helpers see guidance banner
- Dashboard renders correctly on small screens

---

## 2. Page B — Task Feed (Opportunity Without Pressure) - ✅ COMPLETE

### Goal
Allow helpers to browse opportunities calmly, safely, and fairly.

### Task Card Fields (OPEN only)
- Task category
- Approximate area (areaName / ward)
- Estimated effort: LIGHT | MEDIUM | HEAVY
- Preferred time window (if available)
- Optional customer rating (aggregated)
- Visibility tags (e.g., “Matches your skills”)

### Explicitly Forbidden
- Customer phone number
- Exact address
- Countdown timers
- “Hurry” or scarcity language

### Filters
- Category
- Area
- Time window (Today / Evening / Weekend)

### Backend Logic
- Query `tasks` where `status == OPEN`
- Filter by helper service areas
- Rank by:
  - Skill match
  - Area match
  - Availability fit
  - Reliability (minor weight)

### Performance
- Pagination (limit 20)
- No realtime listener on feed
- Pull-to-refresh or periodic refresh

### Tests
- Feed never exposes private data
- Filters work correctly
- Pagination stable on low bandwidth
- Pending helpers can browse but not offer

---

## 3. Page C — Task Detail (Decision Screen) - ✅ COMPLETE

### Goal
Ensure helpers understand the task fully before sending an offer.

### Required Fields
- Full task description
- Approximate area (still no exact address)
- Estimated effort explanation
- Required tools list
- Preferred time window
- Fit Indicator:
  - Skill match
  - Distance band
  - Time fit

### CTA Logic
- If helper can send offers:
  - Show “Send Offer”
- Otherwise:
  - Show guidance CTA (e.g., “Complete verification to send offers”)

### Backend
- `/fit-indicator` endpoint or equivalent logic
- Response time p95 < 500ms

### Tests
- Fit indicator accuracy
- CTA gating based on helper capability
- No sensitive fields leaked

---

## 4. Page D — Send Offer (Structured & Professional) - ✅ COMPLETE

### Goal
Protect helpers from chaotic negotiation and pressure.

### Form Fields
- Price (TZS)
- Availability / ETA
- Short message (max length enforced)

### Rules
- Structured fields only
- No phone calls
- Rate limit offer submissions

### Backend
- `offers/{offerId}`:
  - workerId
  - price
  - eta
  - message
  - status

### Tests
- Offer blocked if not verified
- Offer rate limiting enforced
- Offer lifecycle transitions valid

---

## 5. Page E — Assigned Task (Responsibility View) - ✅ COMPLETE

### Goal
Make responsibility clear and undeniable.

### UI
- Status badge: ASSIGNED
- Banner: “You are responsible for this task.”
- Contact details unlocked
- Exact location revealed

### Backend
- Transactional assignment:
  - Task status update
  - Offer acceptance
  - Other offers rejected
  - Audit event written

### Tests
- Only assigned helper can see private task data
- Only assigned helper can update status

---

## 6. Page F — Task Execution (Evidence-Based) - ✅ COMPLETE

### Goal
Protect both helper and customer through clarity and proof.

### UI
- Status buttons:
  - Arrived
  - Started
  - Completed
- Task checklist
- Optional before/after photos

### Backend
- Status transitions validated server-side
- Events logged to `tasks/{id}/events`

### Tests
- Invalid state jumps rejected
- Timestamps recorded correctly
- Photos stored securely

---

## 7. Page G — Completion & Feedback - ✅ COMPLETE

### Goal
Close the loop fairly and calmly.

### Flow
- Helper marks completed
- Customer confirms
- Rating + feedback recorded
- Reliability updated automatically

### Tests
- Helper cannot self-confirm
- Reliability updates correctly
- Feedback stored immutably

---

## 8. Page H — Performance & Growth - ✅ COMPLETE

### Goal
Motivate long-term engagement.

### UI
- Reliability status
- Completed tasks count
- Tier progress (Bronze → Silver → Gold)
- Clear explanation of what improves visibility

### Backend
- Reliability computed via Cloud Functions
- Tier thresholds configurable

### Tests
- Tier progression logic
- Visibility weighting updates

---

## 9. Page I — Profile & Journey - ✅ COMPLETE

### Goal
Make helper lifecycle transparent.

### UI
- Profile preview (as customers see it)
- Verification badge
- Skills and areas
- Journey checklist:
  - Registered
  - Profile complete
  - Verified
  - Active
  - Growing

### Tests
- Lifecycle stage accurate
- Checklist updates automatically

---

## Final Acceptance Criteria (Mandatory)

The Helper side is complete only if:
- All guardrails are preserved
- No sensitive data leaks pre-assignment
- All task states are server-enforced
- UI remains calm and mobile-first
- Tests cover rules, functions, and core flows
- Manual QA passes on low bandwidth

---

End of blueprint.

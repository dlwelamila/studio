---

# Phase 4 — Intelligence & Experience Polish (Helper Side)

Phase 4 focuses on **personalization, predictability, and calm intelligence**.
These features improve decision-making and satisfaction without adding pressure.

---

## 11. Smart Task Prioritization

### Objective
Surface the most relevant tasks first, reducing scrolling and decision fatigue.

---

### 11.1 Recommendation Engine (Explainable) [x]

#### Backend
- Implement task relevance scoring based on:
  - Skill match
  - Area match
  - Historical acceptance
  - Time-of-day preference
- Store computed relevance score (non-persistent or cached)
- Expose via:
  - `/api/helpers/{id}/recommended-tasks`

Each recommended task MUST include:
- `reasonTags`: e.g. ["Near you", "Matches your skills"]

#### Frontend
- Add “Recommended for You” section at top of Task Feed
- Display reason tags on task cards
- Fallback to standard feed if no recommendations

#### UX Rules
- Always explain *why* a task is recommended
- No hidden AI logic

#### Tests
- Recommendations are relevant to helper history
- No recommendations shown if insufficient data
- Feed ordering stable

---

## 12. Earnings Forecast (Soft Prediction)

### Objective
Increase income predictability without guarantees.

---

### 12.1 Earnings Estimation Service

#### Backend
- Analyze helper activity (last 2–4 weeks)
- Calculate projected weekly earnings range
- Endpoint:
  - `/api/helpers/{id}/earnings-forecast`
- Always return a **range**, never a single value

#### Frontend
- Display forecast card on dashboard:
  - “Estimated earnings this week: TZS X–Y”
- Include disclaimer text:
  - “Based on recent activity. Not guaranteed.”

#### UX Rules
- Never display as promise
- Hide forecast if data is insufficient

#### Tests
- Forecast updates as activity changes
- Forecast never blocks helper actions

---

## 13. Notification Controls (Calm System)

### Objective
Prevent notification fatigue and respect helpers’ time.

---

### 13.1 Notification Preferences

#### Backend
- Store notification preferences:
  - Categories:
    - Opportunities
    - Assignments
    - Performance
    - System
  - Quiet hours (time range)
- Enforce preferences in notification dispatch

#### Frontend
- Notification settings screen:
  - Toggle per category
  - Quiet hours picker
- Preview text explaining effect of each toggle

#### UX Rules
- Notifications opt-in by category
- Quiet hours respected strictly

#### Tests
- Disabled categories receive no notifications
- Quiet hours block notifications correctly

---

## 14. Performance Insights (Private Analytics)

### Objective
Help helpers understand strengths without public comparison.

---

### 14.1 Insight Generation

#### Backend
- Analyze helper history:
  - Task types
  - Areas
  - Ratings
- Generate insights:
  - “You perform best in Laundry tasks”
  - “Higher ratings in Sinza area”
- Endpoint:
  - `/api/helpers/{id}/performance-insights`

#### Frontend
- Private “Insights” screen
- Insight cards with plain-language explanations

#### UX Rules
- No rankings
- No comparisons with other helpers

#### Tests
- Insights reflect real data
- No insight shown if insufficient data

---

# Phase 5 — Trust, Retention & Long-Term Stability

Phase 5 completes the Helper side for **long-term use at scale**.

---

## 15. Trusted Helper Mode

### Objective
Reward consistent quality with subtle recognition and benefits.

---

### 15.1 Trusted Status

#### Backend
- Criteria:
  - Reliability above threshold
  - Minimum completed tasks
- Assign `trustedHelper: true`
- Priority visibility weighting applied

#### Frontend
- Subtle “Trusted Helper” label on profile
- Early visibility note:
  - “You may see some tasks earlier”

#### UX Rules
- No loud badges
- No exclusion of others

#### Tests
- Trusted status applied correctly
- Status revoked if criteria fall below threshold

---

## 16. Task History Timeline

### Objective
Provide helpers with a professional work record.

---

### 16.1 History Ledger

#### Backend
- Store completed task summaries:
  - Date
  - Task type
  - Area
  - Outcome
  - Rating
- Endpoint:
  - `/api/helpers/{id}/task-history`

#### Frontend
- Timeline-style list
- Filters by month/task type

#### UX Rules
- Read-only
- Calm presentation

#### Tests
- History accurate and ordered
- No private customer data exposed

---

## 17. Repeat Customer Preference

### Objective
Create stable trust loops without exclusivity.

---

### 17.1 Preference System

#### Backend
- Allow customers to mark preferred helpers
- Store preference non-exclusively
- Notify helper of preference (non-binding)

#### Frontend
- Helper sees:
  - “This customer prefers you”
- No forced assignments

#### UX Rules
- Preference ≠ obligation
- Helper may decline freely

#### Tests
- Preferences stored correctly
- No monopolies created

---

## 18. Smart Availability Assistant

### Objective
Reduce missed opportunities through gentle guidance.

---

### 18.1 Availability Suggestions

#### Backend
- Detect patterns:
  - Usual working hours
  - Missed tasks due to availability off
- Generate suggestion messages

#### Frontend
- Non-intrusive suggestion cards:
  - “You usually work evenings — turn availability on?”
- One-tap accept or dismiss

#### UX Rules
- Suggestions never auto-apply
- Dismissed suggestions respected

#### Tests
- Suggestions relevant and infrequent
- No repeated nagging

---

## Phase 4 & 5 Acceptance Criteria (Final)

Phase 4 & 5 are complete only if:
- No Phase 1–3 guardrails are violated
- All intelligence features are explainable
- No pressure patterns introduced
- Helper autonomy fully preserved
- Features improve clarity, not noise
- All endpoints secured and tested

---

End of Phase 4 & Phase 5 specification.

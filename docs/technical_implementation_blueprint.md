---

# Participation, Negotiation Chat & Offer Flow — Technical Specification

This section formalizes the **Participation → Negotiation → Offer → Assignment → Time-Based Check-In** workflow and documents the resolution of the current Firestore permission crash.

This specification is **mandatory** for correct system behavior and application stability.


## B. Recommended Data Model (Safe & Scalable)

### B1. Tasks
**Collection:** `tasks/{taskId}`

Required fields:
- `customerId` (uid)
- `status`: `OPEN | ASSIGNED | IN_PROGRESS | DONE | CANCELLED`
- `assignedHelperId` (uid | null)
- `dueAt` (timestamp)
- `allowOffers` (boolean) — true only while status is `OPEN`
- `participantsCount` (number, optional, UI only)

---

### B2. Task Participants
**Collection:** `task_participants/{taskId}_{helperId}`  
One document per Helper who clicks **Participate**.

Fields:
- `taskId`
- `customerId`
- `helperId`
- `status`: `ACTIVE | WITHDRAWN | SELECTED | NOT_SELECTED`
- `createdAt`
- `lastMessageAt`

This collection represents the **tender participation list** and drives the Customer Inbox.

---

### B3. Task Threads
**Collection:** `task_threads/{threadId}`  
**Thread ID format:** `${taskId}_${helperId}`

Fields:
- `taskId`
- `customerId`
- `helperId`
- `members`: `[customerId, helperId]` **(required)**
- `createdAt`
- `lastMessageAt`
- `lastMessagePreview` (string)

Each thread represents a **private negotiation channel** between one Helper and the Customer.

---

### B4. Thread Messages
**Collection:** `task_threads/{threadId}/messages/{messageId}`

Fields:
- `senderId`
- `text`
- `createdAt`
- `type`: `TEXT | SYSTEM`
- `meta` (optional; e.g. assignment events)

---

### B5. Offers
**Collection:**  
- `offers/{taskId}_{helperId}`  
  **or**
- `tasks/{taskId}/offers/{offerId}`

Fields:
- `taskId`
- `customerId`
- `helperId`
- `price`
- `etaAt` (timestamp) — date & time promised by Helper
- `status`: `SUBMITTED | ACCEPTED | REJECTED | WITHDRAWN`
- `createdAt`

---

## C. Updated Workflow Mapping (5 Steps)

### Step 1 — Task Posted
- Task appears in feeds for authorized users.
- Only sanitized fields are visible.

---

### Step 2 — Participation (Interest Intent)
Helper clicks **“Click here to Participate”**.

System actions:
- Create `task_participants/{taskId}_{helperId}` with `status = ACTIVE`
- Create `task_threads/{taskId}_{helperId}` with `members`
- Optionally create a SYSTEM message:
  - “Helper joined the conversation”

This stage **does not submit pricing**.

---

### Step 3 — Negotiation Chat
- Helper and Customer communicate inside the thread.
- Customer Inbox shows **one thread per Helper** (WhatsApp-style).
- Chat visibility is restricted to thread members only.

---

### Step 4 — Offer Submission (Task Still OPEN)
Helpers may submit offers only if:
- `task.status == OPEN`
- `participant.status == ACTIVE`

On Customer acceptance:
- Task → `ASSIGNED`
- Winning participant → `SELECTED`
- Others → `NOT_SELECTED`

System sends SYSTEM messages:
- Winner: “You were selected”
- Others: “Thank you — another helper was selected”

After assignment:
- No new offers allowed.

---

### Step 5 — Countdown + Time-Based Check-In + Customer Confirmation

After offer acceptance:
- Store `etaAt` on accepted offer

Check-in rules:
- Allowed window:
  - `now >= etaAt`
  - `now <= etaAt + 30 minutes`
- Early check-in blocked
- Late (>30 min) check-in permanently blocked and helper flagged late

Flow:
1. Helper presses **Check-in**
2. Customer receives confirmation prompt
3. Customer confirms **YES**
4. System records `checkinConfirmedAt`
5. **Start Task** button unlocks for Helper

---

## D. Firestore Security Rules (Minimum Safe Set)

### D1. Threads & Messages (Members Only)

```ruby
match /task_threads/{threadId} {
  allow read: if signedIn() && isThreadMember();
  allow create: if signedIn() && isCreatingOwnThread();
  allow update: if signedIn() && isThreadMember();
  allow delete: if false;

  function isThreadMember() {
    return resource.data.members is list
      && resource.data.members.hasAny([request.auth.uid]);
  }

  function isCreatingOwnThread() {
    return request.resource.data.members is list
      && request.resource.data.members.hasAny([request.auth.uid])
      && request.resource.data.members.size() == 2;
  }

  match /messages/{messageId} {
    allow read: if signedIn() && isThreadMember();
    allow create: if signedIn() && isThreadMember()
      && request.resource.data.senderId == request.auth.uid
      && request.resource.data.text is string
      && request.resource.data.text.size() <= 1500;
    allow update, delete: if false;
  }
}
D2. Task Participants
ruby
Copy code
match /task_participants/{pid} {
  allow read: if signedIn() && (
    resource.data.customerId == request.auth.uid ||
    resource.data.helperId == request.auth.uid
  );

  allow create: if signedIn() &&
    request.resource.data.helperId == request.auth.uid;

  allow update: if signedIn() && (
    resource.data.helperId == request.auth.uid ||
    resource.data.customerId == request.auth.uid
  );

  allow delete: if false;
}
This prevents cross-access while supporting negotiation.

E. Frontend Boot Stability Rule
Chat subscriptions must never crash the application.

Approved Patterns
Pattern 1 (Preferred):

Query thread list using:

task_threads where members array-contains auth.uid

Open individual thread only after it appears in the list

Pattern 2:

useDoc returns { status: 'forbidden' }

UI renders a safe “No access to this chat” state

Permission errors must be handled as UI states, not fatal errors.

F. Required UI Changes
Helper Side
Task Detail (status = OPEN):

Primary CTA: “Click here to Participate”

After participation:

Open Chat

Make Offer (until task assigned)

Customer Side
Inbox:

Thread list (one per helper)

Helper name + last message preview

Task View:

Participants list

Offers list

Assign Helper action

Check-in confirmation prompt:

YES / NO

YES unlocks Start Task for Helper

G. Check-In Timing Rules (Exact)
Offer must include etaAt

Check-in allowed if:

now >= etaAt

now <= etaAt + 30 minutes

If now > etaAt + 30 minutes:

Check-in forbidden

Helper marked late

Early attempt:

Show: “Check-in opens at HH:MM”

Customer confirmation:

Create checkinRequests/{taskId} (or subcollection)

On confirmation:

Set checkinConfirmedAt

End of Participation & Negotiation Flow specification.
A. What’s causing the current crash (in plain terms)

Your app tries to read:

task_chats/s2WUG1lTGwBds7SLQdFu

…but the signed-in user (customer@taskey.app) is not allowed by Firestore rules, OR the doc does not contain the fields your rules require (commonly members).

So we must do two fixes in parallel:

Define the new chat/participation data model correctly (members + threads + messages).

Update Firestore rules to match the model.

Update frontend so chat reads don’t happen until membership is known (no boot-killer).

B. Recommended data model for the new flow (safe + scalable)
Collections (minimum)
1) tasks/{taskId}

Add:

customerId (uid)

status: OPEN | ASSIGNED | IN_PROGRESS | DONE | CANCELLED

assignedHelperId (uid|null)

dueAt (timestamp) — customer due date/time window

allowOffers (bool) — true only while OPEN

participantsCount (number) — optional for UI

2) task_participants/{taskId}_{helperId}

One doc per helper who clicked “Participate”.
Fields:

taskId

customerId

helperId

status: ACTIVE | WITHDRAWN | SELECTED | NOT_SELECTED

createdAt

lastMessageAt

This is your “tender participants list” and the basis for the customer Inbox threads.

3) task_threads/{threadId} (one thread per task per helper)

Thread ID: ${taskId}_${helperId}
Fields:

taskId

customerId

helperId

members: [customerId, helperId] ✅ required

createdAt

lastMessageAt

lastMessagePreview (string)

4) task_threads/{threadId}/messages/{messageId}

Fields:

senderId

text

createdAt

type: TEXT | SYSTEM

Optional: meta (e.g., system events like “task assigned”)

5) offers/{taskId}_{helperId} (or tasks/{taskId}/offers/{offerId})

Fields:

taskId

customerId

helperId

price

etaAt (timestamp) ✅ (date + time)

status: SUBMITTED | ACCEPTED | REJECTED | WITHDRAWN

createdAt

C. Updated workflow mapping to your 5 steps
Step 1 — Task posted

Task is visible in feed to everyone allowed (helpers + customers, sanitized fields).

Step 2 — Participation (interest intent)

Helper clicks “Click here to Participate”

System:

creates task_participants/{taskId}_{helperId} with ACTIVE

creates task_threads/{taskId}_{helperId} with members and metadata

optionally creates a first SYSTEM message: “Helper joined the conversation”

This is the key new stage. It does not submit final pricing yet.

Step 3 — Negotiation chat

Helper and Customer chat in the thread.

Customer inbox is thread list: one thread per helper participant (like WhatsApp).

The chat is strictly between the two members.

Step 4 — Offer submission (still while task OPEN)

Helpers can submit offers only if:

task status is OPEN

participant status is ACTIVE

Customer sees all offers and accepts one.

On accept:

Task becomes ASSIGNED

Winning participant becomes SELECTED

Others become NOT_SELECTED

System sends SYSTEM message to all threads:

winner: “You were selected”

others: “Thank you — another helper was selected”

Important: after assignment, offers must be blocked for everyone else.

Step 5 — Countdown + time-based check-in + customer confirm

After offer accepted:

store etaAt on the accepted offer

check-in becomes time-window based:

helper can check-in only within:

from etaAt to etaAt + 30 minutes

cannot check-in before etaAt

if late > 30 min, check-in permanently blocked and helper is marked late

Then:

Helper presses “Check-in”

Customer receives a “Confirm helper onsite?” prompt

Customer taps YES → check-in confirmed

Only after confirmation:

Helper sees “Start Task” enabled

D. Firestore Security Rules (minimum safe set)
1) Threads and Messages — member-only

Critical rule: thread must include members: [customerId, helperId]

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

2) Participants
match /task_participants/{pid} {
  allow read: if signedIn() && (
    resource.data.customerId == request.auth.uid ||
    resource.data.helperId == request.auth.uid
  );

  allow create: if signedIn() && (
    request.resource.data.helperId == request.auth.uid
  );

  allow update: if signedIn() && (
    resource.data.helperId == request.auth.uid ||
    resource.data.customerId == request.auth.uid
  );

  allow delete: if false;
}


You can tighten this later, but this prevents cross-access.

E. Frontend boot stability rule (fix the crash permanently)

Your useDoc hook must not crash the whole app on permission errors. Two safe patterns:

Pattern 1 (best): Don’t subscribe unless allowed

In chat screen:

first query for thread list using a query that the user is always allowed:

task_threads where members array-contains auth.uid

only open a specific thread once it appears in that list.

Pattern 2: Permission denied is a UI state

useDoc returns {status: 'forbidden'} instead of throwing

UI shows “You don’t have access to this chat.”

Either way, app boots.

F. Concrete UI changes (as per your flow)
Helper side

Task detail screen:

New primary button while task OPEN:

“Click here to Participate”

After participating:

show “Open Chat”

show “Make Offer” (still allowed until assignment)

Customer side

Inbox:

List threads (WhatsApp style)

Each thread shows helper name + last message preview

Task view:

“Participants” list

“Offers” list

“Assign Helper” action

Check-in confirmation prompt:

YES / NO

if YES → unlock Start Task for helper

G. Check-in timing rules (exact)

Offer must store etaAt (timestamp)

Check-in allowed window:

allowed if now >= etaAt AND now <= etaAt + 30min

If now > etaAt + 30min

check-in forbidden

mark helper late (reliability impact event)

If helper tries check-in early:

show “Check-in opens at HH:MM”

Customer confirmation required:

check-in request creates checkinRequests/{taskId} (or task subcollection)

customer confirms → server marks checkinConfirmedAt
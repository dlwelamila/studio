# tasKey - Full Project Source Code

This file contains the complete source code for every file in the `tasKey` application. You can use this to recreate the project on your local machine for development in an editor like VS Code.

**Instructions:**
1. On your local machine, create a new project folder (e.g., `taskey-app`).
2. Inside that folder, create the file structure as outlined below (e.g., create a `src` folder, then an `app` folder inside `src`, and so on).
3. For each file listed, copy its complete content from this document and paste it into the corresponding file you created locally.
4. Once you have all the files, run `npm install` in your terminal from the project's root directory to install all the necessary packages.
5. You can then run `npm run dev` to start the local development server.

---
---

## File: `.env`

```
```

---

## File: `apphosting.yaml`

```yaml
# Settings to manage and configure a Firebase App Hosting backend.
# https://firebase.google.com/docs/app-hosting/configure

runConfig:
  # Increase this value if you'd like to automatically spin up
  # more instances in response to increased traffic.
  maxInstances: 1

```

---

## File: `components.json`

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

---

## File: `docs/backend.json`

```json
{
  "entities": {
    "Customer": {
      "$schema": "http://json-schema.org/draft-07/schema#",
      "title": "Customer",
      "type": "object",
      "description": "Represents a customer who needs assistance with tasks.",
      "properties": {
        "id": {
          "type": "string",
          "description": "Unique identifier for the customer entity."
        },
        "firstName": {
          "type": "string",
          "description": "The first name of the customer."
        },
        "lastName": {
          "type": "string",
          "description": "The last name of the customer."
        },
        "email": {
          "type": "string",
          "description": "The email address of the customer.",
          "format": "email"
        },
        "phone": {
          "type": "string",
          "description": "The phone number of the customer."
        },
        "address": {
          "type": "string",
          "description": "The address of the customer."
        }
      },
      "required": [
        "id",
        "firstName",
        "lastName",
        "email",
        "phone",
        "address"
      ]
    },
    "Helper": {
      "$schema": "http://json-schema.org/draft-07/schema#",
      "title": "Helper",
      "type": "object",
      "description": "Represents a helper who provides assistance with tasks.",
      "properties": {
        "id": {
          "type": "string",
          "description": "Unique identifier for the helper entity."
        },
        "firstName": {
          "type": "string",
          "description": "The first name of the helper."
        },
        "lastName": {
          "type": "string",
          "description": "The last name of the helper."
        },
        "email": {
          "type": "string",
          "description": "The email address of the helper.",
          "format": "email"
        },
        "phone": {
          "type": "string",
          "description": "The phone number of the helper."
        },
        "address": {
          "type": "string",
          "description": "The address of the helper."
        },
        "skills": {
          "type": "array",
          "description": "List of skills the helper possesses.",
          "items": {
            "type": "string"
          }
        },
        "bio": {
          "type": "string",
          "description": "A short biography of the helper."
        }
      },
      "required": [
        "id",
        "firstName",
        "lastName",
        "email",
        "phone",
        "address",
        "skills"
      ]
    },
    "Task": {
      "$schema": "http://json-schema.org/draft-07/schema#",
      "title": "Task",
      "type": "object",
      "description": "Represents a task posted by a customer.",
      "properties": {
        "id": {
          "type": "string",
          "description": "Unique identifier for the task entity."
        },
        "customerId": {
          "type": "string",
          "description": "Reference to Customer. (Relationship: Customer 1:N Task)"
        },
        "title": {
          "type": "string",
          "description": "The title of the task."
        },
        "description": {
          "type": "string",
          "description": "A detailed description of the task."
        },
        "category": {
          "type": "string",
          "description": "The category of the task (e.g., Cleaning, Laundry)."
        },
        "location": {
          "type": "string",
          "description": "The location where the task needs to be performed."
        },
        "budget": {
          "type": "number",
          "description": "The budget allocated for the task."
        },
        "status": {
          "type": "string",
          "description": "The current status of the task (e.g., Open, Assigned, Completed, IN_DISPUTE, REASSIGNED)."
        },
        "assignedHelperId": {
          "type": "string",
          "description": "Reference to Helper. (Relationship: Helper 1:N Task). Nullable if task is not assigned."
        },
        "createdAt": { "type": "string", "format": "date-time" },
        "assignedAt": { "type": "string", "format": "date-time" },
        "startedAt": { "type": "string", "format": "date-time" },
        "completedAt": { "type": "string", "format": "date-time" },
        "disputedAt": { "type": "string", "format": "date-time" }
      },
      "required": [
        "id",
        "customerId",
        "title",
        "description",
        "category",
        "location",
        "budget",
        "status",
        "createdAt"
      ]
    },
    "Offer": {
      "$schema": "http://json-schema.org/draft-07/schema#",
      "title": "Offer",
      "type": "object",
      "description": "Represents an offer submitted by a helper for a task.",
      "properties": {
        "id": {
          "type": "string",
          "description": "Unique identifier for the offer entity."
        },
        "taskId": {
          "type": "string",
          "description": "Reference to Task. (Relationship: Task 1:N Offer)"
        },
        "helperId": {
          "type": "string",
          "description": "Reference to Helper. (Relationship: Helper 1:N Offer)"
        },
        "price": {
          "type": "number",
          "description": "The price offered by the helper."
        },
        "availability": {
          "type": "string",
          "description": "The helper's availability to perform the task."
        },
        "message": {
          "type": "string",
          "description": "A message from the helper to the customer."
        }
      },
      "required": [
        "id",
        "taskId",
        "helperId",
        "price",
        "availability",
        "message"
      ]
    },
    "Admin": {
      "$schema": "http://json-schema.org/draft-07/schema#",
      "title": "Admin",
      "type": "object",
      "description": "Represents an administrator who manages the platform.",
      "properties": {
        "id": {
          "type": "string",
          "description": "Unique identifier for the admin entity."
        },
        "firstName": {
          "type": "string",
          "description": "The first name of the admin."
        },
        "lastName": {
          "type": "string",
          "description": "The last name of the admin."
        },
        "email": {
          "type": "string",
          "description": "The email address of the admin.",
          "format": "email"
        }
      },
      "required": [
        "id",
        "firstName",
        "lastName",
        "email"
      ]
    },
    "Rating": {
      "$schema": "http://json-schema.org/draft-07/schema#",
      "title": "Rating",
      "type": "object",
      "description": "Represents a rating given by a customer to a helper after task completion.",
      "properties": {
        "id": {
          "type": "string",
          "description": "Unique identifier for the rating entity."
        },
        "taskId": {
          "type": "string",
          "description": "Reference to Task. (Relationship: Task 1:N Rating)"
        },
        "customerId": {
          "type": "string",
          "description": "Reference to Customer. (Relationship: Customer 1:N Rating)"
        },
        "helperId": {
          "type": "string",
          "description": "Reference to Helper. (Relationship: Helper 1:N Rating)"
        },
        "rating": {
          "type": "number",
          "description": "The rating value (e.g., 1 to 5 stars)."
        },
        "comment": {
          "type": "string",
          "description": "Optional comment from the customer."
        }
      },
      "required": [
        "id",
        "taskId",
        "customerId",
        "helperId",
        "rating"
      ]
    },
    "SupportTicket": {
      "$schema": "http://json-schema.org/draft-07/schema#",
      "title": "Support Ticket",
      "type": "object",
      "description": "Represents a support ticket submitted by a user.",
      "properties": {
        "id": {
          "type": "string",
          "description": "Unique identifier for the support ticket."
        },
        "userId": {
          "type": "string",
          "description": "The Firebase Auth UID of the user submitting the ticket."
        },
        "userEmail": {
          "type": "string",
          "description": "The email of the user submitting the ticket."
        },
        "subject": {
          "type": "string",
          "description": "The subject of the support ticket."
        },
        "message": {
          "type": "string",
          "description": "The detailed message from the user."
        },
        "status": {
          "type": "string",
          "enum": ["NEW", "IN_PROGRESS", "RESOLVED"],
          "description": "The current status of the support ticket."
        },
        "createdAt": {
          "type": "string",
          "format": "date-time"
        }
      },
      "required": [
        "id",
        "userId",
        "userEmail",
        "subject",
        "message",
        "status",
        "createdAt"
      ]
    }
  },
  "auth": {
    "providers": [
      "password",
      "anonymous"
    ]
  },
  "firestore": {
    "structure": [
      {
        "path": "/customers/{userId}",
        "definition": {
          "entityName": "Customer",
          "schema": {
            "$ref": "#/backend/entities/Customer"
          },
          "description": "Stores customer profile data. The document ID is the Firebase Auth UID.",
          "params": [
            {
              "name": "userId",
              "description": "The Firebase Auth UID of the user."
            }
          ]
        }
      },
      {
        "path": "/helpers/{userId}",
        "definition": {
          "entityName": "Helper",
          "schema": {
            "$ref": "#/backend/entities/Helper"
          },
          "description": "Stores helper profile data. The document ID is the Firebase Auth UID.",
          "params": [
            {
              "name": "userId",
              "description": "The Firebase Auth UID of the user."
            }
          ]
        }
      },
      {
        "path": "/tasks/{taskId}",
        "definition": {
          "entityName": "Task",
          "schema": {
            "$ref": "#/backend/entities/Task"
          },
          "description": "Stores tasks created by customers. Includes denormalized 'customerId' for authorization independence.",
          "params": [
            {
              "name": "taskId",
              "description": "The unique ID of the task."
            }
          ]
        }
      },
      {
        "path": "/offers/{offerId}",
        "definition": {
          "entityName": "Offer",
          "schema": {
            "$ref": "#/backend/entities/Offer"
          },
          "description": "Stores offers made by helpers for tasks. Includes denormalized 'helperId' and 'taskId' for authorization independence.",
          "params": [
            {
              "name": "offerId",
              "description": "The unique ID of the offer."
            }
          ]
        }
      },
      {
        "path": "/ratings/{ratingId}",
        "definition": {
          "entityName": "Rating",
          "schema": {
            "$ref": "#/backend/entities/Rating"
          },
          "description": "Stores ratings given by customers to helpers. Includes denormalized 'taskId', 'customerId', and 'helperId' for authorization independence.",
          "params": [
            {
              "name": "ratingId",
              "description": "The unique ID of the rating."
            }
          ]
        }
      },
      {
        "path": "/roles_admin/{userId}",
        "definition": {
          "entityName": "Admin",
          "schema": {
            "$ref": "#/backend/entities/Admin"
          },
          "description": "Indicates admin status. Document existence determines admin role.",
          "params": [
            {
              "name": "userId",
              "description": "The Firebase Auth UID of the user."
            }
          ]
        }
      },
       {
        "path": "/support_tickets/{ticketId}",
        "definition": {
          "entityName": "SupportTicket",
          "schema": {
            "$ref": "#/backend/entities/SupportTicket"
          },
          "description": "Stores support tickets submitted by users.",
          "params": [
            {
              "name": "ticketId",
              "description": "The unique ID of the support ticket."
            }
          ]
        }
      }
    ],
    "reasoning": "The Firestore structure is designed to support the tasKey application, focusing on task management, user roles (Customers, Helpers, Admins), and efficient data access with robust security rules.  The key principle is Authorization Independence, achieved through denormalization. For example, tasks denormalize customerId, and offers denormalize helperId and taskId, allowing rules to validate access without needing to `get()` parent documents. \n\n*   **Customers:** `/customers/{userId}` stores customer profiles.\n*   **Helpers:** `/helpers/{userId}` stores helper profiles.\n*   **Tasks:** `/tasks/{taskId}` stores task documents. Tasks denormalize `customerId` to ensure Authorization Independence.\n*   **Offers:** `/tasks/{taskId}/offers/{offerId}` is a subcollection within each task. This simplifies security rules as access to offers can be inherited from the parent task.\n*   **Ratings:** Ratings are stored in `/ratings/{ratingId}`. They denormalize `taskId`, `customerId`, and `helperId` for authorization independence and simpler querying.\n*   **Admins:** Admin status is managed via document existence in `/roles_admin/{userId}`.  This leverages the \"existence over content\" pattern for global role management.\n\n\n**QAPs (Rules are not Filters):**\n\n*   The structure supports secure `list` operations.\n*   Helpers can list all documents in the `/tasks` collection, but rules on `get` will prevent them from reading full details of tasks they are not involved in.\n\nThis structure adheres to all core design principles and strategy mandates, ensuring a secure, scalable, and debuggable Firestore database for the tasKey application."
  }
}
```

---

## File: `firestore.rules`

```rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper functions to promote readable and reusable rules.
    function isSignedIn() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }

    function isAdmin() {
      return isSignedIn() && exists(/databases/$(database)/documents/roles_admin/$(request.auth.uid));
    }
    
    function isApprovedHelper() {
        return isSignedIn() && get(/databases/$(database)/documents/helpers/$(request.auth.uid)).data.verificationStatus == 'APPROVED';
    }

    function isAssignedHelper(taskData) {
      return isSignedIn() && taskData.assignedHelperId == request.auth.uid;
    }
    
    function isResourceOwner(resource, key) {
        return isSignedIn() && resource.data[key] == request.auth.uid;
    }

    function isCreatingOwnResource(key) {
      return isSignedIn() && request.resource.data[key] == request.auth.uid;
    }

    function ownerFieldIsImmutable(key) {
      return request.resource.data[key] == resource.data[key];
    }
    
    function canUpdateTaskStatus(currentStatus, nextStatus) {
      // Helper transitions
      return (currentStatus == 'ASSIGNED' && nextStatus == 'ACTIVE') ||
             (currentStatus == 'ACTIVE' && nextStatus == 'COMPLETED');
    }
    
    function customerCanDispute(currentStatus, nextStatus) {
      // Customer transition
      return currentStatus == 'COMPLETED' && nextStatus == 'IN_DISPUTE';
    }

    match /customers/{userId} {
      allow get: if isSignedIn();
      allow list: if isSignedIn();
      allow create: if isOwner(userId) && request.resource.data.id == userId;
      allow update: if isOwner(userId) && ownerFieldIsImmutable('id');
      allow delete: if isOwner(userId);
    }
    
    match /helpers/{userId} {
      allow get: if isSignedIn();
      allow list: if isSignedIn();
      allow create: if isOwner(userId) && request.resource.data.id == userId;
      allow update: if isOwner(userId) && ownerFieldIsImmutable('id');
      allow delete: if isOwner(userId);
    }

    match /tasks/{taskId} {
      allow get: if isSignedIn(); // Let client logic handle what to show
      allow list: if isSignedIn();
      allow create: if isCreatingOwnResource('customerId');
      
      allow update: if isSignedIn() && (
        // Customer can accept an offer or dispute a completed task
        (isResourceOwner(resource, 'customerId') && (
            ownerFieldIsImmutable('customerId') || 
            customerCanDispute(resource.data.status, request.resource.data.status)
        )) ||
        // Helper can update status from ASSIGNED -> ACTIVE -> COMPLETED
        (isAssignedHelper(resource.data) && canUpdateTaskStatus(resource.data.status, request.resource.data.status) && ownerFieldIsImmutable('customerId') && ownerFieldIsImmutable('assignedHelperId'))
      );
      
      allow delete: if isResourceOwner(resource, 'customerId');

      // Offers subcollection
      match /offers/{offerId} {
        allow get, list: if isResourceOwner(get(/databases/$(database)/documents/tasks/$(taskId)), 'customerId') || isAdmin() || isCreatingOwnResource('helperId');
        allow create: if isCreatingOwnResource('helperId') && isApprovedHelper();
        allow update: if isResourceOwner(resource, 'helperId') && ownerFieldIsImmutable('helperId');
        allow delete: if isResourceOwner(resource, 'helperId');
      }
    }

    match /ratings/{ratingId} {
      allow get, list: if true;
      allow create: if isCreatingOwnResource('customerId');
      allow update: if false;
      allow delete: if false;
    }
    
    match /feedbacks/{feedbackId} {
       allow get, list: if true;
       allow create: if isCreatingOwnResource('customerId');
       allow update, delete: if false;
    }

    match /support_tickets/{ticketId} {
      allow get, list, update, delete: if isAdmin();
      allow create: if isCreatingOwnResource('userId');
    }

    match /roles_admin/{userId} {
      allow get, list: if isAdmin();
      allow create, update, delete: if isAdmin();
    }
  }
}
```

---

## File: `next.config.ts`

```ts
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
```

---

## File: `package.json`

```json
{
  "name": "nextn",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack -p 9002",
    "genkit:dev": "genkit start -- tsx src/ai/dev.ts",
    "genkit:watch": "genkit start -- tsx --watch src/ai/dev.ts",
    "build": "NODE_ENV=production next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@genkit-ai/google-genai": "^1.20.0",
    "@genkit-ai/next": "^1.20.0",
    "@hookform/resolvers": "^3.9.0",
    "@radix-ui/react-accordion": "^1.2.3",
    "@radix-ui/react-alert-dialog": "^1.1.6",
    "@radix-ui/react-avatar": "^1.1.3",
    "@radix-ui/react-checkbox": "^1.1.4",
    "@radix-ui/react-collapsible": "^1.1.11",
    "@radix-ui/react-dialog": "^1.1.6",
    "@radix-ui/react-dropdown-menu": "^2.1.6",
    "@radix-ui/react-label": "^2.1.2",
    "@radix-ui/react-menubar": "^1.1.6",
    "@radix-ui/react-popover": "^1.1.6",
    "@radix-ui/react-progress": "^1.1.2",
    "@radix-ui/react-radio-group": "^1.2.3",
    "@radix-ui/react-scroll-area": "^1.2.3",
    "@radix-ui/react-select": "^2.1.6",
    "@radix-ui/react-separator": "^1.1.2",
    "@radix-ui/react-slider": "^1.2.3",
    "@radix-ui/react-slot": "^1.1.0",
    "@radix-ui/react-switch": "^1.1.3",
    "@radix-ui/react-tabs": "^1.1.3",
    "@radix-ui/react-toast": "^1.2.6",
    "@radix-ui/react-tooltip": "^1.1.8",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "date-fns": "^3.6.0",
    "dotenv": "^16.5.0",
    "embla-carousel-react": "^8.6.0",
    "firebase": "^11.9.1",
    "firebase-admin": "^12.2.0",
    "genkit": "^1.20.0",
    "lucide-react": "^0.475.0",
    "next": "15.5.9",
    "patch-package": "^8.0.0",
    "react": "^19.2.1",
    "react-day-picker": "^9.11.3",
    "react-dom": "^19.2.1",
    "react-hook-form": "^7.54.2",
    "recharts": "^2.15.1",
    "tailwind-merge": "^3.0.1",
    "tailwindcss-animate": "^1.0.7",
    "zod": "^3.24.2"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^19.2.1",
    "@types/react-dom": "^19.2.1",
    "genkit-cli": "^1.20.0",
    "postcss": "^8",
    "tailwindcss": "^3.4.1",
    "typescript": "^5"
  }
}
```

---

## File: `src/ai/dev.ts`

```ts
import { config } from 'dotenv';
config();

import '@/ai/flows/recommend-helpers-for-task.ts';
```

---

## File: `src/ai/flows/recommend-helpers-for-task.ts`

```ts
'use server';

/**
 * @fileOverview Recommends helpers for a given task based on location, user ratings, and estimated time of delivery.
 *
 * - recommendHelpersForTask - A function that recommends helpers for a task.
 * - RecommendHelpersForTaskInput - The input type for the recommendHelpersForTask function.
 * - RecommendHelpersForTaskOutput - The return type for the recommendHelpersForTask function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendHelpersForTaskInputSchema = z.object({
  taskDescription: z.string().describe('The description of the task to be performed.'),
  taskLocation: z.string().describe('The location where the task needs to be performed.'),
  customerRating: z.number().describe('The rating given by the customer'),
});

export type RecommendHelpersForTaskInput = z.infer<typeof RecommendHelpersForTaskInputSchema>;

const RecommendHelpersForTaskOutputSchema = z.object({
  recommendedHelpers: z
    .array(z.string())
    .describe('A list of helper IDs recommended for the task.'),
});

export type RecommendHelpersForTaskOutput = z.infer<typeof RecommendHelpersForTaskOutputSchema>;

export async function recommendHelpersForTask(
  input: RecommendHelpersForTaskInput
): Promise<RecommendHelpersForTaskOutput> {
  return recommendHelpersForTaskFlow(input);
}

const recommendHelpersForTaskPrompt = ai.definePrompt({
  name: 'recommendHelpersForTaskPrompt',
  input: {schema: RecommendHelpersForTaskInputSchema},
  output: {schema: RecommendHelpersForTaskOutputSchema},
  prompt: `You are an expert task recommender that recommends helpers for tasks.

Consider the following factors when recommending helpers:

- Location: The helper should be located near the task location.
- User Ratings: The helper should have high user ratings.
- Estimated Time of Delivery: The helper should be able to complete the task within the estimated time of delivery.

Task Description: {{{taskDescription}}}
Task Location: {{{taskLocation}}}
Customer Rating: {{{customerRating}}}

Based on these factors, recommend a list of helper IDs for the task.

Make sure the output is a list of helper ids.
`,
});

const recommendHelpersForTaskFlow = ai.defineFlow(
  {
    name: 'recommendHelpersForTaskFlow',
    inputSchema: RecommendHelpersForTaskInputSchema,
    outputSchema: RecommendHelpersForTaskOutputSchema,
  },
  async input => {
    const {output} = await recommendHelpersForTaskPrompt(input);
    return output!;
  }
);
```

---

## File: `src/ai/genkit.ts`

```ts
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.5-flash',
});
```

---

## File: `src/app/dashboard/browse/page.tsx`

```tsx
// This file is temporarily repurposed as the Helper Dashboard's main view.
// It will be renamed or moved to /dashboard/page.tsx in a future step.
'use client';
import HelperDashboard from '../helper-dashboard';

export default function BrowsePage() {
    return <HelperDashboard />
}
```

---

## File: `src/app/dashboard/customer-dashboard.tsx`

```tsx
'use client';

import Link from 'next/link';
import { PlusCircle, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

import { useCollection, useDoc, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, query, where, doc } from 'firebase/firestore';
import type { Task, Offer, Helper } from '@/lib/data';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function CustomerDashboard() {
  const { user: authUser, isUserLoading: isAuthLoading } = useUser();
  const firestore = useFirestore();

  const tasksQuery = useMemoFirebase(() => authUser && firestore ? query(collection(firestore, 'tasks'), where('customerId', '==', authUser.uid)) : null, [authUser, firestore]);
  const { data: customerTasks, isLoading: areTasksLoading } = useCollection<Task>(tasksQuery);
  
  const isLoading = isAuthLoading || areTasksLoading;

  return (
    <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
      <div className="flex items-center">
        <h1 className="font-headline text-2xl font-bold">My Tasks</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button asChild size="sm">
            <Link href="/dashboard/tasks/new">
              <PlusCircle className="h-4 w-4" />
              <span className="ml-2">Post New Task</span>
            </Link>
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader className="px-7">
          <CardTitle>Your Active and Past Tasks</CardTitle>
          <CardDescription>
            An overview of all the tasks you&apos;ve posted on tasKey.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead className="hidden sm:table-cell">Status</TableHead>
                <TableHead className="hidden md:table-cell">Offers</TableHead>
                <TableHead className="hidden md:table-cell">Completed</TableHead>
                <TableHead className="text-right">Cost (TZS)</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && Array.from({length: 3}).map((_, i) => <TaskRowSkeleton key={i} />)}
              {customerTasks && customerTasks.length > 0 ? (
                customerTasks.map((task) => (
                  <TaskRow key={task.id} task={task} />
                ))
              ) : (
                !isLoading && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center h-24">
                      { authUser ? "You haven't posted any tasks yet." : "Please log in to see your tasks."}
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}


function TaskRow({ task }: { task: Task }) {
  const firestore = useFirestore();

  const offersQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'tasks', task.id, 'offers')) : null, [firestore, task.id]);
  const { data: taskOffers } = useCollection<Offer>(offersQuery);
  
  const helperRef = useMemoFirebase(() => firestore && task.assignedHelperId ? doc(firestore, 'helpers', task.assignedHelperId) : null, [firestore, task.assignedHelperId]);
  const { data: assignedHelper } = useDoc<Helper>(helperRef);

  const finalCost = task.acceptedOfferPrice 
    ? task.acceptedOfferPrice.toLocaleString() 
    : `${task.budget.min.toLocaleString()} - ${task.budget.max.toLocaleString()}`;

  return (
    <TableRow>
      <TableCell>
        <div className="font-medium">{task.title}</div>
        <div className="hidden text-sm text-muted-foreground md:inline">
          {assignedHelper ? `Assigned to ${assignedHelper.fullName}` : task.category}
        </div>
      </TableCell>
      <TableCell className="hidden sm:table-cell">
        <Badge
          className="capitalize"
          variant={
            task.status === 'OPEN'
              ? 'secondary'
              : task.status === 'COMPLETED'
              ? 'default'
              : 'outline'
          }
        >
          {task.status.replace('_', ' ')}
        </Badge>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {taskOffers?.length ?? 0}
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {task.completedAt ? format(task.completedAt.toDate(), 'dd MMM yyyy') : 'Pending'}
      </TableCell>
      <TableCell className="text-right">
          {finalCost}
      </TableCell>
      <TableCell className="text-right">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/dashboard/tasks/${task.id}`}>
              View Details <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </TableCell>
    </TableRow>
  );
}

function TaskRowSkeleton() {
  return (
    <TableRow>
      <TableCell>
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-24 mt-1" />
      </TableCell>
      <TableCell className="hidden sm:table-cell">
        <Skeleton className="h-6 w-24" />
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <Skeleton className="h-5 w-8" />
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <Skeleton className="h-5 w-24" />
      </TableCell>
      <TableCell className="text-right">
        <Skeleton className="h-5 w-28 ml-auto" />
      </TableCell>
      <TableCell className="text-right">
        <Skeleton className="h-9 w-[125px] ml-auto" />
      </TableCell>
    </TableRow>
  )
}
```

---

## File: `src/app/dashboard/gigs/page.tsx`

```tsx
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useUserRole } from '@/context/user-role-context';
import { format } from 'date-fns';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useUser, useFirestore, useCollection, useMemoFirebase, useDoc } from '@/firebase';
import { collection, query, where, doc } from 'firebase/firestore';
import type { Task, Customer } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';

export default function MyGigsPage() {
  const { role } = useUserRole();
  const { user: authUser, isUserLoading } = useUser();
  const firestore = useFirestore();

  const gigsQuery = useMemoFirebase(() => {
    if (!authUser || !firestore) return null;
    return query(
      collection(firestore, 'tasks'),
      where('assignedHelperId', '==', authUser.uid)
    );
  }, [authUser, firestore]);

  const { data: myGigs, isLoading: areGigsLoading } = useCollection<Task>(gigsQuery);

  if (role === 'customer') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Access Denied</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This page is only available to helpers. Please switch to your helper profile to view your gigs.</p>
        </CardContent>
      </Card>
    );
  }

  const isLoading = isUserLoading || areGigsLoading;

  return (
    <div>
      <h1 className="font-headline text-2xl font-bold mb-6">My Gigs</h1>
      <Card>
        <CardHeader>
          <CardTitle>Your Assigned Tasks</CardTitle>
          <CardDescription>
            Here are the tasks that have been assigned to you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead className="hidden sm:table-cell">Customer</TableHead>
                <TableHead className="hidden sm:table-cell">Status</TableHead>
                <TableHead className="hidden md:table-cell">Completed On</TableHead>
                <TableHead className="text-right">Earnings (TZS)</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && Array.from({ length: 3 }).map((_, i) => <GigRowSkeleton key={i} />)}
              {!isLoading && myGigs && myGigs.length > 0 ? (
                myGigs.map((gig) => (
                  <GigRow key={gig.id} gig={gig} />
                ))
              ) : (
                !isLoading && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-24">
                      You have no assigned gigs yet.
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function GigRow({ gig }: { gig: Task }) {
  const firestore = useFirestore();
  const customerRef = useMemoFirebase(() => firestore ? doc(firestore, 'customers', gig.customerId) : null, [firestore, gig.customerId]);
  const { data: customer, isLoading: isCustomerLoading } = useDoc<Customer>(customerRef);
  
  // A gig always has an accepted offer price. This is the helper's earnings.
  const earnings = gig.acceptedOfferPrice ? gig.acceptedOfferPrice.toLocaleString() : 'N/A';

  return (
    <TableRow>
      <TableCell>
        <div className="font-medium">{gig.title}</div>
        <div className="hidden text-sm text-muted-foreground md:inline">
          {gig.area}
        </div>
      </TableCell>
      <TableCell className="hidden sm:table-cell">
        {isCustomerLoading ? <Skeleton className="h-5 w-24" /> : customer?.fullName}
      </TableCell>
      <TableCell className="hidden sm:table-cell">
        <Badge
          className="capitalize"
          variant={
            gig.status === 'COMPLETED'
              ? 'default'
              : gig.status === 'ASSIGNED' ? 'secondary' : 'outline'
          }
        >
          {gig.status.replace('_', ' ')}
        </Badge>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {gig.completedAt ? format(gig.completedAt.toDate(), 'dd MMM yyyy') : 'Pending'}
      </TableCell>
      <TableCell className="text-right">
        {earnings}
      </TableCell>
      <TableCell className="text-right">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/dashboard/tasks/${gig.id}`}>
            View Details <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </TableCell>
    </TableRow>
  );
}

function GigRowSkeleton() {
  return (
    <TableRow>
      <TableCell>
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-24 mt-1" />
      </TableCell>
      <TableCell className="hidden sm:table-cell">
        <Skeleton className="h-5 w-20" />
      </TableCell>
      <TableCell className="hidden sm:table-cell">
        <Skeleton className="h-6 w-24" />
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <Skeleton className="h-5 w-24" />
      </TableCell>
      <TableCell className="text-right">
        <Skeleton className="h-5 w-20 ml-auto" />
      </TableCell>
      <TableCell className="text-right">
        <Skeleton className="h-9 w-[125px] ml-auto" />
      </TableCell>
    </TableRow>
  );
}
```

---

## File: `src/app/dashboard/header.tsx`

```tsx
'use client';
import Link from 'next/link';
import { Home, PanelLeft, Settings, Package2, Users2, Briefcase, Handshake, Repeat, PlusCircle } from 'lucide-react';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';

import { useUserRole } from '@/context/user-role-context';
import { useUser, useDoc, useFirestore, useMemoFirebase, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { doc } from 'firebase/firestore';
import type { Helper, Customer } from '@/lib/data';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { ClientOnly } from '@/components/client-only';

const breadcrumbMap: Record<string, Record<string, string>> = {
    customer: {
        '/dashboard': 'My Tasks',
        '/dashboard/tasks/new': 'New Task',
        '/dashboard/profile': 'My Profile',
    },
    helper: {
        '/dashboard': 'Browse Tasks',
        '/dashboard/browse': 'Browse Tasks',
        '/dashboard/gigs': 'My Gigs',
        '/dashboard/profile': 'My Profile',
    }
}

export default function AppHeader() {
  const { role, toggleRole, hasCustomerProfile, hasHelperProfile, isRoleLoading } = useUserRole();
  const { user: authUser, isUserLoading } = useUser();
  const firestore = useFirestore();
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const userRef = useMemoFirebase(() => {
    if (!firestore || !authUser) return null;
    const collectionName = role === 'customer' ? 'customers' : 'helpers';
    return doc(firestore, collectionName, authUser.uid);
  }, [firestore, authUser, role]);
  
  const { data: userProfile, isLoading: isProfileLoading } = useDoc<Helper | Customer>(userRef);

  const handleLogout = async () => {
    if (!auth) return;
    await signOut(auth);
    router.push('/login');
  };

  const getBreadcrumbText = () => {
    const roleRoutes = breadcrumbMap[role] || {};
    // Find a matching route, including dynamic ones
    const matchingRoute = Object.keys(roleRoutes).find(route => pathname.startsWith(route) && (pathname.length === route.length || pathname[route.length] === '/'));
    return matchingRoute ? roleRoutes[matchingRoute] : 'Dashboard';
  };

  const breadcrumbText = getBreadcrumbText();
  const canSwitchRoles = hasCustomerProfile && hasHelperProfile;
  
  const isLoading = isUserLoading || isProfileLoading || isRoleLoading;

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <ClientOnly>
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline" className="sm:hidden">
              <PanelLeft className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="sm:max-w-xs">
            <nav className="grid gap-6 text-lg font-medium">
              <Link
                href="#"
                className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
              >
                <Handshake className="h-5 w-5 transition-all group-hover:scale-110" />
                <span className="sr-only">tasKey</span>
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              >
                <Home className="h-5 w-5" />
                Dashboard
              </Link>
               {role === 'customer' ? (
                  <Link href="/dashboard/tasks/new" className="flex items-center gap-4 px-2.5 text-foreground">
                      <PlusCircle className="h-5 w-5" />
                      New Task
                  </Link>
              ) : (
                   <Link href="/dashboard/gigs" className="flex items-center gap-4 px-2.5 text-foreground">
                      <Briefcase className="h-5 w-5" />
                      My Gigs
                  </Link>
              )}
              <Link
                href="/dashboard/profile"
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              >
                <Users2 className="h-5 w-5" />
                Profile
              </Link>
              <Link
                href="#"
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              >
                <Settings className="h-5 w-5" />
                Settings
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </ClientOnly>
      <Breadcrumb className="hidden md:flex">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{breadcrumbText}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="relative ml-auto flex items-center md:grow-0 gap-4">
        <ClientOnly>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="overflow-hidden rounded-full"
              >
                {isLoading || !userProfile ? (
                   <Skeleton className="h-9 w-9 rounded-full" />
                ) : (
                  <Image
                      src={userProfile.profilePhotoUrl}
                      width={36}
                      height={36}
                      alt="Avatar"
                      className="overflow-hidden rounded-full object-cover"
                  />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{isLoading ? <Skeleton className="h-4 w-24" /> : userProfile?.fullName || 'My Account'}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              { isLoading ? (
                <DropdownMenuItem disabled>
                  <Skeleton className="h-4 w-32" />
                </DropdownMenuItem>
              ) : canSwitchRoles ? (
                <DropdownMenuItem onSelect={toggleRole}>
                  <Repeat className="mr-2 h-4 w-4" />
                  <span>Switch to {role === 'customer' ? 'Helper' : 'Customer'} View</span>
                </DropdownMenuItem>
              ) : !hasHelperProfile ? (
                <DropdownMenuItem onSelect={() => router.push('/onboarding/create-profile?role=helper')}>
                  <Briefcase className="mr-2 h-4 w-4" />
                  <span>Become a Helper</span>
                </DropdownMenuItem>
              ) : !hasCustomerProfile ? (
                 <DropdownMenuItem onSelect={() => router.push('/onboarding/create-profile?role=customer')}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  <span>Start Hiring</span>
                </DropdownMenuItem>
              ) : null}

              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => router.push('/dashboard/profile')}>Settings</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => router.push('/support')}>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </ClientOnly>
      </div>
    </header>
  );
}
```

---

## File: `src/app/dashboard/helper-dashboard.tsx`

```tsx
'use client';

import Link from 'next/link';
import {
  ArrowRight,
  ListFilter,
  Search,
  Star,
  BadgeCheck,
  ToggleLeft,
  ToggleRight,
  Shield,
  Briefcase,
  Wrench,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

import { useCollection, useDoc, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, query, where, doc } from 'firebase/firestore';
import type { Task, Helper } from '@/lib/data';
import { taskCategories } from '@/lib/data';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { HelperJourneyBanner } from './helper-journey-banner';


export default function HelperDashboard() {
  const { user: authUser, isUserLoading: isAuthLoading } = useUser();
  const firestore = useFirestore();

  const helperRef = useMemoFirebase(() => authUser && firestore ? doc(firestore, 'helpers', authUser.uid) : null, [authUser, firestore]);
  const { data: helper, isLoading: isHelperLoading } = useDoc<Helper>(helperRef);

  const tasksQuery = useMemoFirebase(() => firestore && authUser ? query(collection(firestore, 'tasks'), where('status', '==', 'OPEN')) : null, [firestore, authUser]);
  const { data: openTasks, isLoading: areTasksLoading } = useCollection<Task>(tasksQuery);
  
  const isLoading = isAuthLoading || isHelperLoading || areTasksLoading;

  return (
    <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
      
      {helper && <HelperJourneyBanner helper={helper} />}

      <div className="grid gap-4 md:grid-cols-[250px_1fr] lg:grid-cols-[300px_1fr] lg:gap-8">
        <div className="grid auto-rows-max items-start gap-4 lg:gap-6">
          <Card>
            {isAuthLoading || isHelperLoading ? (
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
            ) : helper ? (
              <>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="font-headline">{helper.fullName}</CardTitle>
                  {helper.verificationStatus === 'APPROVED' && (
                    <Badge variant="secondary" className="gap-1">
                      <BadgeCheck className="h-3.5 w-3.5" />
                      Verified
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
                  {helper.isAvailable ? (
                      <ToggleRight className="h-5 w-5 text-green-500" />
                  ) : (
                      <ToggleLeft className="h-5 w-5" />
                  )}
                  <span>{helper.isAvailable ? 'Available for tasks' : 'Not available'}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2"><Shield className="h-4 w-4" /> Reliability</span>
                    <Badge variant="outline">{helper.stats.reliabilityLevel}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Rating</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-primary text-primary" />
                      <span>{helper.stats.ratingAvg?.toFixed(1) || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Completed Gigs</span>
                    <span>{helper.stats.jobsCompleted || 0}</span>
                  </div>
                </div>
              </CardContent>
              </>
            ) : (
              <CardContent className="py-6">
                {authUser ? (
                  <p>Could not load helper profile. You may need to create one.</p>
                ) : (
                  <p>Please log in to see your profile.</p>
                )}
              </CardContent>
            )}
            <CardFooter>
              <Button className="w-full" asChild>
                  <Link href="/dashboard/profile">View Profile</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="grid auto-rows-max items-start gap-4 lg:gap-6">
          <div className="flex items-center">
              <h1 className="font-headline text-2xl font-bold">Tasks Near You</h1>
            <div className="ml-auto flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1">
                    <ListFilter className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      Filter
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by category</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {taskCategories.map(cat => (
                      <DropdownMenuCheckboxItem key={cat} checked>
                      {cat}
                      </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by location..."
                  className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                />
              </div>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
              {isLoading && Array.from({length: 2}).map((_, i) => <TaskCardSkeleton key={i} />)}
              {openTasks && openTasks.map(task => {
                  return (
                      <Card key={task.id} className="flex flex-col">
                          <CardHeader>
                              <div className="flex justify-between items-start">
                                  <Badge variant="outline">{task.category}</Badge>
                                  <div className="text-xs text-muted-foreground">
                                      {formatDistanceToNow(task.createdAt.toDate(), { addSuffix: true })}
                                  </div>
                              </div>
                              <CardTitle className="font-headline pt-2">{task.title}</CardTitle>
                          </CardHeader>
                          <CardContent className="flex-grow">
                              <p className="line-clamp-3 text-sm text-muted-foreground">{task.description}</p>
                              <Separator className="my-4" />
                              <div className="grid gap-4">
                                  <div>
                                      <div className="font-semibold text-foreground text-sm">Budget (TZS)</div>
                                      <div className="text-lg font-bold text-primary">{`${task.budget.min.toLocaleString()} - ${task.budget.max.toLocaleString()}`}</div>
                                      <div className="mt-1 text-xs text-muted-foreground">{task.area}</div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                      <div className="flex items-start gap-2">
                                          <Briefcase className="h-4 w-4 mt-0.5 text-muted-foreground"/>
                                          <div>
                                              <p className="text-muted-foreground">Effort</p>
                                              <p className="font-semibold capitalize">{task.effort}</p>
                                          </div>
                                      </div>
                                        <div className="flex items-start gap-2">
                                          <Wrench className="h-4 w-4 mt-0.5 text-muted-foreground"/>
                                          <div>
                                              <p className="text-muted-foreground">Tools</p>
                                              <p className="font-semibold capitalize">{task.toolsRequired?.join(', ') || 'None'}</p>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </CardContent>
                          <CardFooter>
                              <Button className="w-full" asChild>
                                  <Link href={`/dashboard/tasks/${task.id}`}>
                                      View &amp; Make Offer <ArrowRight className="ml-2 h-4 w-4" />
                                  </Link>
                              </Button>
                          </CardFooter>
                      </Card>
                  )
              })}
          </div>
          {openTasks?.length === 0 && !isLoading && authUser && (
              <Card className="md:col-span-2">
                  <CardContent className="p-12 text-center">
                      <p className="text-muted-foreground">No open tasks right now. Check back soon!</p>
                  </CardContent>
              </Card>
          )}
            {!authUser && !isLoading && (
              <Card className="md:col-span-2">
                  <CardContent className="p-12 text-center">
                      <p className="text-muted-foreground">Please log in to browse available tasks.</p>
                  </CardContent>
              </Card>
            )}
        </div>
      </div>
    </div>
  );
}


function TaskCardSkeleton() {
    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-6 w-3/4 pt-2" />
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                </div>
                <Separator className="my-4" />
                <Skeleton className="h-4 w-1/4 mb-2" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-1/3 mt-2" />
            </CardContent>
            <CardFooter>
                <Skeleton className="h-10 w-full" />
            </CardFooter>
        </Card>
    )
}
```

---

## File: `src/app/dashboard/helper-journey-banner.tsx`

```tsx
'use client';
import Link from 'next/link';
import { AlertCircle, CheckCircle2, Loader, Hourglass, Sparkles, UserCheck } from 'lucide-react';

import type { Helper } from '@/lib/data';
import { useHelperJourney } from '@/hooks/use-helper-journey';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

type HelperJourneyBannerProps = {
  helper: Helper;
};

const bannerConfig = {
    PROFILE_INCOMPLETE: {
        icon: <AlertCircle className="h-4 w-4" />,
        title: 'Complete your profile to get verified',
        description: 'You must complete your profile before you can send offers and get assigned to tasks.',
        variant: 'destructive',
        cta: {
            text: 'Complete Profile',
            href: '/dashboard/profile'
        }
    },
    PENDING_VERIFICATION: {
        icon: <Hourglass className="h-4 w-4" />,
        title: 'Verification in Progress',
        description: 'We are reviewing your profile. This usually takes 1-2 business days. We will notify you once it is complete.',
        variant: 'default',
        cta: {
            text: 'View Profile',
            href: '/dashboard/profile'
        }
    },
    VERIFIED_READY: {
        icon: <UserCheck className="h-4 w-4" />,
        title: "You're verified! Start sending offers.",
        description: "Your profile is approved. Browse tasks and send offers to start earning.",
        variant: 'default',
        cta: {
            text: 'Browse Tasks',
            href: '/dashboard/browse'
        }
    },
    ACTIVE: {
        icon: <CheckCircle2 className="h-4 w-4" />,
        title: 'You are active and ready for tasks',
        description: 'Keep your reliability score high and complete tasks professionally to grow.',
        variant: 'default',
        cta: null
    },
    GROWING: {
        icon: <Sparkles className="h-4 w-4" />,
        title: 'You are a top-rated helper!',
        description: 'Customers see your high rating. Keep up the great work!',
        variant: 'default',
        cta: null
    },
    SUSPENDED: {
        icon: <AlertCircle className="h-4 w-4" />,
        title: 'Your account is temporarily suspended',
        description: 'Please contact support for more information on how to reactivate your account.',
        variant: 'destructive',
        cta: {
            text: 'Contact Support',
            href: '/support'
        }
    },
    REGISTERED: {
         icon: <Loader className="h-4 w-4" />,
        title: 'Welcome to tasKey!',
        description: 'The first step is to build your profile so customers can find you.',
        variant: 'default',
        cta: {
            text: 'Create Profile',
            href: '/onboarding/create-profile?role=helper'
        }
    }
}


export function HelperJourneyBanner({ helper }: HelperJourneyBannerProps) {
  const journey = useHelperJourney(helper);

  if (!journey) {
    return null; // Or a skeleton loader
  }

  const { lifecycleStage, profileCompletion } = journey;
  const config = bannerConfig[lifecycleStage] || bannerConfig.REGISTERED;

  // Do not show the banner for these lifecycle stages as it's no longer a primary instruction.
  if (['VERIFIED_READY', 'ACTIVE', 'GROWING'].includes(lifecycleStage)) {
    return null;
  }

  return (
    <Alert variant={config.variant as any} className="mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {config.icon}
        <div className="flex-grow">
          <AlertTitle>{config.title}</AlertTitle>
          <AlertDescription>
            {config.description}
          </AlertDescription>

          {lifecycleStage === 'PROFILE_INCOMPLETE' && (
            <div className="mt-2">
                <div className='flex justify-between items-center mb-1'>
                    <span className="text-xs text-foreground/80">Profile Completion</span>
                    <span className="text-xs font-semibold">{profileCompletion.percent}%</span>
                </div>
              <Progress value={profileCompletion.percent} className="h-2" />
            </div>
          )}

        </div>
        {config.cta && (
          <Button asChild className="w-full sm:w-auto flex-shrink-0">
            <Link href={config.cta.href}>{config.cta.text}</Link>
          </Button>
        )}
      </div>
    </Alert>
  );
}
```

---

## File: `src/app/dashboard/layout.tsx`

```tsx
import { UserRoleProvider } from '@/context/user-role-context';
import AppHeader from './header';
import { AppSidebar } from './sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserRoleProvider>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <AppSidebar />
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <AppHeader />
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            {children}
          </main>
        </div>
      </div>
    </UserRoleProvider>
  );
}
```

---

## File: `src/app/dashboard/page.tsx`

```tsx
'use client';

import Link from 'next/link';
import { useUserRole } from '@/context/user-role-context';
import CustomerDashboard from './customer-dashboard';
import HelperDashboard from './helper-dashboard';

export default function DashboardPage() {
  const { role } = useUserRole();

  // Based on the role, we render a different dashboard
  if (role === 'customer') {
    return <CustomerDashboard />;
  }
  
  return <HelperDashboard />;
}
```

---

## File: `src/app/dashboard/profile/page.tsx`

```tsx
'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useUserRole } from '@/context/user-role-context';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Star, Briefcase, MapPin, Calendar, BadgeCheckIcon, MessageSquare, Shield } from 'lucide-react';
import { format } from 'date-fns';
import { useUser, useFirestore, useDoc, useMemoFirebase, useCollection } from '@/firebase';
import { doc, query, collection, where } from 'firebase/firestore';
import type { Helper, Customer, Feedback } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { ReviewCard } from './review-card';
import { HelperJourneyBanner } from '../helper-journey-banner';

export default function ProfilePage() {
  const { role, isRoleLoading } = useUserRole();
  const { user: authUser, isUserLoading: isAuthLoading } = useUser();
  const firestore = useFirestore();

  const userRef = useMemoFirebase(() => {
    if (!firestore || !authUser) return null;
    const collectionName = role === 'customer' ? 'customers' : 'helpers';
    return doc(firestore, collectionName, authUser.uid);
  }, [firestore, authUser, role]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc<Helper | Customer>(userRef);

  const feedbacksQuery = useMemoFirebase(() => {
    if (!firestore || !authUser || role !== 'helper') return null;
    return query(collection(firestore, 'feedbacks'), where('helperId', '==', authUser.uid));
  }, [firestore, authUser, role]);

  const { data: feedbacks, isLoading: areFeedbacksLoading } = useCollection<Feedback>(feedbacksQuery);

  const isLoading = isAuthLoading || isRoleLoading || isProfileLoading;
  const helperProfile = role === 'helper' ? (userProfile as Helper) : null;

  if (isLoading || !userProfile) {
    return <ProfileSkeleton />;
  }
  
  return (
    <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
      {helperProfile && <HelperJourneyBanner helper={helperProfile} />}
      <div className="grid gap-4 md:grid-cols-[1fr_350px]">
        <div className="grid auto-rows-max items-start gap-4">
          <h1 className="font-headline text-2xl font-bold">Your Profile</h1>
          <Card>
              <CardHeader>
                  <div className="flex items-center gap-6">
                      <Image
                          src={userProfile.profilePhotoUrl}
                          width={96}
                          height={96}
                          alt="Avatar"
                          className="overflow-hidden rounded-full object-cover"
                      />
                      <div>
                          <CardTitle className="font-headline text-3xl">{userProfile.fullName}</CardTitle>
                          <CardDescription className="text-base">{userProfile.email || userProfile.phoneNumber}</CardDescription>
                      </div>
                  </div>
              </CardHeader>
              <CardContent>
              <Separator className="my-4" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  {helperProfile?.serviceAreas && (
                  <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <div>
                          <p className="text-muted-foreground">Service Areas</p>
                          <p className="font-semibold">{helperProfile.serviceAreas.join(', ')}</p>
                      </div>
                  </div>
                  )}
                  <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div>
                          <p className="text-muted-foreground">Member Since</p>
                          <p className="font-semibold">{userProfile?.memberSince ? format(userProfile.memberSince.toDate(), 'MMMM yyyy') : 'N/A'}</p>
                      </div>
                  </div>
                  {helperProfile && (
                      <>
                          <div className="flex items-center gap-3">
                              <BadgeCheckIcon className="h-5 w-5 text-muted-foreground" />
                              <div>
                                  <p className="text-muted-foreground">Verification</p>
                                  <div className="font-semibold">
                                      {helperProfile.verificationStatus === 'APPROVED' ? (
                                          <Badge variant="secondary" className='gap-1 border-green-500/50 text-green-700'>
                                            <BadgeCheckIcon className="h-3 w-3" />
                                            Verified
                                          </Badge>
                                      ) : (
                                          <Badge variant="destructive">Pending</Badge>
                                      )}
                                  </div>
                              </div>
                          </div>
                          <div className="flex items-center gap-3">
                              <Star className="h-5 w-5 text-muted-foreground" />
                              <div>
                                  <p className="text-muted-foreground">Rating</p>
                                  <p className="font-semibold">{helperProfile.stats.ratingAvg ? `${helperProfile.stats.ratingAvg.toFixed(1)} / 5.0` : 'No ratings yet'}</p>
                              </div>
                          </div>
                          <div className="flex items-center gap-3">
                              <Briefcase className="h-5 w-5 text-muted-foreground" />
                              <div>
                                  <p className="text-muted-foreground">Completed Gigs</p>
                                  <p className="font-semibold">{helperProfile.stats.jobsCompleted || 0}</p>
                              </div>
                          </div>
                          <div className="flex items-center gap-3">
                              <Shield className="h-5 w-5 text-muted-foreground" />
                              <div>
                                  <p className="text-muted-foreground">Reliability</p>
                                  <p className="font-semibold">{helperProfile.stats.reliabilityLevel || 'Not Yet Rated'}</p>
                              </div>
                          </div>
                          <div className="flex items-center gap-3 md:col-span-2">
                              <Briefcase className="h-5 w-5 text-muted-foreground" />
                              <div>
                                  <p className="text-muted-foreground">Skills</p>
                                  <div className="flex flex-wrap gap-2">
                                      {helperProfile.serviceCategories?.map(skill => <Badge key={skill} variant="outline">{skill}</Badge>)}
                                  </div>
                              </div>
                          </div>
                          <div className='md:col-span-2'>
                              <h3 className="font-semibold mb-2">About Me</h3>
                              <p className="text-muted-foreground">{helperProfile.aboutMe}</p>
                          </div>
                      </>
                  )}
              </div>
              </CardContent>
          </Card>
        </div>

        <div className="grid auto-rows-max items-start gap-4">
          {helperProfile && (
              <Card>
                  <CardHeader>
                      <CardTitle className="font-headline flex items-center gap-2">
                          <MessageSquare className="h-5 w-5" />
                          Reviews ({feedbacks?.length ?? 0})
                      </CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                      {areFeedbacksLoading && Array.from({length: 2}).map((_, i) => <ReviewCardSkeleton key={i} />)}
                      
                      {!areFeedbacksLoading && feedbacks && feedbacks.length > 0 ? (
                          feedbacks.map(review => <ReviewCard key={review.id} review={review} />)
                      ) : (
                          !areFeedbacksLoading && (
                              <div className="text-center text-sm text-muted-foreground py-8">
                                  No reviews yet. Complete more tasks to get feedback!
                              </div>
                          )
                      )}
                  </CardContent>
              </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function ReviewCardSkeleton() {
    return (
        <div className="border-b pb-4 last:border-b-0 last:pb-0">
            <div className="flex items-center gap-3 mb-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                </div>
                 <Skeleton className="h-5 w-20" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6 mt-1" />
        </div>
    );
}

function ProfileSkeleton() {
  return (
    <div>
      <Skeleton className="h-8 w-48 mb-6" />
      <Card>
        <CardHeader>
          <div className="flex items-center gap-6">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className='space-y-2'>
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-5 w-48" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Separator className="my-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-6 w-6" />
                <div className='space-y-2'>
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
```

---

## File: `src/app/dashboard/profile/review-card.tsx`

```tsx
'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { Feedback, Customer } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

type ReviewCardProps = {
  review: Feedback;
};

export function ReviewCard({ review }: ReviewCardProps) {
  const firestore = useFirestore();

  const customerRef = useMemoFirebase(() => {
    if (!firestore || !review.customerId) return null;
    return doc(firestore, 'customers', review.customerId);
  }, [firestore, review.customerId]);

  const { data: customer, isLoading: isCustomerLoading } = useDoc<Customer>(customerRef);

  return (
    <div className="border-b pb-4 last:border-b-0 last:pb-0">
      <div className="flex items-start justify-between">
        {isCustomerLoading || !customer ? (
            <div className="flex items-center gap-3 mb-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                </div>
            </div>
        ) : (
          <div className="flex items-center gap-3 mb-2">
            <Image
              src={customer.profilePhotoUrl}
              alt={customer.fullName}
              width={32}
              height={32}
              className="rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-semibold">{customer.fullName}</p>
              <p className="text-xs text-muted-foreground">
                {review.createdAt ? formatDistanceToNow(review.createdAt.toDate(), { addSuffix: true }) : ''}
              </p>
            </div>
          </div>
        )}
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={cn(
                'h-4 w-4',
                i < review.rating
                  ? 'fill-primary text-primary'
                  : 'fill-muted text-muted-foreground'
              )}
            />
          ))}
        </div>
      </div>
      <p className="text-sm text-muted-foreground">{review.feedback}</p>
    </div>
  );
}
```

---

## File: `src/app/dashboard/sidebar.tsx`

```tsx
'use client';
import Link from 'next/link';
import {
  Home,
  Briefcase,
  Users2,
  Package2,
  Settings,
  Handshake,
} from 'lucide-react';
import { usePathname } from 'next/navigation';

import { useUserRole } from '@/context/user-role-context';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const CustomerNav = [
  { href: '/dashboard', label: 'My Tasks', icon: Home },
  { href: '/dashboard/tasks/new', label: 'New Task', icon: Package2 },
];

const HelperNav = [
  { href: '/dashboard/browse', label: 'Browse Tasks', icon: Home },
  { href: '/dashboard/gigs', label: 'My Gigs', icon: Briefcase },
];

export function AppSidebar() {
  const { role } = useUserRole();
  const pathname = usePathname();

  const navItems = role === 'customer' ? CustomerNav : HelperNav;

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <TooltipProvider>
        <nav className="flex flex-col items-center gap-4 px-2 py-4">
          <Link
            href="/dashboard"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            <Handshake className="h-4 w-4 transition-all group-hover:scale-110" />
            <span className="sr-only">tasKey</span>
          </Link>

          {navItems.map((item) => (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8',
                    pathname === item.href &&
                      'bg-accent text-accent-foreground'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="sr-only">{item.label}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{item.label}</TooltipContent>
            </Tooltip>
          ))}
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 py-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/dashboard/profile"
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8',
                  (pathname === '/dashboard/profile' || pathname === '/dashboard/settings') &&
                    'bg-accent text-accent-foreground'
                )}
              >
                <Users2 className="h-5 w-5" />
                <span className="sr-only">Profile & Settings</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Profile & Settings</TooltipContent>
          </Tooltip>
        </nav>
      </TooltipProvider>
    </aside>
  );
}
```

---

## File: `src/app/dashboard/tasks/[id]/fit-indicator.tsx`

```tsx
'use client';
import { useState, useEffect, useMemo } from 'react';
import { CheckCircle2, MapPin, Clock, AlertCircle } from 'lucide-react';
import { GeoPoint } from 'firebase/firestore';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { Task, Helper } from '@/lib/data';
import { cn } from '@/lib/utils';
import { useUser, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';


type FitIndicatorProps = {
  task: Task;
};

type FitLevel = 'High' | 'Medium' | 'Low' | 'Unknown';

type FitResult = {
  level: FitLevel;
  reason: string;
  km?: number;
};


function getHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}


const getSkillFit = (task: Task, helper: Helper): FitResult => {
  if (!task.category || !helper.serviceCategories) {
    return { level: 'Unknown', reason: "Category or skills missing." };
  }
  const isMatch = helper.serviceCategories.includes(task.category);
  if (isMatch) {
    return { level: 'High', reason: "You specialize in this task's category." };
  }
  return { level: 'Low', reason: "This task is outside your primary service categories." };
};

const getDistanceFit = (task: Task, helperGeo?: { lat: number; lng: number }): FitResult => {
    const taskLocation = task.location as GeoPoint | undefined;
    if (!helperGeo || !taskLocation) {
        return { level: 'Unknown', reason: "Location data unavailable." };
    }

    const distanceKm = getHaversineDistance(taskLocation.latitude, taskLocation.longitude, helperGeo.lat, helperGeo.lng);
    const thresholds = { near: 3, moderate: 8 };

    if (distanceKm <= thresholds.near) {
        return { level: 'High', km: parseFloat(distanceKm.toFixed(1)), reason: "Task is very close to you." };
    }
    if (distanceKm <= thresholds.moderate) {
        return { level: 'Medium', km: parseFloat(distanceKm.toFixed(1)), reason: "Task is a short drive away." };
    }
    return { level: 'Low', km: parseFloat(distanceKm.toFixed(1)), reason: "Task is far from your location." };
};


const getTimeFit = (task: Task): FitResult => {
    if (task.timeWindow?.toLowerCase() === 'flexible') {
        return { level: 'High', reason: 'Task has a flexible schedule.' };
    }
    if(task.timeWindow){
        return { level: 'Medium', reason: 'Task has a specific time window.' };
    }
    return { level: 'Unknown', reason: 'Time preference not specified.' };
};


export function FitIndicator({ task }: FitIndicatorProps) {
  const { user } = useUser();
  const firestore = useFirestore();
  
  const helperRef = useMemoFirebase(() => (firestore && user) ? doc(firestore, 'helpers', user.uid) : null, [firestore, user]);
  const { data: helper, isLoading: isHelperLoading } = useDoc<Helper>(helperRef);

  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLocationError(null);
        },
        (err) => {
          setLocationError(err.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    } else {
        setLocationError('Geolocation is not supported by your browser.');
    }
  }, []);

  const isLoading = isHelperLoading;

  if (isLoading) {
    return <FitIndicatorSkeleton />;
  }

  if (!helper) {
    return (
       <Card>
          <CardHeader>
              <CardTitle className="font-headline">Task Fit Indicator</CardTitle>
          </CardHeader>
          <CardContent>
              <div className="text-sm text-destructive text-center py-4 flex items-center justify-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Could not load your Helper profile to determine fit.
              </div>
          </CardContent>
       </Card>
    )
  }

  const skillMatch = getSkillFit(task, helper);
  const timeFit = getTimeFit(task);
  const distance = getDistanceFit(task, location || undefined);
  
  const finalDistance = locationError ? { level: 'Unknown', reason: 'Could not get your location.' } as FitResult : distance;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Task Fit Indicator</CardTitle>
        <CardDescription>
          How well this task matches your profile and preferences.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <IndicatorCard title="Skill Match" fit={skillMatch} icon={<CheckCircle2 className="h-5 w-5 text-muted-foreground" />} />
        <IndicatorCard title="Distance" fit={finalDistance} icon={<MapPin className="h-5 w-5 text-muted-foreground" />} />
        <IndicatorCard title="Time" fit={timeFit} icon={<Clock className="h-5 w-5 text-muted-foreground" />} />
      </CardContent>
    </Card>
  );
}

type IndicatorCardProps = {
    title: string;
    fit: FitResult;
    icon: React.ReactNode;
}

function IndicatorCard({ title, fit, icon }: IndicatorCardProps) {
    const textColor = useMemo(() => {
        switch (fit.level) {
            case 'High': return 'text-green-700';
            case 'Medium': return 'text-yellow-700';
            case 'Low': return 'text-red-700';
            default: return 'text-muted-foreground';
        }
    }, [fit.level]);

    return (
        <div className="p-4 rounded-lg border bg-background/50 flex flex-col justify-between">
            <div>
                <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-muted-foreground">
                    {icon}
                    <span>{title}</span>
                </div>
                <div className="flex items-baseline gap-2">
                    <div className={cn("text-lg font-bold", textColor)}>{fit.level}</div>
                    {fit.km !== undefined && <div className="text-sm text-muted-foreground">({fit.km} km)</div>}
                </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{fit.reason}</p>
        </div>
    )
}

function FitIndicatorSkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64 mt-2" />
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg border bg-background/50 space-y-2">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-3 w-full" />
                </div>
                 <div className="p-4 rounded-lg border bg-background/50 space-y-2">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-3 w-full" />
                </div>
                 <div className="p-4 rounded-lg border bg-background/50 space-y-2">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-3 w-full" />
                </div>
            </CardContent>
        </Card>
    )
}
```

---

## File: `src/app/dashboard/tasks/[id]/offer-card.tsx`

```tsx
'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Star, AlarmClock } from 'lucide-react';
import { doc, serverTimestamp } from 'firebase/firestore';

import type { Offer, Helper, Task } from '@/lib/data';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

type OfferCardProps = {
  offer: Offer;
  task: Task;
  onAccept: () => void;
};

export function OfferCard({ offer, task, onAccept }: OfferCardProps) {
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const helperRef = useMemoFirebase(() => firestore && doc(firestore, 'helpers', offer.helperId), [firestore, offer.helperId]);
  const { data: helper, isLoading } = useDoc<Helper>(helperRef);

  const handleAcceptOffer = async () => {
    if (!firestore || !helper) return;

    const taskRef = doc(firestore, 'tasks', offer.taskId);
    const offerRef = doc(firestore, 'tasks', offer.taskId, 'offers', offer.id);

    // 1. Update the task status, assign the helper, and store final price
    updateDocumentNonBlocking(taskRef, {
      status: 'ASSIGNED',
      assignedHelperId: offer.helperId,
      acceptedOfferPrice: offer.price,
      assignedAt: serverTimestamp(),
    });

    // 2. Update the offer status
    updateDocumentNonBlocking(offerRef, {
      status: 'ACCEPTED',
    });
    
    onAccept();

    toast({
      title: 'Offer Accepted!',
      description: `You have assigned ${helper?.fullName} to this task.`,
    });
    
    // In a real app, you would also update all other offers to 'REJECTED'
    // and send notifications. This is simplified for now.
  };

  if (isLoading) {
    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="grid gap-1">
                            <Skeleton className="h-5 w-24" />
                            <Skeleton className="h-4 w-40" />
                        </div>
                    </div>
                    <div className="text-right">
                        <Skeleton className="h-6 w-28" />
                        <Skeleton className="h-3 w-16 mt-1" />
                    </div>
                </div>
                 <Separator className="my-4" />
                 <Skeleton className="h-4 w-full" />
                 <Skeleton className="h-4 w-1/3 mt-3" />
            </CardContent>
        </Card>
    )
  }

  if (!helper) return null;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <Image
              alt="Helper avatar"
              className="rounded-full"
              height={48}
              src={helper.profilePhotoUrl}
              style={{ aspectRatio: '48/48', objectFit: 'cover' }}
              width={48}
            />
            <div className="grid gap-1">
              <div className="font-semibold">{helper.fullName}</div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-0.5">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <span>{helper.rating?.toFixed(1) || 'New'}</span>
                </div>
                <span>&middot;</span>
                <div>{helper.completedTasks || 0} tasks completed</div>
              </div>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-xl font-bold text-primary">{`TZS ${offer.price.toLocaleString()}`}</div>
            <div className="text-xs text-muted-foreground">Offered Price</div>
          </div>
        </div>
        <Separator className="my-4" />
        <p className="text-sm text-muted-foreground">{offer.message}</p>
        <div className="flex items-center text-sm text-muted-foreground mt-3">
            <AlarmClock className="h-4 w-4 mr-2" />
            {offer.eta}
        </div>
        <div className="mt-4 flex justify-end gap-2">
            <Button variant="ghost" asChild>
                <Link href={`/profile/${helper.id}`} target="_blank">View Profile</Link>
            </Button>
            {task.status === 'OPEN' && (
              <Button onClick={handleAcceptOffer}>Accept Offer</Button>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
```

---

## File: `src/app/dashboard/tasks/[id]/page.tsx`

```tsx
'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, Star, AlertTriangle, Briefcase, Wrench, CircleX, UserCheck } from 'lucide-react';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { serverTimestamp } from 'firebase/firestore';


import { useUserRole } from '@/context/user-role-context';
import { useDoc, useCollection, useMemoFirebase } from '@/firebase';
import { addDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';

import { doc, collection, query, where, GeoPoint } from 'firebase/firestore';
import { useFirestore, useUser } from '@/firebase';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { OfferCard } from './offer-card';
import { RecommendedHelpers } from './recommended-helpers';
import type { Task, Offer, Customer, Helper, Feedback } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { ReviewForm } from './review-form';
import { FitIndicator } from './fit-indicator';
import { useHelperJourney } from '@/hooks/use-helper-journey';

const offerFormSchema = z.object({
    price: z.coerce.number().positive({ message: "Please enter a valid price." }),
    eta: z.string().min(3, { message: "Please provide an ETA." }),
    message: z.string().min(10, { message: "Message must be at least 10 characters long."})
});

type OfferFormValues = z.infer<typeof offerFormSchema>;


export default function TaskDetailPage({ params }: { params: { id: string } }) {
  const { id } = use(params);
  const { role } = useUserRole();
  const { user: currentUser, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const taskRef = useMemoFirebase(() => firestore && doc(firestore, 'tasks', id), [firestore, id]);
  const { data: task, isLoading: isTaskLoading, error, mutate: mutateTask } = useDoc<Task>(taskRef);

  const customerRef = useMemoFirebase(() => firestore && task && doc(firestore, 'customers', task.customerId), [firestore, task]);
  const { data: customer, isLoading: isCustomerLoading } = useDoc<Customer>(customerRef);

  const assignedHelperRef = useMemoFirebase(() => firestore && task?.assignedHelperId && doc(firestore, 'helpers', task.assignedHelperId), [firestore, task]);
  const { data: assignedHelper } = useDoc<Helper>(assignedHelperRef);

  const helperProfileRef = useMemoFirebase(() => firestore && currentUser ? doc(firestore, 'helpers', currentUser.uid) : null, [firestore, currentUser]);
  const { data: currentHelperProfile } = useDoc<Helper>(helperProfileRef);
  const journey = useHelperJourney(currentHelperProfile);


  const offersQuery = useMemoFirebase(() => firestore && query(collection(firestore, 'tasks', id, 'offers')), [firestore, id]);
  const { data: offers, isLoading: isOffersLoading, error: offersError } = useCollection<Offer>(offersQuery);

  const feedbacksQuery = useMemoFirebase(() => firestore && task ? query(collection(firestore, 'feedbacks'), where('taskId', '==', task.id)) : null, [firestore, task]);
  const { data: feedbacks, isLoading: areFeedbacksLoading } = useCollection<Feedback>(feedbacksQuery);


  const isCustomerView = role === 'customer';
  const isAssignedHelperView = currentUser?.uid === task?.assignedHelperId;
  const hasMadeOffer = !!offers?.some(o => o.helperId === currentUser?.uid);
  const hasReviewed = (feedbacks?.length ?? 0) > 0;
  
  const canShowFitIndicator = !isCustomerView && !isAssignedHelperView && currentHelperProfile && task?.status === 'OPEN';


  const form = useForm<OfferFormValues>({
    resolver: zodResolver(offerFormSchema),
    defaultValues: {
        price: 0,
        eta: '',
        message: '',
    }
  });
  
  const handleMakeOffer = (data: OfferFormValues) => {
    if (!currentUser || !firestore || !task) {
        toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to make an offer.' });
        return;
    }

    if (!journey?.capabilities.canSendOffers) {
        toast({ variant: 'destructive', title: 'Action Not Allowed', description: 'Your profile is not yet approved to send offers.' });
        return;
    }

    const offerData = {
        taskId: task.id,
        helperId: currentUser.uid,
        price: data.price,
        eta: data.eta,
        message: data.message,
        status: 'ACTIVE',
        createdAt: serverTimestamp(),
    };

    const offersCollection = collection(firestore, 'tasks', task.id, 'offers');
    addDocumentNonBlocking(offersCollection, offerData);
    toast({ title: 'Offer Submitted!', description: 'The customer has been notified of your offer.' });
  }

  const handleAcceptSuccess = () => {
    mutateTask();
  };

  const handleStatusUpdate = (newStatus: 'ACTIVE' | 'COMPLETED' | 'IN_DISPUTE') => {
    if (!taskRef) return;
    
    let updateData: any = { status: newStatus };
    if (newStatus === 'COMPLETED') {
      updateData.completedAt = serverTimestamp();
    }
    if (newStatus === 'ACTIVE') {
      updateData.startedAt = serverTimestamp();
    }
    if (newStatus === 'IN_DISPUTE') {
        updateData.disputedAt = serverTimestamp();
    }
  
    updateDocumentNonBlocking(taskRef, updateData);
  
    mutateTask();
    toast({
      title: 'Task Status Updated',
      description: `Task marked as ${newStatus.toLowerCase().replace('_', ' ')}.`,
    });
  };

  const handleReportSubmit = () => {
    // In a real app, this would submit the report to a backend service.
    // For now, we just show a toast notification.
    toast({
      title: "Report Submitted",
      description: "Thank you for your feedback. Our support team will review the issue.",
    });
  };
  
  if (isTaskLoading || isUserLoading) {
    return <TaskDetailSkeleton />;
  }

  if (!task || error) {
    return (
      <div>
        <h1 className="font-headline text-2xl font-bold">Task not found</h1>
        <p className="text-muted-foreground my-4">This task may have been removed or you do not have permission to view it.</p>
        <Button variant="outline" asChild>
          <Link href="/dashboard">
            <ChevronLeft className="mr-2 h-4 w-4" /> Go Back
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-6xl flex-1 auto-rows-max gap-4">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="h-7 w-7" asChild>
          <Link href={isCustomerView ? "/dashboard" : "/dashboard/gigs"}>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="font-headline text-xl font-semibold tracking-tight">
            {isAssignedHelperView ? 'Gig Details' : 'Task Details'}
          </h1>
          <p className="text-sm text-muted-foreground">
            Task ID: {task.id}
          </p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
          
          {canShowFitIndicator && task && <FitIndicator task={task} />}

          <Card>
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle className="font-headline text-2xl">{task.title}</CardTitle>
                <CardDescription>{task.category} &middot; {task.area}</CardDescription>
              </div>
               <Badge
                className="capitalize text-nowrap"
                variant={
                    task.status === 'OPEN' ? 'secondary' : task.status === 'COMPLETED' ? 'default' : 'outline'
                }
                >
                {task.status.replace('_', ' ')}
                </Badge>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {task.description}
              </p>
              <Separator className="my-6" />
               <div className="grid grid-cols-2 gap-4">
                <div>
                    <div className="font-semibold text-foreground">Budget</div>
                    <div className="text-primary font-bold text-lg">
                        {`TZS ${task.budget.min.toLocaleString()} - ${task.budget.max.toLocaleString()}`}
                    </div>
                </div>
                 <div className="flex items-start gap-2">
                    <Briefcase className="h-5 w-5 mt-0.5 text-muted-foreground"/>
                    <div>
                        <p className="font-semibold text-foreground">Effort</p>
                        <p className="capitalize text-muted-foreground">{task.effort}</p>
                    </div>
                 </div>
                  <div className="flex items-start gap-2">
                    <Wrench className="h-5 w-5 mt-0.5 text-muted-foreground"/>
                    <div>
                        <p className="font-semibold text-foreground">Tools Expected</p>
                        <p className="capitalize text-muted-foreground">{task.toolsRequired?.join(', ') || 'None'}</p>
                    </div>
                 </div>
               </div>
               <Separator className="my-6" />
                <div>
                  <h3 className="font-headline text-base font-semibold mb-4">Task Timeline</h3>
                  <div className="grid gap-4 text-sm sm:grid-cols-3">
                    <div className="grid gap-1">
                      <div className="font-medium text-muted-foreground">Posted</div>
                      <div className="text-foreground">{task.createdAt ? format(task.createdAt.toDate(), 'MMM d, yyyy, p') : '-'}</div>
                    </div>
                    {task.assignedAt && (
                      <div className="grid gap-1">
                        <div className="font-medium text-muted-foreground">Assigned</div>
                        <div className="text-foreground">{format(task.assignedAt.toDate(), 'MMM d, yyyy, p')}</div>
                      </div>
                    )}
                    {task.completedAt && (
                      <div className="grid gap-1">
                        <div className="font-medium text-muted-foreground">Completed</div>
                        <div className="text-foreground">{format(task.completedAt.toDate(), 'MMM d, yyyy, p')}</div>
                      </div>
                    )}
                  </div>
                </div>
                {assignedHelper && (
                  <>
                    <Separator className="my-6" />
                    <div>
                      <h3 className="font-headline text-base font-semibold mb-4">Assigned Helper</h3>
                       <div className="flex items-center gap-4">
                          <Image
                              alt="Helper avatar"
                              className="rounded-full"
                              height={40}
                              src={assignedHelper.profilePhotoUrl || ''}
                              style={{ aspectRatio: '40/40', objectFit: 'cover' }}
                              width={40}
                          />
                          <div>
                              <div className="font-semibold">{assignedHelper.fullName}</div>
                          </div>
                      </div>
                    </div>
                  </>
                )}
            </CardContent>
          </Card>
          
          {isCustomerView ? (
            <>
                {task.status === 'COMPLETED' && !hasReviewed && assignedHelper && !areFeedbacksLoading && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">Confirm Completion</CardTitle>
                            <CardDescription>Review the work and either confirm completion or mark it as incomplete if you are not satisfied.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col sm:flex-row gap-4">
                            <ReviewForm task={task} helper={assignedHelper} />
                            <Button variant="outline" className="gap-2" onClick={() => handleStatusUpdate('IN_DISPUTE')}>
                                <CircleX /> Mark as Incomplete
                            </Button>
                        </CardContent>
                    </Card>
                )}
                 {task.status === 'COMPLETED' && hasReviewed && !areFeedbacksLoading && (
                    <Card>
                        <CardHeader>
                            <CardTitle className='font-headline'>Review Submitted</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-center py-8 text-muted-foreground">Thank you for leaving a review!</p>
                        </CardContent>
                    </Card>
                 )}
                 {task.status === 'IN_DISPUTE' && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline text-destructive">Task in Dispute</CardTitle>
                            <CardDescription>
                                You have marked this task as incomplete. Our support team will review this and get in touch with you and the helper to resolve the issue.
                            </CardDescription>
                        </CardHeader>
                    </Card>
                 )}

                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Offers ({offers?.length || 0})</CardTitle>
                        <CardDescription>
                            Review the offers from helpers below. You can view their profile before accepting.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        {isOffersLoading && <Skeleton className="h-24 w-full" />}
                        {!isOffersLoading && offersError && (
                             <div className="text-center py-8 text-destructive">Could not load offers. You may not have permission.</div>
                        )}
                        {!isOffersLoading && !offersError && offers && offers.length > 0 ? offers.map(offer => (
                            <OfferCard key={offer.id} offer={offer} task={task} onAccept={handleAcceptSuccess} />
                        )) : (
                           !isOffersLoading &&  <div className="text-center py-8 text-muted-foreground">No offers received yet.</div>
                        )}
                    </CardContent>
                </Card>
                <RecommendedHelpers task={task} />
            </>
          ) : isAssignedHelperView ? (
             <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Helper Actions</CardTitle>
                    <CardDescription>Manage the status of this gig.</CardDescription>
                </CardHeader>
                <CardContent>
                    {task.status === 'ASSIGNED' && (
                        <Button className="w-full" onClick={() => handleStatusUpdate('ACTIVE')}>
                            Start Task
                        </Button>
                    )}
                    {task.status === 'ACTIVE' && (
                         <Button className="w-full" onClick={() => handleStatusUpdate('COMPLETED')}>
                            Mark as Complete
                        </Button>
                    )}
                    {task.status === 'COMPLETED' && (
                        <p className="text-center text-sm text-muted-foreground">This task is complete. Awaiting customer review.</p>
                    )}
                     {task.status === 'IN_DISPUTE' && (
                        <p className="text-center text-sm text-destructive">The customer has disputed this task's completion. Awaiting review.</p>
                    )}
                     {task.status === 'CANCELLED' && (
                        <p className="text-center text-sm text-muted-foreground">This task was cancelled.</p>
                    )}
                </CardContent>
             </Card>
          ) : (
            <>
                {task.status === 'OPEN' && !hasMadeOffer && (
                    <>
                    {journey?.capabilities.canSendOffers ? (
                        <Card>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(handleMakeOffer)}>
                                    <CardHeader>
                                    <CardTitle className="font-headline">Make an Offer</CardTitle>
                                    <CardDescription>
                                        Submit your price and a message to the customer.
                                    </CardDescription>
                                    </CardHeader>
                                    <CardContent className="grid gap-6">
                                        <FormField
                                            control={form.control}
                                            name="price"
                                            render={({ field }) => (
                                                <FormItem>
                                                <FormLabel>Your Price (TZS)</FormLabel>
                                                <FormControl>
                                                    <Input type="number" placeholder="e.g., 25,000" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="eta"
                                            render={({ field }) => (
                                                <FormItem>
                                                <FormLabel>Availability / ETA</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g., Tomorrow afternoon" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="message"
                                            render={({ field }) => (
                                                <FormItem>
                                                <FormLabel>Message to Customer</FormLabel>
                                                <FormControl>
                                                    <Textarea placeholder="Introduce yourself and explain why you're a good fit for this task." className="min-h-24" {...field}/>
                                                </FormControl>
                                                <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </CardContent>
                                    <CardFooter>
                                        <Button type="submit" className="ml-auto" disabled={form.formState.isSubmitting}>
                                            {form.formState.isSubmitting ? 'Submitting...' : 'Submit Offer'}
                                        </Button>
                                    </CardFooter>
                                </form>
                            </Form>
                        </Card>
                    ) : (
                        <Card>
                             <CardHeader>
                                <CardTitle className="font-headline flex items-center gap-2">
                                    <UserCheck className="h-5 w-5" />
                                    Become a Verified Helper
                                </CardTitle>
                                <CardDescription>
                                    You must complete your profile and get verified before you can make offers on tasks.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button asChild className="w-full">
                                    <Link href="/dashboard/profile">Complete Your Profile</Link>
                                </Button>
                                <p className="text-xs text-center text-muted-foreground mt-3">Once your profile is complete, our team will review it for verification.</p>
                            </CardContent>
                        </Card>
                    )}
                    </>
                )}
                {task.status === 'OPEN' && hasMadeOffer && (
                     <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">Your Offer</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-center py-8 text-muted-foreground">You have already submitted an offer for this task. The customer will be in touch if they select you.</p>
                        </CardContent>
                    </Card>
                )}
                 {task.status !== 'OPEN' && !isAssignedHelperView && (
                     <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">Task Not Available</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-center py-8 text-muted-foreground">This task is no longer open for offers.</p>
                        </CardContent>
                    </Card>
                )}
            </>
          )}

        </div>
        <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">{isAssignedHelperView ? 'Customer' : 'Posted by'}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              {isCustomerLoading ? (
                <div className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              ) : customer ? (
                <div className="flex items-center gap-4">
                    <Image
                        alt="Customer avatar"
                        className="rounded-full"
                        height={40}
                        src={customer.profilePhotoUrl || ''}
                        style={{ aspectRatio: '40/40', objectFit: 'cover' }}
                        width={40}
                    />
                    <div>
                        <div className="font-semibold">{customer.fullName}</div>
                    </div>
                </div>
              ) : null}
                 <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <Star className="h-4 w-4 fill-muted-foreground text-muted-foreground" />
                    <span className="ml-1 text-foreground font-semibold">4.0</span> (5 reviews)
                 </div>
            </CardContent>
          </Card>
          
          {task.disputedAt && (
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-base text-destructive">Dispute Information</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 text-sm">
                    <div className="grid gap-1">
                        <div className="font-medium text-muted-foreground">Disputed On</div>
                        <div className="font-medium text-destructive">{format(task.disputedAt.toDate(), 'MMM d, yyyy, p')}</div>
                    </div>
                </CardContent>
            </Card>
          )}
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-base">Safety &amp; Support</CardTitle>
            </CardHeader>
            <CardContent>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Report a Problem
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Report an Issue</AlertDialogTitle>
                    <AlertDialogDescription>
                      Describe the problem you're experiencing with this task or user. Your report will be sent to our support team for review. This is confidential.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="grid gap-4 py-4">
                    <Textarea placeholder="Please provide as much detail as possible..." className="min-h-[120px]" />
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>

                    <AlertDialogAction onClick={handleReportSubmit}>Submit Report</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


function TaskDetailSkeleton() {
  return (
    <div className="mx-auto grid max-w-6xl flex-1 auto-rows-max gap-4">
      <div className="flex items-center gap-4">
        <Skeleton className="h-7 w-7 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <Separator className="my-6" />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-32" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-32" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
             <CardHeader>
                <Skeleton className="h-6 w-1/3" />
             </CardHeader>
             <CardContent>
                <Skeleton className="h-24 w-full" />
             </CardContent>
          </Card>
        </div>
        <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-2/3" />
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
```

---

## File: `src/app/dashboard/tasks/[id]/recommended-helpers.tsx`

```tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Sparkles, Star } from 'lucide-react';
import type { Task, Helper } from '@/lib/data';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { recommendHelpersForTask } from '@/ai/flows/recommend-helpers-for-task';
import { useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';


type RecommendedHelpersProps = {
  task: Task;
};

export function RecommendedHelpers({ task }: RecommendedHelpersProps) {
  const [recommended, setRecommended] = useState<Helper[]>([]);
  const [loading, setLoading] = useState(true);
  const firestore = useFirestore();

  useEffect(() => {
    const getRecommendations = async () => {
      if (!firestore) return;
      setLoading(true);
      try {
        const result = await recommendHelpersForTask({
          taskDescription: task.description,
          taskLocation: task.area,
          customerRating: 4.5, // Mock customer rating
        });
        
        if (result.recommendedHelpers && result.recommendedHelpers.length > 0) {
            const helpersQuery = query(collection(firestore, 'helpers'), where('id', 'in', result.recommendedHelpers));
            const querySnapshot = await getDocs(helpersQuery);
            const fetchedHelpers: Helper[] = [];
            querySnapshot.forEach(doc => {
                fetchedHelpers.push(doc.data() as Helper);
            });
            setRecommended(fetchedHelpers);
        }
        
      } catch (error) {
        console.error('Failed to get recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    if (task && firestore) {
        // Temporarily disable while AI functionality is being debugged.
        // In a real scenario, you'd want this active.
        // getRecommendations(); 
        setLoading(false);
    }
  }, [task, firestore]);

  if (!task) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <span>AI Recommended Helpers</span>
        </CardTitle>
        <CardDescription>
          Based on your task, here are some top-rated helpers we think would be a great fit.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {loading ? (
            Array.from({ length: 2 }).map((_, index) => (
                <div key={index} className="flex items-center space-x-4 p-2">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-[150px]" />
                        <Skeleton className="h-4 w-[200px]" />
                    </div>
                </div>
            ))
        ) : recommended.length > 0 ? (
            recommended.map(helper => (
                <div key={helper.id} className="flex items-center justify-between gap-4 rounded-lg border p-3">
                     <div className="flex items-center gap-4">
                        <Image
                            alt="Helper avatar"
                            className="rounded-full"
                            height={48}
                            src={helper.profilePhotoUrl}
                            style={{ aspectRatio: '48/48', objectFit: 'cover' }}
                            width={48}
                        />
                        <div className="grid gap-1">
                        <div className="font-semibold">{helper.fullName}</div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-0.5">
                            <Star className="h-4 w-4 fill-primary text-primary" />
                            <span>{helper.rating}</span>
                            </div>
                            <span>&middot;</span>
                            <div>{helper.serviceAreas[0]}</div>
                        </div>
                        </div>
                    </div>
                    <Button size="sm" variant="outline">Invite to Offer</Button>
                </div>
            ))
        ) : (
            <p className="text-center text-sm text-muted-foreground py-4">AI recommendations will appear here.</p>
        )}
      </CardContent>
    </Card>
  );
}
```

---

## File: `src/app/dashboard/tasks/[id]/review-form.tsx`

```tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Star } from 'lucide-react';
import { collection, serverTimestamp } from 'firebase/firestore';

import { useFirestore, useUser } from '@/firebase';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import type { Task, Helper } from '@/lib/data';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const reviewFormSchema = z.object({
  rating: z.number().min(1, 'Please select a rating.'),
  feedback: z.string().min(10, 'Feedback must be at least 10 characters.'),
});

type ReviewFormValues = z.infer<typeof reviewFormSchema>;

type ReviewFormProps = {
  task: Task;
  helper: Helper;
};

export function ReviewForm({ task, helper }: ReviewFormProps) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [hoverRating, setHoverRating] = useState(0);

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      rating: 0,
      feedback: '',
    },
  });

  const onSubmit = async (data: ReviewFormValues) => {
    if (!user || !firestore) {
      toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to leave a review.' });
      return;
    }

    const reviewData = {
      taskId: task.id,
      customerId: user.uid,
      helperId: helper.id,
      rating: data.rating,
      feedback: data.feedback,
      createdAt: serverTimestamp(),
    };
    
    const reviewsCollection = collection(firestore, 'feedbacks');
    addDocumentNonBlocking(reviewsCollection, reviewData);
    
    toast({ title: 'Review Submitted', description: 'Thank you for your feedback!' });
    form.reset();
    // In a real app, you'd likely trigger a re-fetch of the parent component's data
    // to hide this form. For now, the parent's logic handles this.
  };

  return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <div className="grid gap-6">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Overall Rating</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-1" onMouseLeave={() => setHoverRating(0)}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={cn(
                            'h-8 w-8 cursor-pointer transition-colors',
                            (hoverRating || field.value) >= star
                              ? 'text-primary fill-primary'
                              : 'text-muted-foreground/50'
                          )}
                          onMouseEnter={() => setHoverRating(star)}
                          onClick={() => field.onChange(star)}
                        />
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="feedback"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Feedback</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={`Share details of your experience with ${helper.fullName}...`}
                      className="min-h-24"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Submitting...' : 'Submit Review'}
            </Button>
          </div>
        </form>
      </Form>
  );
}
```

---

## File: `src/app/dashboard/tasks/new/page.tsx`

```tsx
'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ChevronLeft } from 'lucide-react';

import { useUser, useFirestore } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { taskCategories } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { useUserRole } from '@/context/user-role-context';


const taskFormSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters." }),
  description: z.string().min(20, { message: "Description must be at least 20 characters." }),
  category: z.string({ required_error: "Please select a category." }),
  area: z.string().min(3, { message: "Please enter a location." }),
  budget: z.object({
    min: z.coerce.number().positive(),
    max: z.coerce.number().positive(),
  }),
  effort: z.enum(['light', 'medium', 'heavy'], { required_error: "Please estimate the effort level."}),
  toolsRequired: z.string().optional(),
});

type TaskFormValues = z.infer<typeof taskFormSchema>;


export default function NewTaskPage() {
    const { user } = useUser();
    const firestore = useFirestore();
    const router = useRouter();
    const { toast } = useToast();
    const { role } = useUserRole();

    const form = useForm<TaskFormValues>({
        resolver: zodResolver(taskFormSchema),
        defaultValues: {
            title: '',
            description: '',
            area: '',
            budget: {
                min: 0,
                max: 0,
            },
            toolsRequired: '',
        }
    });

    const onSubmit = async (data: TaskFormValues) => {
        if (!user || !firestore) {
            toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to post a task.' });
            return;
        }

        const taskData = {
            customerId: user.uid,
            title: data.title,
            description: data.description,
            category: data.category,
            area: data.area,
            budget: {
                min: data.budget.min,
                max: data.budget.max,
            },
            effort: data.effort,
            toolsRequired: data.toolsRequired?.split(',').map(t => t.trim()).filter(Boolean) || [],
            // Default values for fields not in the form
            timeWindow: 'Flexible',
            status: 'OPEN',
            createdAt: serverTimestamp(),
        };

        try {
            const tasksCollection = collection(firestore, 'tasks');
            await addDocumentNonBlocking(tasksCollection, taskData);
            toast({ title: 'Task Posted!', description: 'Your task is now live for helpers to see.' });
            router.push('/dashboard');
        } catch (error: any) {
            console.error("Error posting task:", error);
            toast({ variant: 'destructive', title: 'Failed to Post Task', description: error.message });
        }
    }
    
    if (role === 'helper') {
        return (
             <div className="mx-auto grid max-w-4xl flex-1 auto-rows-max gap-4">
                <Card>
                    <CardHeader>
                    <CardTitle>Access Denied</CardTitle>
                    </CardHeader>
                    <CardContent>
                    <p>This page is only available to customers. Please switch to your customer profile to post a task.</p>
                    <Button asChild className="mt-4">
                        <Link href="/dashboard">Go to Dashboard</Link>
                    </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

  return (
    <div className="mx-auto grid max-w-4xl flex-1 auto-rows-max gap-4">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="h-7 w-7" asChild>
            <Link href="/dashboard">
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
            </Link>
        </Button>
        <h1 className="flex-1 shrink-0 whitespace-nowrap font-headline text-xl font-semibold tracking-tight sm:grow-0">
          Post a New Task
        </h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Task Details</CardTitle>
          <CardDescription>
            Fill out the form below to find a helper for your task. The more details you provide, the better offers you'll get.
          </CardDescription>
        </CardHeader>
        <CardContent>
           <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Task Title</FormLabel>
                        <FormControl>
                            <Input placeholder='e.g., "Deep Clean My Kitchen"' {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                           <Textarea
                                placeholder="Describe what needs to be done. Include any important details like size of the area, specific instructions, or if you will provide supplies."
                                className="min-h-32"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                    {taskCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="area"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., Masaki, Dar es Salaam" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                 <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                     <FormField
                        control={form.control}
                        name="effort"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Effort Level</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select estimated effort" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="light">Light (1-2 hours, simple task)</SelectItem>
                                        <SelectItem value="medium">Medium (2-4 hours, standard task)</SelectItem>
                                        <SelectItem value="heavy">Heavy (4+ hours, demanding task)</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="toolsRequired"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Tools Expected (comma-separated)</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., Bucket, soap, iron" {...field} />
                            </FormControl>
                             <FormDescription>
                                List any tools the helper is expected to have. Leave blank if none.
                             </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                 <div className="grid gap-3">
                    <Label>Budget Range (TZS)</Label>
                    <div className="grid grid-cols-2 gap-4">
                       <FormField
                            control={form.control}
                            name="budget.min"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel className="text-sm text-muted-foreground">Minimum</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="e.g., 20,000" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="budget.max"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel className="text-sm text-muted-foreground">Maximum</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="e.g., 30,000" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
                 <div className="flex items-center gap-4">
                    <Button type="submit" className="ml-auto" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? 'Posting...' : 'Post Task'}
                    </Button>
                    <Button variant="outline">Save Draft</Button>
                </div>
          </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## File: `src/app/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 203 100% 95%;
    --foreground: 207 82% 22%;
    --card: 0 0% 100%;
    --card-foreground: 207 82% 22%;
    --popover: 0 0% 100%;
    --popover-foreground: 207 82% 22%;
    --primary: 203 100% 63%;
    --primary-foreground: 0 0% 100%;
    --secondary: 203 100% 90%;
    --secondary-foreground: 207 82% 22%;
    --muted: 203 100% 92%;
    --muted-foreground: 207 50% 45%;
    --accent: 207 82% 22%;
    --accent-foreground: 0 0% 100%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 203 50% 88%;
    --input: 203 50% 88%;
    --ring: 203 100% 63%;
    --radius: 0.5rem;
    --chart-1: 12 76% 61%;
    --chart-2: 173 58% 39%;
    --chart-3: 197 37% 24%;
    --chart-4: 43 74% 66%;
    --chart-5: 27 87% 67%;
  }

  .dark {
    --background: 207 82% 5%;
    --foreground: 203 100% 95%;
    --card: 207 82% 8%;
    --card-foreground: 203 100% 95%;
    --popover: 207 82% 5%;
    --popover-foreground: 203 100% 95%;
    --primary: 203 100% 63%;
    --primary-foreground: 207 82% 5%;
    --secondary: 207 82% 10%;
    --secondary-foreground: 203 100% 95%;
    --muted: 207 82% 10%;
    --muted-foreground: 203 50% 70%;
    --accent: 203 100% 63%;
    --accent-foreground: 207 82% 5%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 207 82% 15%;
    --input: 207 82% 15%;
    --ring: 203 100% 63%;
    --chart-1: 220 70% 50%;
    --chart-2: 160 60% 45%;
    --chart-3: 30 80% 55%;
    --chart-4: 280 65% 60%;
    --chart-5: 340 75% 55%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

---

## File: `src/app/layout.tsx`

```tsx
import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { cn } from '@/lib/utils';
import { FirebaseClientProvider } from '@/firebase/client-provider';

export const metadata: Metadata = {
  title: 'tasKey: On-Demand Assistance',
  description:
    'A Tanzanian-built, digital on-demand assistance platform designed to help people manage everyday life tasks.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&family=Space+Grotesk:wght@300..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn('font-body antialiased', 'min-h-screen bg-background')}>
        <FirebaseClientProvider>
          {children}
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
```

---

## File: `src/app/login/auth-form.tsx`

```tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useUser } from '@/firebase';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { User, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

const testAccounts = [
  { role: 'Customer', email: 'customer@taskey.app', password: 'password123' },
  { role: 'Helper', email: 'helper@taskey.app', password: 'password123' },
];

export default function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authAction, setAuthAction] = useState<'signIn' | 'signUp'>('signIn');
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    const checkUserProfile = async (currentUser: User) => {
        const db = getFirestore();
        // Check for both customer and helper profiles
        const helperDocRef = doc(db, 'helpers', currentUser.uid);
        const customerDocRef = doc(db, 'customers', currentUser.uid);
        
        const [helperDoc, customerDoc] = await Promise.all([
          getDoc(helperDocRef),
          getDoc(customerDocRef)
        ]);

        if (helperDoc.exists() || customerDoc.exists()) {
            // If either profile exists, go to the main dashboard
            router.push('/dashboard');
        } else {
            // If no profile exists for this user, they must create one
            router.push('/onboarding/create-profile');
        }
    };
    
    // When user object is available, check for their profile
    if (!isUserLoading && user) {
        checkUserProfile(user);
    }
  }, [user, isUserLoading, router]);

  const handleAuth = async () => {
    if (!auth) {
        toast({
            variant: 'destructive',
            title: 'Auth service not available',
        });
        return;
    }
    if (!email || !password) {
      toast({
        variant: 'destructive',
        title: 'Missing Fields',
        description: 'Please enter both email and password.',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (authAction === 'signIn') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      // The useEffect will handle redirection after successful auth
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Authentication Failed",
            description: error.message || "An unexpected error occurred.",
        });
        setIsSubmitting(false);
    }
  };

  const setTestCredentials = (account: typeof testAccounts[0]) => {
    setEmail(account.email);
    setPassword(account.password);
  }

  // Show a loading state while checking for user profile or if user is already logged in
  if (isUserLoading || user) {
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="text-center">
                <p className="font-semibold">Loading Dashboard...</p>
                <p className="text-sm text-muted-foreground">Please wait a moment.</p>
            </div>
        </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
        <Tabs defaultValue="signIn" onValueChange={(value) => setAuthAction(value as 'signIn' | 'signUp')}>
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signIn">Sign In</TabsTrigger>
                <TabsTrigger value="signUp">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="signIn">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Login</CardTitle>
                        <CardDescription>
                        Enter your email and password to access your account.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                        <Label htmlFor="email-signin">Email</Label>
                        <Input 
                            id="email-signin" 
                            type="email" 
                            placeholder="m@example.com" 
                            required 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isSubmitting}
                            />
                        </div>
                        <div className="space-y-2">
                        <Label htmlFor="password-signin">Password</Label>
                        <Input 
                            id="password-signin" 
                            type="password" 
                            required 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isSubmitting}
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button 
                            className="w-full" 
                            onClick={handleAuth}
                            disabled={isSubmitting}>
                                {isSubmitting ? 'Signing In...' : 'Sign In'}
                        </Button>
                    </CardFooter>
                </Card>
            </TabsContent>
            <TabsContent value="signUp">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Register</CardTitle>
                        <CardDescription>
                        Create a new account to get started with tasKey.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                        <Label htmlFor="email-signup">Email</Label>
                        <Input 
                            id="email-signup" 
                            type="email" 
                            placeholder="m@example.com" 
                            required 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isSubmitting}
                            />
                        </div>
                        <div className="space-y-2">
                        <Label htmlFor="password-signup">Password</Label>
                        <Input 
                            id="password-signup" 
                            type="password" 
                            required 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isSubmitting}
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button 
                            className="w-full" 
                            onClick={handleAuth}
                            disabled={isSubmitting}>
                                {isSubmitting ? 'Registering...' : 'Create Account'}
                        </Button>
                    </CardFooter>
                </Card>
            </TabsContent>
        </Tabs>
        <Card className="mt-4">
            <CardHeader>
                <CardTitle className="text-sm">Test Accounts</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2 text-sm">
                {testAccounts.map(acc => (
                    <Button key={acc.role} variant="outline" size="sm" onClick={() => setTestCredentials(acc)}>
                       Log in as {acc.role}
                    </Button>
                ))}
            </CardContent>
             <CardFooter>
                <p className="text-xs text-muted-foreground">Note: If registering for the first time, use the "Register" tab. The password for both accounts is `password123`.</p>
            </CardFooter>
        </Card>
    </div>
  );
}
```

---

## File: `src/app/login/page.tsx`

```tsx
import AuthForm from './auth-form';

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <AuthForm />
    </div>
  );
}
```

---

## File: `src/app/onboarding/create-profile/page.tsx`

```tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { doc, setDoc, serverTimestamp, Timestamp } from 'firebase/firestore';

import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { taskCategories } from '@/lib/data';
import type { Helper } from '@/lib/data';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';

const testAccounts = {
  'customer@taskey.app': {
    role: 'customer',
    fullName: 'Aisha Customer',
  },
  'helper@taskey.app': {
    role: 'helper',
    fullName: 'Baraka Helper',
    serviceCategories: ['Cleaning', 'Laundry'],
    serviceAreas: 'Masaki, Msasani',
    aboutMe: 'Reliable and detail-oriented helper with 3+ years of experience in home cleaning and laundry services. I take pride in my work and always ensure customer satisfaction.',
  }
};


const profileFormSchema = z.object({
  role: z.enum(['helper', 'customer'], { required_error: 'You must select a role.' }),
  fullName: z.string().min(3, { message: 'Full name must be at least 3 characters.' }),
  serviceCategories: z.array(z.string()).optional(),
  serviceAreas: z.string().optional(),
  aboutMe: z.string().optional(),
}).refine(data => {
    if (data.role === 'helper') {
        return data.serviceCategories && data.serviceCategories.length > 0;
    }
    return true;
}, {
    message: 'You have to select at least one service category.',
    path: ['serviceCategories'],
}).refine(data => {
    if (data.role === 'helper') {
        return data.serviceAreas && data.serviceAreas.length > 3;
    }
    return true;
}, {
    message: 'Please enter at least one service area.',
    path: ['serviceAreas'],
}).refine(data => {
    if (data.role === 'helper') {
        return data.aboutMe && data.aboutMe.length > 10;
    }
    return true;
}, {
    message: 'Please tell us a little about yourself (at least 10 characters).',
    path: ['aboutMe'],
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function CreateProfilePage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultAvatar = useMemoFirebase(() => PlaceHolderImages.find(p => p.id === 'avatar-1'), []);
  const defaultHelperAvatar = useMemoFirebase(() => PlaceHolderImages.find(p => p.id === 'avatar-2'), []);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
        role: 'customer',
        fullName: '',
        serviceCategories: [],
        serviceAreas: '',
        aboutMe: '',
    }
  });

  const selectedRole = form.watch('role');

  useEffect(() => {
    // Set role from query param
    const roleFromQuery = searchParams.get('role');
    if (roleFromQuery === 'helper' || roleFromQuery === 'customer') {
      form.setValue('role', roleFromQuery);
    }
    
    // Pre-fill form if it's a test user
    if (user?.email && user.email in testAccounts) {
      const testData = testAccounts[user.email as keyof typeof testAccounts];
      form.reset(testData);
    }
  }, [searchParams, form, user]);


  const onSubmit = async (data: ProfileFormValues) => {
    if (!user || !firestore) {
        toast({ variant: 'destructive', title: 'Error', description: 'User not authenticated or system not ready.' });
        return;
    }
    
    setIsSubmitting(true);

    try {
        if (data.role === 'helper') {
            if (!defaultHelperAvatar) throw new Error("Default avatar not found");

            // Calculate profile completion
            const missing: Array<'profilePhoto' | 'serviceCategories' | 'serviceAreas' | 'aboutMe'> = [];
            // We assume a photo is always available for now, but this shows how to check
            if (!data.serviceCategories || data.serviceCategories.length === 0) missing.push('serviceCategories');
            if (!data.serviceAreas || data.serviceAreas.trim().length < 3) missing.push('serviceAreas');
            if (!data.aboutMe || data.aboutMe.trim().length < 10) missing.push('aboutMe');
            
            const completionPercent = Math.round(( (4 - missing.length) / 4) * 100);

            const helperData: Helper = {
                id: user.uid,
                email: user.email,
                phoneNumber: user.phoneNumber || '',
                fullName: data.fullName,
                profilePhotoUrl: defaultHelperAvatar.imageUrl,
                serviceCategories: data.serviceCategories || [],
                serviceAreas: data.serviceAreas?.split(',').map(s => s.trim()) || [],
                aboutMe: data.aboutMe || '',
                isAvailable: true, // Default to available
                memberSince: serverTimestamp() as Timestamp,
                
                // Lifecycle fields
                verificationStatus: 'PENDING',
                lifecycleStage: completionPercent < 100 ? 'PROFILE_INCOMPLETE' : 'PENDING_VERIFICATION',
                profileCompletion: {
                  percent: completionPercent,
                  missing: missing,
                },
                stats: {
                  jobsCompleted: 0,
                  jobsCancelled: 0,
                  ratingAvg: 0,
                  reliabilityLevel: 'GREEN',
                },

                // Legacy fields (set to default/empty)
                reliabilityIndicator: 'Good',
                rating: 0,
                completedTasks: 0,
            };
            await setDoc(doc(firestore, 'helpers', user.uid), helperData);
        } else {
            if (!defaultAvatar) throw new Error("Default avatar not found");
            const customerData = {
                id: user.uid,
                email: user.email,
                phoneNumber: user.phoneNumber || '',
                fullName: data.fullName,
                profilePhotoUrl: defaultAvatar.imageUrl,
                rating: 4.0,
                memberSince: serverTimestamp(),
            };
            await setDoc(doc(firestore, 'customers', user.uid), customerData);
        }

        toast({ title: 'Profile Created!', description: "Welcome to tasKey. You're all set up." });
        router.push('/dashboard');
    } catch (error: any) {
        console.error("Error creating profile: ", error);
        toast({ variant: 'destructive', title: 'Profile Creation Failed', description: error.message });
        setIsSubmitting(false);
    }
  };
  
  if (isUserLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center py-12">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Create Your Profile</CardTitle>
          <CardDescription>
            Complete these last few steps to get started with tasKey. Your information has been pre-filled for this test.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                 <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                        <FormLabel>What do you want to do on tasKey?</FormLabel>
                        <FormControl>
                            <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="flex flex-col space-y-1"
                            >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                <RadioGroupItem value="customer" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                Post tasks and find help
                                </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                <RadioGroupItem value="helper" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                 Earn money as a helper
                                </FormLabel>
                            </FormItem>
                            </RadioGroup>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., Juma Hamisi" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />

                {selectedRole === 'helper' && (
                    <>
                        <FormField
                            control={form.control}
                            name="serviceCategories"
                            render={() => (
                                <FormItem>
                                <div className="mb-4">
                                    <FormLabel className="text-base">Service Categories</FormLabel>
                                    <FormDescription>
                                        Select the types of tasks you are skilled in.
                                    </FormDescription>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {taskCategories.map((item) => (
                                        <FormField
                                        key={item}
                                        control={form.control}
                                        name="serviceCategories"
                                        render={({ field }) => {
                                            return (
                                            <FormItem
                                                key={item}
                                                className="flex flex-row items-start space-x-3 space-y-0"
                                            >
                                                <FormControl>
                                                <Checkbox
                                                    checked={field.value?.includes(item)}
                                                    onCheckedChange={(checked) => {
                                                    return checked
                                                        ? field.onChange([...(field.value ?? []), item])
                                                        : field.onChange(
                                                            field.value?.filter(
                                                            (value) => value !== item
                                                            )
                                                        )
                                                    }}
                                                />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                {item}
                                                </FormLabel>
                                            </FormItem>
                                            )
                                        }}
                                        />
                                    ))}
                                </div>
                                <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="serviceAreas"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Service Areas</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., Masaki, Msasani, Mbezi Beach" {...field} />
                                </FormControl>
                                <FormDescription>
                                    List the neighborhoods or wards you can work in, separated by commas.
                                </FormDescription>
                                <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="aboutMe"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>About Me</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Tell customers a bit about your experience and why you're a great helper."
                                        className="resize-none"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </>
                )}
                
                <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? 'Saving Profile...' : 'Complete Profile & View Dashboard'}
                </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## File: `src/app/page.tsx`

```tsx
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Clock, ShieldCheck, Zap } from 'lucide-react';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function LandingPage() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-image');

  const howItWorksSteps = [
    {
      title: '1. Post Your Task',
      description:
        'Describe what you need done, set your location, and suggest a budget. It’s quick, easy, and free.',
      icon: <Zap className="h-10 w-10" />,
    },
    {
      title: '2. Select Your Helper',
      description:
        'Receive offers from verified local helpers. Review their profiles, ratings, and price, then choose the best fit for you.',
      icon: <CheckCircle className="h-10 w-10" />,
    },
    {
      title: '3. Get It Done',
      description:
        'Your chosen helper completes the task while you relax. Confirm completion and leave a rating to help our community grow.',
      icon: <Clock className="h-10 w-10" />,
    },
  ];

  const whyTasKeyFeatures = [
    {
      title: 'Reclaim Your Time',
      description:
        'Focus on what matters most. We handle the chores, so you can enjoy more free time, rest, and peace of mind.',
      icon: <Clock className="h-8 w-8 text-primary" />,
    },
    {
      title: 'Trust and Safety First',
      description:
        'Every helper on our platform is verified. Feel confident inviting help into your home with our transparent and accountable system.',
      icon: <ShieldCheck className="h-8 w-8 text-primary" />,
    },
    {
      title: 'Create Opportunity',
      description:
        'By using tasKey, you provide valuable work opportunities for capable individuals in your community, fostering local economic growth.',
      icon: <Zap className="h-8 w-8 text-primary" />,
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <header className="container mx-auto flex h-20 items-center justify-between px-4">
        <Link href="/">
          <Logo />
        </Link>
        <nav className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/login">Log In</Link>
          </Button>
          <Button asChild>
            <Link href="/login">
              Sign Up <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </nav>
      </header>

      <main className="flex-grow">
        <section className="container mx-auto grid grid-cols-1 items-center gap-12 px-4 py-16 md:grid-cols-2 md:py-24">
          <div className="space-y-6">
            <h1 className="font-headline text-4xl font-bold tracking-tighter text-accent md:text-5xl lg:text-6xl">
              Reclaim your time. We&apos;ve got the tasks covered.
            </h1>
            <p className="text-lg text-muted-foreground md:text-xl">
              tasKey is the safe, reliable way to get your everyday to-do list
              done. Connect with trusted local helpers for cleaning, laundry,
              and more.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/login">
                  Post a Task <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <Link href="/login">Become a Helper</Link>
              </Button>
            </div>
          </div>
          <div className="relative h-64 w-full overflow-hidden rounded-lg shadow-2xl md:h-auto md:aspect-[4/3]">
            {heroImage && (
              <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                fill
                className="object-cover"
                data-ai-hint={heroImage.imageHint}
                priority
              />
            )}
          </div>
        </section>

        <section id="how-it-works" className="bg-secondary py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="font-headline text-3xl font-bold text-accent md:text-4xl">
                How It Works
              </h2>
              <p className="mt-2 text-lg text-muted-foreground">
                Get help in three simple steps.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {howItWorksSteps.map((step) => (
                <div key={step.title} className="text-center">
                  <div className="mb-4 inline-flex rounded-full bg-primary/10 p-4 text-primary">
                    {step.icon}
                  </div>
                  <h3 className="font-headline text-xl font-bold text-accent">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="font-headline text-3xl font-bold text-accent md:text-4xl">
                A Smarter Way to Manage Your Day
              </h2>
              <p className="mt-2 text-lg text-muted-foreground">
                tasKey is more than an app. It&apos;s a trust-driven system for modern life.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {whyTasKeyFeatures.map((feature) => (
                <Card key={feature.title} className="text-center">
                  <CardHeader>
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                        {feature.icon}
                    </div>
                    <CardTitle className="font-headline text-xl text-accent">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="cta" className="bg-secondary py-16 md:py-24">
            <div className="container mx-auto px-4 text-center">
                <h2 className="font-headline text-3xl font-bold text-accent md:text-4xl">
                    Ready to Get Started?
                </h2>
                <p className="mt-2 text-lg text-muted-foreground">
                    Join the growing community of smart delegators and reliable helpers.
                </p>
                <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                    <Button size="lg" asChild>
                        <Link href="/login">
                        Find Help Now <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                        <Link href="/login">Start Earning</Link>
                    </Button>
                </div>
            </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row">
          <Link href="/">
            <Logo />
          </Link>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} tasKey. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:text-accent">
                Terms of Service
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-accent">
                Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
```

---

## File: `src/app/profile/[id]/page.tsx`

```tsx
'use client';

import { use } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Star, Briefcase, MapPin, Calendar, BadgeCheckIcon, MessageSquare, Shield, ChevronLeft } from 'lucide-react';
import { format } from 'date-fns';
import { useDoc, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, query, collection, where } from 'firebase/firestore';
import type { Helper, Feedback } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { ReviewCard } from '@/app/dashboard/profile/review-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default function PublicProfilePage({ params }: { params: { id: string } }) {
  const { id } = use(params);
  const firestore = useFirestore();

  const userRef = useMemoFirebase(() => {
    if (!firestore || !id) return null;
    return doc(firestore, 'helpers', id);
  }, [firestore, id]);

  const { data: helperProfile, isLoading: isProfileLoading } = useDoc<Helper>(userRef);

  const feedbacksQuery = useMemoFirebase(() => {
    if (!firestore || !id) return null;
    return query(collection(firestore, 'feedbacks'), where('helperId', '==', id));
  }, [firestore, id]);

  const { data: feedbacks, isLoading: areFeedbacksLoading } = useCollection<Feedback>(feedbacksQuery);

  const isLoading = isProfileLoading;
  
  if (!isLoading && !helperProfile) {
    notFound();
  }

  if (isLoading || !helperProfile) {
    return <ProfileSkeleton />;
  }
  
  return (
    <div className="bg-muted/40">
        <div className="container mx-auto grid max-w-4xl flex-1 auto-rows-max gap-4 py-8 md:py-12">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" className="h-7 w-7" asChild>
                    <Link href="/dashboard">
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Back</span>
                    </Link>
                </Button>
                <h1 className="font-headline text-xl font-semibold tracking-tight">
                    Helper Profile
                </h1>
            </div>
             <div className="grid gap-4 md:grid-cols-[1fr_350px]">
                <div className="grid auto-rows-max items-start gap-4">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-6">
                                <Image
                                    src={helperProfile.profilePhotoUrl}
                                    width={96}
                                    height={96}
                                    alt="Avatar"
                                    className="overflow-hidden rounded-full object-cover"
                                />
                                <div>
                                    <CardTitle className="font-headline text-3xl">{helperProfile.fullName}</CardTitle>
                                    <CardDescription className="text-base">{helperProfile.email}</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                        <Separator className="my-4" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                            <div className="flex items-center gap-3">
                                <MapPin className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-muted-foreground">Service Areas</p>
                                    <p className="font-semibold">{helperProfile.serviceAreas.join(', ')}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Calendar className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-muted-foreground">Member Since</p>
                                    <p className="font-semibold">{helperProfile?.memberSince ? format(helperProfile.memberSince.toDate(), 'MMMM yyyy') : 'N/A'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <BadgeCheckIcon className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-muted-foreground">Verification</p>
                                    <div className="font-semibold">
                                        {helperProfile.verificationStatus === 'Verified' ? (
                                            <Badge variant="secondary">Verified</Badge>
                                        ) : (
                                            <Badge variant="destructive">Pending Verification</Badge>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Star className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-muted-foreground">Rating</p>
                                    <p className="font-semibold">{helperProfile.rating ? `${helperProfile.rating.toFixed(1)} / 5.0` : 'No ratings yet'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Briefcase className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-muted-foreground">Completed Gigs</p>
                                    <p className="font-semibold">{helperProfile.completedTasks || 0}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Shield className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-muted-foreground">Reliability</p>
                                    <p className="font-semibold">{helperProfile.reliabilityIndicator || 'Not Yet Rated'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 md:col-span-2">
                                <Briefcase className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-muted-foreground">Skills</p>
                                    <div className="flex flex-wrap gap-2">
                                        {helperProfile.serviceCategories?.map(skill => <Badge key={skill} variant="outline">{skill}</Badge>)}
                                    </div>
                                </div>
                            </div>
                            <div className='md:col-span-2'>
                                <h3 className="font-semibold mb-2">About Helper</h3>
                                <p className="text-muted-foreground">{helperProfile.aboutMe}</p>
                            </div>
                        </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid auto-rows-max items-start gap-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline flex items-center gap-2">
                                <MessageSquare className="h-5 w-5" />
                                Reviews ({feedbacks?.length ?? 0})
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            {areFeedbacksLoading && Array.from({length: 2}).map((_, i) => <ReviewCardSkeleton key={i} />)}
                            
                            {!areFeedbacksLoading && feedbacks && feedbacks.length > 0 ? (
                                feedbacks.map(review => <ReviewCard key={review.id} review={review} />)
                            ) : (
                                !areFeedbacksLoading && (
                                    <div className="text-center text-sm text-muted-foreground py-8">
                                        No reviews yet.
                                    </div>
                                )
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    </div>
  );
}

function ReviewCardSkeleton() {
    return (
        <div className="border-b pb-4 last:border-b-0 last:pb-0">
            <div className="flex items-center gap-3 mb-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                </div>
                 <Skeleton className="h-5 w-20" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6 mt-1" />
        </div>
    );
}

function ProfileSkeleton() {
  return (
    <div className="container mx-auto grid max-w-4xl flex-1 auto-rows-max gap-4 py-8 md:py-12">
      <Skeleton className="h-8 w-48 mb-6" />
      <Card>
        <CardHeader>
          <div className="flex items-center gap-6">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className='space-y-2'>
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-5 w-48" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Separator className="my-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-6 w-6" />
                <div className='space-y-2'>
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
```

---

## File: `src/app/support/page.tsx`

```tsx
'use client';

import Link from 'next/link';
import { Mail, LifeBuoy, ChevronLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { collection, serverTimestamp } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { AppSidebar } from '@/app/dashboard/sidebar';
import AppHeader from '@/app/dashboard/header';
import { UserRoleProvider } from '@/context/user-role-context';
import { useUser, useFirestore } from '@/firebase';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

const supportFormSchema = z.object({
  subject: z.string().min(5, { message: "Subject must be at least 5 characters long." }),
  message: z.string().min(20, { message: "Message must be at least 20 characters long." }),
});

type SupportFormValues = z.infer<typeof supportFormSchema>;

export default function SupportPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const form = useForm<SupportFormValues>({
    resolver: zodResolver(supportFormSchema),
    defaultValues: {
      subject: '',
      message: '',
    },
  });

  const onSubmit = async (data: SupportFormValues) => {
    if (!user || !firestore) {
      toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to submit a ticket.' });
      return;
    }

    const ticketData = {
      userId: user.uid,
      userEmail: user.email,
      subject: data.subject,
      message: data.message,
      status: 'NEW',
      createdAt: serverTimestamp(),
    };

    const ticketsCollection = collection(firestore, 'support_tickets');
    addDocumentNonBlocking(ticketsCollection, ticketData);
    
    toast({ title: 'Support Ticket Submitted', description: "We've received your request and will get back to you shortly." });
    form.reset();
  };

  return (
    <UserRoleProvider>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <AppSidebar />
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <AppHeader />
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <div className="mx-auto grid w-full max-w-2xl auto-rows-max gap-4">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" className="h-7 w-7" asChild>
                  <Link href="/dashboard">
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Back</span>
                  </Link>
                </Button>
                <h1 className="flex-1 shrink-0 whitespace-nowrap font-headline text-xl font-semibold tracking-tight sm:grow-0">
                  Support Center
                </h1>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline flex items-center gap-3">
                    <LifeBuoy className="h-6 w-6" />
                    <span>Contact Support</span>
                  </CardTitle>
                  <CardDescription>
                    Have a question or experiencing an issue? Let us know.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 rounded-md border bg-secondary/50 p-4">
                    <Mail className="h-6 w-6 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">For urgent issues, email us directly</p>
                      <a href="mailto:support@taskey.app" className="font-semibold text-primary hover:underline">
                        support@taskey.app
                      </a>
                    </div>
                  </div>
                </CardContent>
                <Separator className="my-4" />
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardHeader>
                        <CardTitle className='font-headline text-lg'>Submit a Support Ticket</CardTitle>
                        <CardDescription>Use the form below to send a message to our support team.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subject</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Issue with task payment" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Details</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Please describe your issue in as much detail as possible..."
                                className="min-h-32"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                    <CardFooter>
                      <Button type="submit" className="ml-auto" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? 'Submitting...' : 'Submit Ticket'}
                      </Button>
                    </CardFooter>
                  </form>
                </Form>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </UserRoleProvider>
  );
}
```

---

## File: `src/components/FirebaseErrorListener.tsx`

```tsx
'use client';

import { useState, useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

/**
 * An invisible component that listens for globally emitted 'permission-error' events.
 * It throws any received error to be caught by Next.js's global-error.tsx.
 */
export function FirebaseErrorListener() {
  // Use the specific error type for the state for type safety.
  const [error, setError] = useState<FirestorePermissionError | null>(null);

  useEffect(() => {
    // The callback now expects a strongly-typed error, matching the event payload.
    const handleError = (error: FirestorePermissionError) => {
      // Set error in state to trigger a re-render.
      setError(error);
    };

    // The typed emitter will enforce that the callback for 'permission-error'
    // matches the expected payload type (FirestorePermissionError).
    errorEmitter.on('permission-error', handleError);

    // Unsubscribe on unmount to prevent memory leaks.
    return () => {
      errorEmitter.off('permission-error', handleError);
    };
  }, []);

  // On re-render, if an error exists in state, throw it.
  if (error) {
    throw error;
  }

  // This component renders nothing.
  return null;
}
```

---

## File: `src/components/client-only.tsx`

```tsx
'use client';

import { useState, useEffect, type ReactNode } from 'react';

type ClientOnlyProps = {
  children: ReactNode;
};

/**
 * A component that ensures its children are only rendered on the client side.
 * This is useful for preventing React hydration errors when a component
 * generates content (like random IDs) that would differ between the server
 * and the client.
 */
export function ClientOnly({ children }: ClientOnlyProps) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <>{children}</>;
}
```

---

## File: `src/components/logo.tsx`

```tsx
import type { SVGProps } from 'react';
import { Handshake } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({
  className,
  ...props
}: SVGProps<SVGSVGElement> & { iconOnly?: boolean }) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="rounded-lg bg-accent p-1.5 text-accent-foreground">
        <Handshake className="h-5 w-5" />
      </div>
      <span className="font-headline text-xl font-bold text-accent">
        tasKey
      </span>
    </div>
  );
}
```

---

## File: `src/components/ui/accordion.tsx`

```tsx
"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-b", className)}
    {...props}
  />
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn("pb-4 pt-0", className)}>{children}</div>
  </AccordionPrimitive.Content>
))

AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
```

---

## File: `src/components/ui/alert-dialog.tsx`

```tsx
"use client"

import * as React from "react"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

const AlertDialog = AlertDialogPrimitive.Root

const AlertDialogTrigger = AlertDialogPrimitive.Trigger

const AlertDialogPortal = AlertDialogPrimitive.Portal

const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
    ref={ref}
  />
))
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName

const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, ...props }, ref) => (
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    />
  </AlertDialogPortal>
))
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName

const AlertDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
AlertDialogHeader.displayName = "AlertDialogHeader"

const AlertDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
AlertDialogFooter.displayName = "AlertDialogFooter"

const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold", className)}
    {...props}
  />
))
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName

const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
AlertDialogDescription.displayName =
  AlertDialogPrimitive.Description.displayName

const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Action
    ref={ref}
    className={cn(buttonVariants(), className)}
    {...props}
  />
))
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName

const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className={cn(
      buttonVariants({ variant: "outline" }),
      "mt-2 sm:mt-0",
      className
    )}
    {...props}
  />
))
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}
```

---

## File: `src/components/ui/alert.tsx`

```tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
```

---

## File: `src/components/ui/avatar.tsx`

```tsx
"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }
```

---

## File: `src/components/ui/badge.tsx`

```tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
```

---

## File: `src/components/ui/breadcrumb.tsx`

```tsx
"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { ChevronRight, MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"

const Breadcrumb = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<"nav"> & {
    separator?: React.ReactNode
  }
>(({ ...props }, ref) => <nav ref={ref} aria-label="breadcrumb" {...props} />)
Breadcrumb.displayName = "Breadcrumb"

const BreadcrumbList = React.forwardRef<
  HTMLOListElement,
  React.ComponentPropsWithoutRef<"ol">
>(({ className, ...props }, ref) => (
  <ol
    ref={ref}
    className={cn(
      "flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5",
      className
    )}
    {...props}
  />
))
BreadcrumbList.displayName = "BreadcrumbList"

const BreadcrumbItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentPropsWithoutRef<"li">
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn("inline-flex items-center gap-1.5", className)}
    {...props}
  />
))
BreadcrumbItem.displayName = "BreadcrumbItem"

const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<"a"> & {
    asChild?: boolean
  }
>(({ asChild, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a"

  return (
    <Comp
      ref={ref}
      className={cn("transition-colors hover:text-foreground", className)}
      {...props}
    />
  )
})
BreadcrumbLink.displayName = "BreadcrumbLink"

const BreadcrumbPage = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<"span">
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    role="link"
    aria-disabled="true"
    aria-current="page"
    className={cn("font-normal text-foreground", className)}
    {...props}
  />
))
BreadcrumbPage.displayName = "BreadcrumbPage"

const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}: React.ComponentProps<"li">) => (
  <li
    role="presentation"
    aria-hidden="true"
    className={cn("[&>svg]:size-3.5", className)}
    {...props}
  >
    {children ?? <ChevronRight />}
  </li>
)
BreadcrumbSeparator.displayName = "BreadcrumbSeparator"

const BreadcrumbEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More</span>
  </span>
)
BreadcrumbEllipsis.displayName = "BreadcrumbElipssis"

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
}
```

---

## File: `src/components/ui/button.tsx`

```tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
```

---

## File: `src/components/ui/calendar.tsx`

```tsx
"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn("h-4 w-4", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn("h-4 w-4", className)} {...props} />
        ),
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
```

---

## File: `src/components/ui/card.tsx`

```tsx
import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
```

---

## File: `src/components/ui/carousel.tsx`

```tsx
"use client"

import * as React from "react"
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react"
import { ArrowLeft, ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]

type CarouselProps = {
  opts?: CarouselOptions
  plugins?: CarouselPlugin
  orientation?: "horizontal" | "vertical"
  setApi?: (api: CarouselApi) => void
}

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  api: ReturnType<typeof useEmblaCarousel>[1]
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
} & CarouselProps

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }

  return context
}

const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(
  (
    {
      orientation = "horizontal",
      opts,
      setApi,
      plugins,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === "horizontal" ? "x" : "y",
      },
      plugins
    )
    const [canScrollPrev, setCanScrollPrev] = React.useState(false)
    const [canScrollNext, setCanScrollNext] = React.useState(false)

    const onSelect = React.useCallback((api: CarouselApi) => {
      if (!api) {
        return
      }

      setCanScrollPrev(api.canScrollPrev())
      setCanScrollNext(api.canScrollNext())
    }, [])

    const scrollPrev = React.useCallback(() => {
      api?.scrollPrev()
    }, [api])

    const scrollNext = React.useCallback(() => {
      api?.scrollNext()
    }, [api])

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault()
          scrollPrev()
        } else if (event.key === "ArrowRight") {
          event.preventDefault()
          scrollNext()
        }
      },
      [scrollPrev, scrollNext]
    )

    React.useEffect(() => {
      if (!api || !setApi) {
        return
      }

      setApi(api)
    }, [api, setApi])

    React.useEffect(() => {
      if (!api) {
        return
      }

      onSelect(api)
      api.on("reInit", onSelect)
      api.on("select", onSelect)

      return () => {
        api?.off("select", onSelect)
      }
    }, [api, onSelect])

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api: api,
          opts,
          orientation:
            orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
        }}
      >
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={cn("relative", className)}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    )
  }
)
Carousel.displayName = "Carousel"

const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { carouselRef, orientation } = useCarousel()

  return (
    <div ref={carouselRef} className="overflow-hidden">
      <div
        ref={ref}
        className={cn(
          "flex",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className
        )}
        {...props}
      />
    </div>
  )
})
CarouselContent.displayName = "CarouselContent"

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { orientation } = useCarousel()

  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className
      )}
      {...props}
    />
  )
})
CarouselItem.displayName = "CarouselItem"

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel()

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute  h-8 w-8 rounded-full",
        orientation === "horizontal"
          ? "-left-12 top-1/2 -translate-y-1/2"
          : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="sr-only">Previous slide</span>
    </Button>
  )
})
CarouselPrevious.displayName = "CarouselPrevious"

const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollNext, canScrollNext } = useCarousel()

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute h-8 w-8 rounded-full",
        orientation === "horizontal"
          ? "-right-12 top-1/2 -translate-y-1/2"
          : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ArrowRight className="h-4 w-4" />
      <span className="sr-only">Next slide</span>
    </Button>
  )
})
CarouselNext.displayName = "CarouselNext"

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
}
```

---

## File: `src/components/ui/chart.tsx`

```tsx
"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"

import { cn } from "@/lib/utils"

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: "", dark: ".dark" } as const

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode
    icon?: React.ComponentType
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  )
}

type ChartContextProps = {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }

  return context
}

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: ChartConfig
    children: React.ComponentProps<
      typeof RechartsPrimitive.ResponsiveContainer
    >["children"]
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId()
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        ref={ref}
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
})
ChartContainer.displayName = "Chart"

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([, config]) => config.theme || config.color
  )

  if (!colorConfig.length) {
    return null
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
      itemConfig.color
    return color ? `  --color-${key}: ${color};` : null
  })
  .join("\n")}
}
`
          )
          .join("\n"),
      }}
    />
  )
}

const ChartTooltip = RechartsPrimitive.Tooltip

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
    React.ComponentProps<"div"> & {
      hideLabel?: boolean
      hideIndicator?: boolean
      indicator?: "line" | "dot" | "dashed"
      nameKey?: string
      labelKey?: string
    }
>(
  (
    {
      active,
      payload,
      className,
      indicator = "dot",
      hideLabel = false,
      hideIndicator = false,
      label,
      labelFormatter,
      labelClassName,
      formatter,
      color,
      nameKey,
      labelKey,
    },
    ref
  ) => {
    const { config } = useChart()

    const tooltipLabel = React.useMemo(() => {
      if (hideLabel || !payload?.length) {
        return null
      }

      const [item] = payload
      const key = `${labelKey || item.dataKey || item.name || "value"}`
      const itemConfig = getPayloadConfigFromPayload(config, item, key)
      const value =
        !labelKey && typeof label === "string"
          ? config[label as keyof typeof config]?.label || label
          : itemConfig?.label

      if (labelFormatter) {
        return (
          <div className={cn("font-medium", labelClassName)}>
            {labelFormatter(value, payload)}
          </div>
        )
      }

      if (!value) {
        return null
      }

      return <div className={cn("font-medium", labelClassName)}>{value}</div>
    }, [
      label,
      labelFormatter,
      payload,
      hideLabel,
      labelClassName,
      config,
      labelKey,
    ])

    if (!active || !payload?.length) {
      return null
    }

    const nestLabel = payload.length === 1 && indicator !== "dot"

    return (
      <div
        ref={ref}
        className={cn(
          "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
          className
        )}
      >
        {!nestLabel ? tooltipLabel : null}
        <div className="grid gap-1.5">
          {payload.map((item, index) => {
            const key = `${nameKey || item.name || item.dataKey || "value"}`
            const itemConfig = getPayloadConfigFromPayload(config, item, key)
            const indicatorColor = color || item.payload.fill || item.color

            return (
              <div
                key={item.dataKey}
                className={cn(
                  "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
                  indicator === "dot" && "items-center"
                )}
              >
                {formatter && item?.value !== undefined && item.name ? (
                  formatter(item.value, item.name, item, index, item.payload)
                ) : (
                  <>
                    {itemConfig?.icon ? (
                      <itemConfig.icon />
                    ) : (
                      !hideIndicator && (
                        <div
                          className={cn(
                            "shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]",
                            {
                              "h-2.5 w-2.5": indicator === "dot",
                              "w-1": indicator === "line",
                              "w-0 border-[1.5px] border-dashed bg-transparent":
                                indicator === "dashed",
                              "my-0.5": nestLabel && indicator === "dashed",
                            }
                          )}
                          style={
                            {
                              "--color-bg": indicatorColor,
                              "--color-border": indicatorColor,
                            } as React.CSSProperties
                          }
                        />
                      )
                    )}
                    <div
                      className={cn(
                        "flex flex-1 justify-between leading-none",
                        nestLabel ? "items-end" : "items-center"
                      )}
                    >
                      <div className="grid gap-1.5">
                        {nestLabel ? tooltipLabel : null}
                        <span className="text-muted-foreground">
                          {itemConfig?.label || item.name}
                        </span>
                      </div>
                      {item.value && (
                        <span className="font-mono font-medium tabular-nums text-foreground">
                          {item.value.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }
)
ChartTooltipContent.displayName = "ChartTooltip"

const ChartLegend = RechartsPrimitive.Legend

const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> &
    Pick<RechartsPrimitive.LegendProps, "payload" | "verticalAlign"> & {
      hideIcon?: boolean
      nameKey?: string
    }
>(
  (
    { className, hideIcon = false, payload, verticalAlign = "bottom", nameKey },
    ref
  ) => {
    const { config } = useChart()

    if (!payload?.length) {
      return null
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center gap-4",
          verticalAlign === "top" ? "pb-3" : "pt-3",
          className
        )}
      >
        {payload.map((item) => {
          const key = `${nameKey || item.dataKey || "value"}`
          const itemConfig = getPayloadConfigFromPayload(config, item, key)

          return (
            <div
              key={item.value}
              className={cn(
                "flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground"
              )}
            >
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon />
              ) : (
                <div
                  className="h-2 w-2 shrink-0 rounded-[2px]"
                  style={{
                    backgroundColor: item.color,
                  }}
                />
              )}
              {itemConfig?.label}
            </div>
          )
        })}
      </div>
    )
  }
)
ChartLegendContent.displayName = "ChartLegend"

// Helper to extract item config from a payload.
function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string
) {
  if (typeof payload !== "object" || payload === null) {
    return undefined
  }

  const payloadPayload =
    "payload" in payload &&
    typeof payload.payload === "object" &&
    payload.payload !== null
      ? payload.payload
      : undefined

  let configLabelKey: string = key

  if (
    key in payload &&
    typeof payload[key as keyof typeof payload] === "string"
  ) {
    configLabelKey = payload[key as keyof typeof payload] as string
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === "string"
  ) {
    configLabelKey = payloadPayload[
      key as keyof typeof payloadPayload
    ] as string
  }

  return configLabelKey in config
    ? config[configLabelKey]
    : config[key as keyof typeof config]
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
}
```

---

## File: `src/components/ui/checkbox.tsx`

```tsx
"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
```

---

## File: `src/components/ui/collapsible.tsx`

```tsx
"use client"

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"

const Collapsible = CollapsiblePrimitive.Root

const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger

const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
```

---

## File: `src/components/ui/dialog.tsx`

```tsx
"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
```

---

## File: `src/components/ui/dropdown-menu.tsx`

```tsx
"use client"

import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { Check, ChevronRight, Circle } from "lucide-react"

import { cn } from "@/lib/utils"

const DropdownMenu = DropdownMenuPrimitive.Root

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

const DropdownMenuGroup = DropdownMenuPrimitive.Group

const DropdownMenuPortal = DropdownMenuPrimitive.Portal

const DropdownMenuSub = DropdownMenuPrimitive.Sub

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto" />
  </DropdownMenuPrimitive.SubTrigger>
))
DropdownMenuSubTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
DropdownMenuSubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
))
DropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitive.CheckboxItem.displayName

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
))
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-sm font-semibold",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
      {...props}
    />
  )
}
DropdownMenuShortcut.displayName = "DropdownMenuShortcut"

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
}
```

---

## File: `src/components/ui/form.tsx`

```tsx
"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { Slot } from "@radix-ui/react-slot"
import {
  Controller,
  FormProvider,
  useFormContext,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

const Form = FormProvider

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
)

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState, formState } = useFormContext()

  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>")
  }

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

type FormItemContextValue = {
  id: string
}

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
)

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const id = React.useId()

  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn("space-y-2", className)} {...props} />
    </FormItemContext.Provider>
  )
})
FormItem.displayName = "FormItem"

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField()

  return (
    <Label
      ref={ref}
      className={cn(error && "text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    />
  )
})
FormLabel.displayName = "FormLabel"

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  )
})
FormControl.displayName = "FormControl"

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField()

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
})
FormDescription.displayName = "FormDescription"

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message ?? "") : children

  if (!body) {
    return null
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    >
      {body}
    </p>
  )
})
FormMessage.displayName = "FormMessage"

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
}
```

---

## File: `src/components/ui/input.tsx`

```tsx
import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
```

---

## File: `src/components/ui/label.tsx`

```tsx
"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
```

---

## File: `src/components/ui/menubar.tsx`

```tsx
"use client"

import * as React from "react"
import * as MenubarPrimitive from "@radix-ui/react-menubar"
import { Check, ChevronRight, Circle } from "lucide-react"

import { cn } from "@/lib/utils"

function MenubarMenu({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Menu>) {
  return <MenubarPrimitive.Menu {...props} />
}

function MenubarGroup({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Group>) {
  return <MenubarPrimitive.Group {...props} />
}

function MenubarPortal({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Portal>) {
  return <MenubarPrimitive.Portal {...props} />
}

function MenubarRadioGroup({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.RadioGroup>) {
  return <MenubarPrimitive.RadioGroup {...props} />
}

function MenubarSub({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Sub>) {
  return <MenubarPrimitive.Sub data-slot="menubar-sub" {...props} />
}

const Menubar = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Root
    ref={ref}
    className={cn(
      "flex h-10 items-center space-x-1 rounded-md border bg-background p-1",
      className
    )}
    {...props}
  />
))
Menubar.displayName = MenubarPrimitive.Root.displayName

const MenubarTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-3 py-1.5 text-sm font-medium outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
      className
    )}
    {...props}
  />
))
MenubarTrigger.displayName = MenubarPrimitive.Trigger.displayName

const MenubarSubTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <MenubarPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </MenubarPrimitive.SubTrigger>
))
MenubarSubTrigger.displayName = MenubarPrimitive.SubTrigger.displayName

const MenubarSubContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
MenubarSubContent.displayName = MenubarPrimitive.SubContent.displayName

const MenubarContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Content>
>(
  (
    { className, align = "start", alignOffset = -4, sideOffset = 8, ...props },
    ref
  ) => (
    <MenubarPrimitive.Portal>
      <MenubarPrimitive.Content
        ref={ref}
        align={align}
        alignOffset={alignOffset}
        sideOffset={sideOffset}
        className={cn(
          "z-50 min-w-[12rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          className
        )}
        {...props}
      />
    </MenubarPrimitive.Portal>
  )
)
MenubarContent.displayName = MenubarPrimitive.Content.displayName

const MenubarItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
MenubarItem.displayName = MenubarPrimitive.Item.displayName

const MenubarCheckboxItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <MenubarPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <MenubarPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.CheckboxItem>
))
MenubarCheckboxItem.displayName = MenubarPrimitive.CheckboxItem.displayName

const MenubarRadioItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <MenubarPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <MenubarPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.RadioItem>
))
MenubarRadioItem.displayName = MenubarPrimitive.RadioItem.displayName

const MenubarLabel = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Label
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-sm font-semibold",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
MenubarLabel.displayName = MenubarPrimitive.Label.displayName

const MenubarSeparator = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
MenubarSeparator.displayName = MenubarPrimitive.Separator.displayName

const MenubarShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}
MenubarShortcut.displayname = "MenubarShortcut"

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarPortal,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarGroup,
  MenubarSub,
  MenubarShortcut,
}
```

---

## File: `src/components/ui/popover.tsx`

```tsx
"use client"

import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

import { cn } from "@/lib/utils"

const Popover = PopoverPrimitive.Root

const PopoverTrigger = PopoverPrimitive.Trigger

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName

export { Popover, PopoverTrigger, PopoverContent }
```

---

## File: `src/components/ui/progress.tsx`

```tsx
"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-primary transition-all"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
```

---

## File: `src/components/ui/radio-group.tsx`

```tsx
"use client"

import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { Circle } from "lucide-react"

import { cn } from "@/lib/utils"

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-2", className)}
      {...props}
      ref={ref}
    />
  )
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className="h-2.5 w-2.5 fill-current text-current" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem }
```

---

## File: `src/components/ui/scroll-area.tsx`

```tsx
"use client"

import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"

import { cn } from "@/lib/utils"

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn("relative overflow-hidden", className)}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
))
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" &&
        "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" &&
        "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
))
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

export { ScrollArea, ScrollBar }
```

---

## File: `src/components/ui/select.tsx`

```tsx
"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, ChevronUp } from "lucide-react"

import { cn } from "@/lib/utils"

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}
```

---

## File: `src/components/ui/separator.tsx`

```tsx
"use client"

import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

import { cn } from "@/lib/utils"

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(
  (
    { className, orientation = "horizontal", decorative = true, ...props },
    ref
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      )}
      {...props}
    />
  )
)
Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator }
```

---

## File: `src/components/ui/sheet.tsx`

```tsx
"use client"

import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const Sheet = SheetPrimitive.Root

const SheetTrigger = SheetPrimitive.Trigger

const SheetClose = SheetPrimitive.Close

const SheetPortal = SheetPrimitive.Portal

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
    ref={ref}
  />
))
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName

const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom:
          "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right:
          "inset-y-0 right-0 h-full w-3/4  border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
      },
    },
    defaultVariants: {
      side: "right",
    },
  }
)

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(({ side = "right", className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <SheetPrimitive.Content
      ref={ref}
      className={cn(sheetVariants({ side }), className)}
      {...props}
    >
      {children}
      <SheetPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </SheetPrimitive.Close>
    </SheetPrimitive.Content>
  </SheetPortal>
))
SheetContent.displayName = SheetPrimitive.Content.displayName

const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
SheetHeader.displayName = "SheetHeader"

const SheetFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
SheetFooter.displayName = "SheetFooter"

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold text-foreground", className)}
    {...props}
  />
))
SheetTitle.displayName = SheetPrimitive.Title.displayName

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
SheetDescription.displayName = SheetPrimitive.Description.displayName

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
```

---

## File: `src/components/ui/skeleton.tsx`

```tsx
import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

export { Skeleton }
```

---

## File: `src/components/ui/slider.tsx`

```tsx
"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
      <SliderPrimitive.Range className="absolute h-full bg-primary" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
```

---

## File: `src/components/ui/switch.tsx`

```tsx
"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
```

---

## File: `src/components/ui/table.tsx`

```tsx
import * as React from "react"

import { cn } from "@/lib/utils"

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  </div>
))
Table.displayName = "Table"

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    )}
    {...props}
  />
))
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  />
))
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
    {...props}
  />
))
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
```

---

## File: `src/components/ui/tabs.tsx`

```tsx
"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
```

---

## File: `src/components/ui/textarea.tsx`

```tsx
import * as React from 'react';

import {cn} from '@/lib/utils';

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(
  ({className, ...props}, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export {Textarea};
```

---

## File: `src/components/ui/toast.tsx`

```tsx
"use client"

import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive:
          "destructive group border-destructive bg-destructive text-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
      className
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-sm font-semibold", className)}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-sm opacity-90", className)}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>

type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
}
```

---

## File: `src/components/ui/toaster.tsx`

```tsx
"use client"

import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
```

---

## File: `src/components/ui/tooltip.tsx`

```tsx
"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/lib/utils"

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
```

---

## File: `src/context/user-role-context.tsx`

```tsx
'use client';

import { createContext, useContext, useState, useMemo, useEffect, type ReactNode } from 'react';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import type { Customer, Helper } from '@/lib/data';

type UserRole = 'customer' | 'helper';

type UserRoleContextType = {
  role: UserRole;
  setRole: (role: UserRole) => void;
  toggleRole: () => void;
  hasCustomerProfile: boolean;
  hasHelperProfile: boolean;
  isRoleLoading: boolean;
};

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

export function UserRoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>('customer');
  const [isRoleLoading, setIsRoleLoading] = useState(true);
  const [hasCustomerProfile, setHasCustomerProfile] = useState(false);
  const [hasHelperProfile, setHasHelperProfile] = useState(false);

  const { user, isUserLoading: isAuthLoading } = useUser();
  const firestore = useFirestore();

  useEffect(() => {
    const checkForProfiles = async () => {
      if (!user || !firestore) {
        setIsRoleLoading(false);
        return;
      }
      setIsRoleLoading(true);
      
      const customerRef = doc(firestore, 'customers', user.uid);
      const helperRef = doc(firestore, 'helpers', user.uid);

      const [customerDoc, helperDoc] = await Promise.all([
        getDoc(customerRef),
        getDoc(helperRef),
      ]);

      const customerExists = customerDoc.exists();
      const helperExists = helperDoc.exists();

      setHasCustomerProfile(customerExists);
      setHasHelperProfile(helperExists);

      // Set initial role based on what profiles exist
      if (helperExists && !customerExists) {
        setRole('helper');
      } else {
        setRole('customer');
      }
      
      setIsRoleLoading(false);
    };

    checkForProfiles();
  }, [user, firestore]);
  
  const toggleRole = () => {
    setRole(prevRole => (prevRole === 'customer' ? 'helper' : 'customer'));
  };

  const value = useMemo(() => ({ 
      role, 
      setRole, 
      toggleRole,
      hasCustomerProfile,
      hasHelperProfile,
      isRoleLoading: isAuthLoading || isRoleLoading,
    }), [role, hasCustomerProfile, hasHelperProfile, isAuthLoading, isRoleLoading]);

  return (
    <UserRoleContext.Provider value={value}>
      {children}
    </UserRoleContext.Provider>
  );
}

export function useUserRole() {
  const context = useContext(UserRoleContext);
  if (context === undefined) {
    throw new Error('useUserRole must be used within a UserRoleProvider');
  }
  return context;
}
```

---

## File: `src/firebase/client-provider.tsx`

```tsx
'use client';

import React, { useMemo, type ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const firebaseServices = useMemo(() => {
    // Initialize Firebase on the client side, once per component mount.
    return initializeFirebase();
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <FirebaseProvider
      firebaseApp={firebaseServices.firebaseApp}
      auth={firebaseServices.auth}
      firestore={firebaseServices.firestore}
    >
      {children}
    </FirebaseProvider>
  );
}
```

---

## File: `src/firebase/config.ts`

```ts
export const firebaseConfig = {
  "projectId": "taskey-dl",
  "appId": "1:1016662706796:web:41d5f12d825401c7202649",
  "apiKey": "AIzaSyBN2sGGq_gDtUsw4lyICoAjSnHPBPqZ6gc",
  "authDomain": "taskey-dl.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "1016662706796"
};
```

---

## File: `src/firebase/error-emitter.ts`

```ts
'use client';
import { FirestorePermissionError } from '@/firebase/errors';

/**
 * Defines the shape of all possible events and their corresponding payload types.
 * This centralizes event definitions for type safety across the application.
 */
export interface AppEvents {
  'permission-error': FirestorePermissionError;
}

// A generic type for a callback function.
type Callback<T> = (data: T) => void;

/**
 * A strongly-typed pub/sub event emitter.
 * It uses a generic type T that extends a record of event names to payload types.
 */
function createEventEmitter<T extends Record<string, any>>() {
  // The events object stores arrays of callbacks, keyed by event name.
  // The types ensure that a callback for a specific event matches its payload type.
  const events: { [K in keyof T]?: Array<Callback<T[K]>> } = {};

  return {
    /**
     * Subscribe to an event.
     * @param eventName The name of the event to subscribe to.
     * @param callback The function to call when the event is emitted.
     */
    on<K extends keyof T>(eventName: K, callback: Callback<T[K]>) {
      if (!events[eventName]) {
        events[eventName] = [];
      }
      events[eventName]?.push(callback);
    },

    /**
     * Unsubscribe from an event.
     * @param eventName The name of the event to unsubscribe from.
     * @param callback The specific callback to remove.
     */
    off<K extends keyof T>(eventName: K, callback: Callback<T[K]>) {
      if (!events[eventName]) {
        return;
      }
      events[eventName] = events[eventName]?.filter(cb => cb !== callback);
    },

    /**
     * Publish an event to all subscribers.
     * @param eventName The name of the event to emit.
     * @param data The data payload that corresponds to the event's type.
     */
    emit<K extends keyof T>(eventName: K, data: T[K]) {
      if (!events[eventName]) {
        return;
      }
      events[eventName]?.forEach(callback => callback(data));
    },
  };
}

// Create and export a singleton instance of the emitter, typed with our AppEvents interface.
export const errorEmitter = createEventEmitter<AppEvents>();
```

---

## File: `src/firebase/errors.ts`

```ts
'use client';
import { getAuth, type User } from 'firebase/auth';

type SecurityRuleContext = {
  path: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete' | 'write';
  requestResourceData?: any;
};

interface FirebaseAuthToken {
  name: string | null;
  email: string | null;
  email_verified: boolean;
  phone_number: string | null;
  sub: string;
  firebase: {
    identities: Record<string, string[]>;
    sign_in_provider: string;
    tenant: string | null;
  };
}

interface FirebaseAuthObject {
  uid: string;
  token: FirebaseAuthToken;
}

interface SecurityRuleRequest {
  auth: FirebaseAuthObject | null;
  method: string;
  path: string;
  resource?: {
    data: any;
  };
}

/**
 * Builds a security-rule-compliant auth object from the Firebase User.
 * @param currentUser The currently authenticated Firebase user.
 * @returns An object that mirrors request.auth in security rules, or null.
 */
function buildAuthObject(currentUser: User | null): FirebaseAuthObject | null {
  if (!currentUser) {
    return null;
  }

  const token: FirebaseAuthToken = {
    name: currentUser.displayName,
    email: currentUser.email,
    email_verified: currentUser.emailVerified,
    phone_number: currentUser.phoneNumber,
    sub: currentUser.uid,
    firebase: {
      identities: currentUser.providerData.reduce((acc, p) => {
        if (p.providerId) {
          acc[p.providerId] = [p.uid];
        }
        return acc;
      }, {} as Record<string, string[]>),
      sign_in_provider: currentUser.providerData[0]?.providerId || 'custom',
      tenant: currentUser.tenantId,
    },
  };

  return {
    uid: currentUser.uid,
    token: token,
  };
}

/**
 * Builds the complete, simulated request object for the error message.
 * It safely tries to get the current authenticated user.
 * @param context The context of the failed Firestore operation.
 * @returns A structured request object.
 */
function buildRequestObject(context: SecurityRuleContext): SecurityRuleRequest {
  let authObject: FirebaseAuthObject | null = null;
  try {
    // Safely attempt to get the current user.
    const firebaseAuth = getAuth();
    const currentUser = firebaseAuth.currentUser;
    if (currentUser) {
      authObject = buildAuthObject(currentUser);
    }
  } catch {
    // This will catch errors if the Firebase app is not yet initialized.
    // In this case, we'll proceed without auth information.
  }

  return {
    auth: authObject,
    method: context.operation,
    path: `/databases/(default)/documents/${context.path}`,
    resource: context.requestResourceData ? { data: context.requestResourceData } : undefined,
  };
}

/**
 * Builds the final, formatted error message for the LLM.
 * @param requestObject The simulated request object.
 * @returns A string containing the error message and the JSON payload.
 */
function buildErrorMessage(requestObject: SecurityRuleRequest): string {
  return `Missing or insufficient permissions: The following request was denied by Firestore Security Rules:
${JSON.stringify(requestObject, null, 2)}`;
}

/**
 * A custom error class designed to be consumed by an LLM for debugging.
 * It structures the error information to mimic the request object
 * available in Firestore Security Rules.
 */
export class FirestorePermissionError extends Error {
  public readonly request: SecurityRuleRequest;

  constructor(context: SecurityRuleContext) {
    const requestObject = buildRequestObject(context);
    super(buildErrorMessage(requestObject));
    this.name = 'FirebaseError';
    this.request = requestObject;
  }
}
```

---

## File: `src/firebase/firestore/index.ts`

```ts
'use client';

export * from './use-collection';
export * from './use-doc';
export * from './update-doc';
```

---

## File: `src/firebase/firestore/update-doc.ts`

```ts
'use client';
import {
  DocumentReference,
  updateDoc,
  UpdateData,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

/**
 * A non-blocking wrapper around Firestore's updateDoc function.
 * It initiates a document update and handles permission errors globally
 * without blocking the main thread. It returns a promise that resolves
 * when the update is complete, but it's not meant to be awaited.
 *
 * @param {DocumentReference} docRef - The reference to the document to update.
 * @param {UpdateData<T>} data - An object containing the fields and values to update.
 * @returns {Promise<void>} A promise that resolves upon completion of the write.
 */
export function updateDocument<T = any>(
  docRef: DocumentReference,
  data: UpdateData<T>
): Promise<void> {
  const promise = updateDoc(docRef, data).catch((error: any) => {
    // Construct a detailed error for better debugging
    const permissionError = new FirestorePermissionError({
      path: docRef.path,
      operation: 'update',
      requestResourceData: data,
    });

    // Use a global emitter to propagate the error
    errorEmitter.emit('permission-error', permissionError);

    // Re-throw the original error if you need to allow local catch blocks to work as well
    throw error;
  });

  return promise;
}
```

---

## File: `src/firebase/firestore/use-collection.tsx`

```tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Query,
  onSnapshot,
  getDocs,
  DocumentData,
  FirestoreError,
  QuerySnapshot,
  CollectionReference,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

/** Utility type to add an 'id' field to a given type T. */
export type WithId<T> = T & { id: string };

/**
 * Interface for the return value of the useCollection hook.
 * @template T Type of the document data.
 */
export interface UseCollectionResult<T> {
  data: WithId<T>[] | null; // Document data with ID, or null.
  isLoading: boolean;       // True if loading.
  error: FirestoreError | Error | null; // Error object, or null.
  mutate: () => void; // Function to manually re-fetch the collection.
}

/* Internal implementation of Query:
  https://github.com/firebase/firebase-js-sdk/blob/c5f08a9bc5da0d2b0207802c972d53724ccef055/packages/firestore/src/lite-api/reference.ts#L143
*/
export interface InternalQuery extends Query<DocumentData> {
  _query: {
    path: {
      canonicalString(): string;
      toString(): string;
    }
  }
}

/**
 * React hook to subscribe to a Firestore collection or query in real-time.
 * Handles nullable references/queries.
 * 
 *
 * IMPORTANT! YOU MUST MEMOIZE the inputted memoizedTargetRefOrQuery or BAD THINGS WILL HAPPEN
 * use useMemoFirebase to memoize it per React guidence.  Also make sure that it's dependencies are stable
 * references
 *  
 * @template T Optional type for document data. Defaults to any.
 * @param {CollectionReference<DocumentData> | Query<DocumentData> | null | undefined} memoizedTargetRefOrQuery -
 * The Firestore CollectionReference or Query. Waits if null/undefined.
 * @returns {UseCollectionResult<T>} Object with data, isLoading, error, and mutate function.
 */
export function useCollection<T = any>(
    memoizedTargetRefOrQuery: ((CollectionReference<DocumentData> | Query<DocumentData>) & {__memo?: boolean})  | null | undefined,
): UseCollectionResult<T> {
  type ResultItemType = WithId<T>;
  type StateDataType = ResultItemType[] | null;

  const [data, setData] = useState<StateDataType>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<FirestoreError | Error | null>(null);

  const getPathFromQuery = (query: any): string => {
    if (query.type === 'collection') return query.path;
    if (query._query?.path?.canonicalString) return query._query.path.canonicalString();
    return 'unknown path';
  };

  const mutate = useCallback(() => {
    if (!memoizedTargetRefOrQuery) return;

    setIsLoading(true);
    getDocs(memoizedTargetRefOrQuery).then(snapshot => {
      const results: ResultItemType[] = [];
      for (const doc of snapshot.docs) {
        results.push({ ...(doc.data() as T), id: doc.id });
      }
      setData(results);
      setError(null);
    }).catch(err => {
      const contextualError = new FirestorePermissionError({
        operation: 'list',
        path: getPathFromQuery(memoizedTargetRefOrQuery),
      });
      setError(contextualError);
      errorEmitter.emit('permission-error', contextualError);
    }).finally(() => {
      setIsLoading(false);
    });
  }, [memoizedTargetRefOrQuery]);

  useEffect(() => {
    if (!memoizedTargetRefOrQuery) {
      setData(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    const unsubscribe = onSnapshot(
      memoizedTargetRefOrQuery,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const results: ResultItemType[] = [];
        for (const doc of snapshot.docs) {
          results.push({ ...(doc.data() as T), id: doc.id });
        }
        setData(results);
        setError(null);
        setIsLoading(false);
      },
      (error: FirestoreError) => {
        const contextualError = new FirestorePermissionError({
          operation: 'list',
          path: getPathFromQuery(memoizedTargetRefOrQuery),
        })

        setError(contextualError)
        setData(null)
        setIsLoading(false)

        errorEmitter.emit('permission-error', contextualError);
      }
    );

    return () => unsubscribe();
  }, [memoizedTargetRefOrQuery]);

  if (memoizedTargetRefOrQuery && !(memoizedTargetRefOrQuery as any).__memo) {
    console.warn('useCollection was not properly memoized using useMemoFirebase. This may cause infinite loops.', memoizedTargetRefOrQuery);
  }

  return { data, isLoading, error, mutate };
}
```

---

## File: `src/firebase/firestore/use-doc.tsx`

```tsx
'use client';
    
import { useState, useEffect, useCallback } from 'react';
import {
  DocumentReference,
  onSnapshot,
  getDoc,
  DocumentData,
  FirestoreError,
  DocumentSnapshot,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

/** Utility type to add an 'id' field to a given type T. */
type WithId<T> = T & { id: string };

/**
 * Interface for the return value of the useDoc hook.
 * @template T Type of the document data.
 */
export interface UseDocResult<T> {
  data: WithId<T> | null; // Document data with ID, or null.
  isLoading: boolean;       // True if loading.
  error: FirestoreError | Error | null; // Error object, or null.
  mutate: () => void; // Function to manually re-fetch the document.
}

/**
 * React hook to subscribe to a single Firestore document in real-time.
 * Handles nullable references.
 * 
 * IMPORTANT! YOU MUST MEMOIZE the inputted memoizedDocRef or BAD THINGS WILL HAPPEN
 * use useMemo to memoize it per React guidence.  Also make sure that it's dependencies are stable
 * references
 *
 *
 * @template T Optional type for document data. Defaults to any.
 * @param {DocumentReference<DocumentData> | null | undefined} memoizedDocRef -
 * The Firestore DocumentReference. Waits if null/undefined.
 * @returns {UseDocResult<T>} Object with data, isLoading, error, and mutate function.
 */
export function useDoc<T = any>(
  memoizedDocRef: DocumentReference<DocumentData> | null | undefined,
): UseDocResult<T> {
  type StateDataType = WithId<T> | null;

  const [data, setData] = useState<StateDataType>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<FirestoreError | Error | null>(null);

  const mutate = useCallback(() => {
    if (!memoizedDocRef) return;
    
    setIsLoading(true);
    getDoc(memoizedDocRef).then(snapshot => {
      if (snapshot.exists()) {
        setData({ ...(snapshot.data() as T), id: snapshot.id });
      } else {
        setData(null);
      }
      setError(null);
    }).catch(err => {
       const contextualError = new FirestorePermissionError({
          operation: 'get',
          path: memoizedDocRef.path,
        })
        setError(contextualError);
        errorEmitter.emit('permission-error', contextualError);
    }).finally(() => {
      setIsLoading(false);
    });
  }, [memoizedDocRef]);

  useEffect(() => {
    if (!memoizedDocRef) {
      setData(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    const unsubscribe = onSnapshot(
      memoizedDocRef,
      (snapshot: DocumentSnapshot<DocumentData>) => {
        if (snapshot.exists()) {
          setData({ ...(snapshot.data() as T), id: snapshot.id });
        } else {
          setData(null);
        }
        setError(null);
        setIsLoading(false);
      },
      (error: FirestoreError) => {
        const contextualError = new FirestorePermissionError({
          operation: 'get',
          path: memoizedDocRef.path,
        })

        setError(contextualError)
        setData(null)
        setIsLoading(false)

        // trigger global error propagation
        errorEmitter.emit('permission-error', contextualError);
      }
    );

    return () => unsubscribe();
  }, [memoizedDocRef]); // Re-run if the memoizedDocRef changes.

  return { data, isLoading, error, mutate };
}
```

---

## File: `src/firebase/index.ts`

```ts
'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  if (!getApps().length) {
    // Important! initializeApp() is called without any arguments because Firebase App Hosting
    // integrates with the initializeApp() function to provide the environment variables needed to
    // populate the FirebaseOptions in production. It is critical that we attempt to call initializeApp()
    // without arguments.
    let firebaseApp;
    try {
      // Attempt to initialize via Firebase App Hosting environment variables
      firebaseApp = initializeApp();
    } catch (e) {
      // Only warn in production because it's normal to use the firebaseConfig to initialize
      // during development
      if (process.env.NODE_ENV === "production") {
        console.warn('Automatic initialization failed. Falling back to firebase config object.', e);
      }
      firebaseApp = initializeApp(firebaseConfig);
    }

    return getSdks(firebaseApp);
  }

  // If already initialized, return the SDKs with the already initialized App
  return getSdks(getApp());
}

export function getSdks(firebaseApp: FirebaseApp) {
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp)
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
```

---

## File: `src/firebase/non-blocking-login.tsx`

```tsx
'use client';
import {
  Auth, // Import Auth type for type hinting
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  // Assume getAuth and app are initialized elsewhere
} from 'firebase/auth';

/** Initiate anonymous sign-in (non-blocking). */
export function initiateAnonymousSignIn(authInstance: Auth): void {
  // CRITICAL: Call signInAnonymously directly. Do NOT use 'await signInAnonymously(...)'.
  signInAnonymously(authInstance);
  // Code continues immediately. Auth state change is handled by onAuthStateChanged listener.
}

/** Initiate email/password sign-up (non-blocking). */
export function initiateEmailSignUp(authInstance: Auth, email: string, password: string): void {
  // CRITICAL: Call createUserWithEmailAndPassword directly. Do NOT use 'await createUserWithEmailAndPassword(...)'.
  createUserWithEmailAndPassword(authInstance, email, password);
  // Code continues immediately. Auth state change is handled by onAuthStateChanged listener.
}

/** Initiate email/password sign-in (non-blocking). */
export function initiateEmailSignIn(authInstance: Auth, email: string, password: string): void {
  // CRITICAL: Call signInWithEmailAndPassword directly. Do NOT use 'await signInWithEmailAndPassword(...)'.
  signInWithEmailAndPassword(authInstance, email, password);
  // Code continues immediately. Auth state change is handled by onAuthStateChanged listener.
}
```

---

## File: `src/firebase/non-blocking-updates.tsx`

```tsx
'use client';
    
import {
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  CollectionReference,
  DocumentReference,
  SetOptions,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import {FirestorePermissionError} from '@/firebase/errors';

/**
 * Initiates a setDoc operation for a document reference.
 * Does NOT await the write operation internally.
 */
export function setDocumentNonBlocking(docRef: DocumentReference, data: any, options: SetOptions) {
  setDoc(docRef, data, options).catch(error => {
    errorEmitter.emit(
      'permission-error',
      new FirestorePermissionError({
        path: docRef.path,
        operation: 'write', // or 'create'/'update' based on options
        requestResourceData: data,
      })
    )
  })
  // Execution continues immediately
}


/**
 * Initiates an addDoc operation for a collection reference.
 * Does NOT await the write operation internally.
 * Returns the Promise for the new doc ref, but typically not awaited by caller.
 */
export function addDocumentNonBlocking(colRef: CollectionReference, data: any) {
  const promise = addDoc(colRef, data)
    .catch(error => {
      errorEmitter.emit(
        'permission-error',
        new FirestorePermissionError({
          path: colRef.path,
          operation: 'create',
          requestResourceData: data,
        })
      )
    });
  return promise;
}


/**
 * Initiates an updateDoc operation for a document reference.
 * Does NOT await the write operation internally.
 */
export function updateDocumentNonBlocking(docRef: DocumentReference, data: any) {
  updateDoc(docRef, data)
    .catch(error => {
      errorEmitter.emit(
        'permission-error',
        new FirestorePermissionError({
          path: docRef.path,
          operation: 'update',
          requestResourceData: data,
        })
      )
    });
}


/**
 * Initiates a deleteDoc operation for a document reference.
 * Does NOT await the write operation internally.
 */
export function deleteDocumentNonBlocking(docRef: DocumentReference) {
  deleteDoc(docRef)
    .catch(error => {
      errorEmitter.emit(
        'permission-error',
        new FirestorePermissionError({
          path: docRef.path,
          operation: 'delete',
        })
      )
    });
}
```

---

## File: `src/firebase/provider.tsx`

```tsx
'use client';

import React, { DependencyList, createContext, useContext, ReactNode, useMemo, useState, useEffect } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Firestore } from 'firebase/firestore';
import { Auth, User, onAuthStateChanged } from 'firebase/auth';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener'

interface FirebaseProviderProps {
  children: ReactNode;
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
}

// Internal state for user authentication
interface UserAuthState {
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
}

// Combined state for the Firebase context
export interface FirebaseContextState {
  areServicesAvailable: boolean; // True if core services (app, firestore, auth instance) are provided
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null; // The Auth service instance
  // User authentication state
  user: User | null;
  isUserLoading: boolean; // True during initial auth check
  userError: Error | null; // Error from auth listener
}

// Return type for useFirebase()
export interface FirebaseServicesAndUser {
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
}

// Return type for useUser() - specific to user auth state
export interface UserHookResult { // Renamed from UserAuthHookResult for consistency if desired, or keep as UserAuthHookResult
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
}

// React Context
export const FirebaseContext = createContext<FirebaseContextState | undefined>(undefined);

/**
 * FirebaseProvider manages and provides Firebase services and user authentication state.
 */
export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({
  children,
  firebaseApp,
  firestore,
  auth,
}) => {
  const [userAuthState, setUserAuthState] = useState<UserAuthState>({
    user: null,
    isUserLoading: true, // Start loading until first auth event
    userError: null,
  });

  // Effect to subscribe to Firebase auth state changes
  useEffect(() => {
    if (!auth) { // If no Auth service instance, cannot determine user state
      setUserAuthState({ user: null, isUserLoading: false, userError: new Error("Auth service not provided.") });
      return;
    }

    setUserAuthState({ user: null, isUserLoading: true, userError: null }); // Reset on auth instance change

    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => { // Auth state determined
        setUserAuthState({ user: firebaseUser, isUserLoading: false, userError: null });
      },
      (error) => { // Auth listener error
        console.error("FirebaseProvider: onAuthStateChanged error:", error);
        setUserAuthState({ user: null, isUserLoading: false, userError: error });
      }
    );
    return () => unsubscribe(); // Cleanup
  }, [auth]); // Depends on the auth instance

  // Memoize the context value
  const contextValue = useMemo((): FirebaseContextState => {
    const servicesAvailable = !!(firebaseApp && firestore && auth);
    return {
      areServicesAvailable: servicesAvailable,
      firebaseApp: servicesAvailable ? firebaseApp : null,
      firestore: servicesAvailable ? firestore : null,
      auth: servicesAvailable ? auth : null,
      user: userAuthState.user,
      isUserLoading: userAuthState.isUserLoading,
      userError: userAuthState.userError,
    };
  }, [firebaseApp, firestore, auth, userAuthState]);

  return (
    <FirebaseContext.Provider value={contextValue}>
      <FirebaseErrorListener />
      {children}
    </FirebaseContext.Provider>
  );
};

/**
 * Hook to access core Firebase services and user authentication state.
 * Throws error if core services are not available or used outside provider.
 */
export const useFirebase = (): FirebaseServicesAndUser => {
  const context = useContext(FirebaseContext);

  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider.');
  }

  if (!context.areServicesAvailable || !context.firebaseApp || !context.firestore || !context.auth) {
    throw new Error('Firebase core services not available. Check FirebaseProvider props.');
  }

  return {
    firebaseApp: context.firebaseApp,
    firestore: context.firestore,
    auth: context.auth,
    user: context.user,
    isUserLoading: context.isUserLoading,
    userError: context.userError,
  };
};

/** Hook to access Firebase Auth instance. */
export const useAuth = (): Auth => {
  const { auth } = useFirebase();
  return auth;
};

/** Hook to access Firestore instance. */
export const useFirestore = (): Firestore => {
  const { firestore } = useFirebase();
  return firestore;
};

/** Hook to access Firebase App instance. */
export const useFirebaseApp = (): FirebaseApp => {
  const { firebaseApp } = useFirebase();
  return firebaseApp;
};

type MemoFirebase <T> = T & {__memo?: boolean};

export function useMemoFirebase<T>(factory: () => T, deps: DependencyList): T | (MemoFirebase<T>) {
  const memoized = useMemo(factory, deps);
  
  if(typeof memoized !== 'object' || memoized === null) return memoized;
  (memoized as MemoFirebase<T>).__memo = true;
  
  return memoized;
}

/**
 * Hook specifically for accessing the authenticated user's state.
 * This provides the User object, loading status, and any auth errors.
 * @returns {UserHookResult} Object with user, isUserLoading, userError.
 */
export const useUser = (): UserHookResult => { // Renamed from useAuthUser
  const { user, isUserLoading, userError } = useFirebase(); // Leverages the main hook
  return { user, isUserLoading, userError };
};
```

---

## File: `src/hooks/use-helper-journey.ts`

```ts
'use client';

import { useMemo } from 'react';
import type { Helper } from '@/lib/data';

export type HelperCapability = 'canBrowseTasks' | 'canSendOffers' | 'canReceiveAssignments' | 'canUpdateTaskStatus';

export type HelperJourney = {
  lifecycleStage: Helper['lifecycleStage'];
  profileCompletion: Helper['profileCompletion'];
  verificationStatus: Helper['verificationStatus'];
  capabilities: Record<HelperCapability, boolean>;
  nextActions: { id: string; label: string; required: boolean; href?: string }[];
};

/**
 * A client-side hook to derive a helper's journey status, capabilities, and next actions.
 * In a production app, this logic should live on the backend for authoritativeness.
 *
 * @param helper The helper document data from Firestore.
 * @returns A HelperJourney object with derived state.
 */
export function useHelperJourney(helper: Helper | null | undefined): HelperJourney | null {
  const journey = useMemo(() => {
    if (!helper) {
      return null;
    }

    const { verificationStatus, profileCompletion, stats, isAvailable } = helper;
    let lifecycleStage: Helper['lifecycleStage'] = 'REGISTERED'; // Default
    const capabilities: Record<HelperCapability, boolean> = {
      canBrowseTasks: verificationStatus !== 'SUSPENDED',
      canSendOffers: false,
      canReceiveAssignments: false,
      canUpdateTaskStatus: verificationStatus !== 'SUSPENDED', // Checked against task assignment elsewhere
    };
    const nextActions: HelperJourney['nextActions'] = [];

    // --- Derivation Rules (as per spec) ---

    // 1. Determine Lifecycle Stage
    if (profileCompletion.percent < 100) {
      lifecycleStage = 'PROFILE_INCOMPLETE';
    } else if (verificationStatus === 'PENDING') {
      lifecycleStage = 'PENDING_VERIFICATION';
    } else if (verificationStatus === 'APPROVED') {
      if ((stats?.jobsCompleted || 0) >= 5 && stats?.reliabilityLevel === 'GREEN') {
        lifecycleStage = 'GROWING';
      } else if ((stats?.jobsCompleted || 0) > 0 || isAvailable) {
        lifecycleStage = 'ACTIVE';
      } else {
        lifecycleStage = 'VERIFIED_READY';
      }
    } else if (verificationStatus === 'SUSPENDED') {
      lifecycleStage = 'SUSPENDED';
    }

    // 2. Determine Capabilities based on Stage/Status
    if (verificationStatus === 'APPROVED') {
      capabilities.canSendOffers = true;
      capabilities.canReceiveAssignments = true;
    }

    // 3. Determine Next Actions based on Stage
    switch (lifecycleStage) {
      case 'PROFILE_INCOMPLETE':
        if (profileCompletion.missing.includes('aboutMe')) {
            nextActions.push({ id: 'ADD_ABOUT_ME', label: 'Add your bio', required: true, href: '/dashboard/profile' });
        }
        if (profileCompletion.missing.includes('serviceAreas')) {
            nextActions.push({ id: 'ADD_AREAS', label: 'Select service areas', required: true, href: '/dashboard/profile' });
        }
        if (profileCompletion.missing.includes('serviceCategories')) {
            nextActions.push({ id: 'ADD_CATEGORIES', label: 'Choose your skills', required: true, href: '/dashboard/profile' });
        }
        if (profileCompletion.missing.includes('profilePhoto')) {
            nextActions.push({ id: 'UPLOAD_PHOTO', label: 'Add a clear profile photo', required: true, href: '/dashboard/profile' });
        }
        break;
      case 'PENDING_VERIFICATION':
        nextActions.push({ id: 'WAIT_FOR_VERIFICATION', label: 'Verification in progress', required: false });
        break;
      case 'VERIFIED_READY':
        nextActions.push({ id: 'SEND_FIRST_OFFER', label: 'Send your first offer', required: false, href: '/dashboard/browse' });
        break;
      case 'SUSPENDED':
         nextActions.push({ id: 'CONTACT_SUPPORT', label: 'Contact Support', required: true, href: '/support' });
        break;
    }


    return {
      lifecycleStage,
      profileCompletion,
      verificationStatus,
      capabilities,
      nextActions,
    };
  }, [helper]);

  return journey;
}
```

---

## File: `src/hooks/use-toast.ts`

```ts
"use client"

// Inspired by react-hot-toast library
import * as React from "react"

import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ActionType = typeof actionTypes

type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToasterToast
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: ToasterToast["id"]
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: ToasterToast["id"]
    }

interface State {
  toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case "DISMISS_TOAST": {
      const { toastId } = action

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      }
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

type Toast = Omit<ToasterToast, "id">

function toast({ ...props }: Toast) {
  const id = genId()

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    })
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    },
  })

  return {
    id: id,
    dismiss,
    update,
  }
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}

export { useToast, toast }
```

---

## File: `src/lib/data.ts`

```ts
'use client';

import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Timestamp, GeoPoint } from 'firebase/firestore';

const avatars = PlaceHolderImages.filter(img => img.id.startsWith('avatar-'));

export type Helper = {
  id: string; // Corresponds to Firebase Auth UID
  fullName: string;
  email?: string;
  phoneNumber: string;
  profilePhotoUrl: string;
  serviceCategories: string[];
  serviceAreas: string[];
  aboutMe: string;
  isAvailable: boolean;
  memberSince: Timestamp;

  // New Lifecycle Fields
  verificationStatus: 'PENDING' | 'APPROVED' | 'SUSPENDED';
  profileCompletion: {
    percent: number; // 0-100
    missing: Array<'profilePhoto' | 'serviceCategories' | 'serviceAreas' | 'aboutMe'>;
  };
  lifecycleStage: 'REGISTERED' | 'PROFILE_INCOMPLETE' | 'PENDING_VERIFICATION' | 'VERIFIED_READY' | 'ACTIVE' | 'GROWING' | 'SUSPENDED';
  stats: {
    jobsCompleted: number;
    jobsCancelled: number;
    ratingAvg: number;
    reliabilityLevel: 'GREEN' | 'YELLOW' | 'RED';
  };
  
  // Legacy fields to be deprecated or merged into stats
  references?: string;
  additionalSkills?: string;
  reliabilityIndicator: 'Good' | 'Average' | 'Poor';
  rating?: number;
  completedTasks?: number;
};

export type Customer = {
  id: string; // Corresponds to Firebase Auth UID
  fullName: string;
  phoneNumber: string;
  email?: string;
  rating?: number;
  profilePhotoUrl: string;
  memberSince: Timestamp;
};

export type Task = {
  id: string;
  customerId: string;
  title: string;
  description: string;
  category: string;
  area: string; // Approximate area
  location?: GeoPoint; // Exact location, revealed after assignment
  budget: { min: number; max: number };
  acceptedOfferPrice?: number; // Final price from the accepted offer
  effort: 'light' | 'medium' | 'heavy';
  toolsRequired: string[];
  timeWindow: string; // e.g. "Tomorrow afternoon", "Flexible"
  status: 'OPEN' | 'ASSIGNED' | 'ACTIVE' | 'COMPLETED' | 'IN_DISPUTE' | 'REASSIGNED' | 'CANCELLED';
  assignedHelperId?: string;
  createdAt: Timestamp;
  assignedAt?: Timestamp;
  startedAt?: Timestamp;
  completedAt?: Timestamp;
  disputedAt?: Timestamp;
};

export type Offer = {
  id: string;
  taskId: string;
  helperId: string;
  price: number;
  eta: string; // Availability / ETA
  message: string;
  status: 'ACTIVE' | 'WITHDRAWN' | 'ACCEPTED' | 'REJECTED';
  createdAt: Timestamp;
};

export type Feedback = {
  id: string;
  taskId: string;
  customerId: string;
  helperId: string;
  rating: number;
  feedback: string;
  createdAt: Timestamp;
};

export type SupportTicket = {
  id: string;
  userId: string;
  userEmail: string;
  subject: string;
  message: string;
  status: 'NEW' | 'IN_PROGRESS' | 'RESOLVED';
  createdAt: Timestamp;
};


export const taskCategories = [
    'Cleaning',
    'Laundry',
    'Dishwashing',
    'Home Maintenance',
    'Gardening',
    'Cooking',
    'Shopping',
    'Other'
];
```

---

## File: `src/lib/placeholder-images.json`

```json
{
  "placeholderImages": [
    {
      "id": "hero-image",
      "description": "A person helping another with a task at home",
      "imageUrl": "https://images.unsplash.com/photo-1705501704569-118717eb9887?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHx0ZWFtd29yayUyMGhvbWV8ZW58MHx8fHwxNzY4MTcxNjA3fDA&ixlib=rb-4.1.0&q=80&w=1080",
      "imageHint": "teamwork home"
    },
    {
      "id": "avatar-1",
      "description": "User avatar 1",
      "imageUrl": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHxwZXJzb24lMjBwb3J0cmFpdHxlbnwwfHx8fDE3NjgxMTI1NjR8MA&ixlib=rb-4.1.0&q=80&w=1080",
      "imageHint": "person portrait"
    },
    {
      "id": "avatar-2",
      "description": "User avatar 2",
      "imageUrl": "https://images.unsplash.com/photo-1598625873873-52f9aefd7d9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHx3b21hbiUyMHNtaWxpbmd8ZW58MHx8fHwxNzY4MTEwMDExfDA&ixlib=rb-4.1.0&q=80&w=1080",
      "imageHint": "woman smiling"
    },
    {
      "id": "avatar-3",
      "description": "User avatar 3",
      "imageUrl": "https://images.unsplash.com/photo-1618077360395-f3068be8e001?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxtYW4lMjBnbGFzc2VzfGVufDB8fHx8MTc2ODA3ODYyMHww&ixlib=rb-4.1.0&q=80&w=1080",
      "imageHint": "man glasses"
    },
    {
      "id": "avatar-4",
      "description": "User avatar 4",
      "imageUrl": "https://images.unsplash.com/photo-1626465820462-c33422a4ecf0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw5fHxwZXJzb24lMjBoYXBweXxlbnwwfHx8fDE3NjgwNjczNzB8MA&ixlib=rb-4.1.0&q=80&w=1080",
      "imageHint": "person happy"
    },
    {
      "id": "avatar-5",
      "description": "User avatar 5",
      "imageUrl": "https://images.unsplash.com/photo-1501644898242-cfea317d7faf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHx3b21hbiUyMG5hdHVyZXxlbnwwfHx8fDE3NjgwNjg5MTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
      "imageHint": "woman nature"
    },
    {
      "id": "avatar-6",
      "description": "User avatar 6",
      "imageUrl": "https://images.unsplash.com/photo-1749664511269-0aa31a10c6dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxtYW4lMjBwcm9mZXNzaW9uYWx8ZW58MHx8fHwxNzY4MDgyNzg1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      "imageHint": "man professional"
    }
  ]
}
```

---

## File: `src/lib/placeholder-images.ts`

```ts
import data from './placeholder-images.json';

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

export const PlaceHolderImages: ImagePlaceholder[] = data.placeholderImages;
```

---

## File: `src/lib/utils.ts`

```ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

---

## File: `tailwind.config.ts`

```ts
import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ['PT Sans', 'sans-serif'],
        headline: ['Space Grotesk', 'sans-serif'],
        code: ['monospace'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
```

---

## File: `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```


// src/firebase/admin.ts
import * as admin from 'firebase-admin';

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

let app: admin.app.App;

export function initializeAdminApp() {
    if (admin.apps.length > 0) {
        app = admin.apps[0]!;
        return app;
    }

    if (!serviceAccount) {
        throw new Error('The FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set. The API cannot be initialized.');
    }

    try {
        const serviceAccountJson = JSON.parse(serviceAccount);
        app = admin.initializeApp({
            credential: admin.credential.cert(serviceAccountJson),
        });
        return app;
    } catch(e) {
        console.error('Failed to parse service account key. Ensure it is a valid JSON string.');
        throw e;
    }
}

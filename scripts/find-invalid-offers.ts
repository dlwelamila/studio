#!/usr/bin/env ts-node

import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

async function main() {
  initializeApp({
    credential: applicationDefault(),
  });

  const db = getFirestore();
  const snapshot = await db.collectionGroup('offers').get();

  const invalid: Array<{ path: string; etaAt?: unknown; legacyEta?: unknown }> = [];

  snapshot.forEach((doc) => {
    const data = doc.data();
    const etaAt = data.etaAt;
    const isTimestamp = etaAt instanceof Timestamp;

    if (!isTimestamp) {
      invalid.push({
        path: doc.ref.path,
        etaAt,
        legacyEta: data.eta,
      });
    }
  });

  if (invalid.length === 0) {
    console.log('✅ All offer documents contain a valid etaAt timestamp.');
    return;
  }

  console.log('⚠️ Found offer documents missing a valid etaAt timestamp.');
  invalid.forEach((entry, index) => {
    console.log(`\n[${index + 1}] ${entry.path}`);
    console.log(`  etaAt: ${formatValue(entry.etaAt)}`);
    console.log(`  legacy eta: ${formatValue(entry.legacyEta)}`);
  });

  console.log('\nPlease update each document manually (or write a custom migration) to populate etaAt with a Firestore Timestamp.');
}

function formatValue(value: unknown): string {
  if (value === undefined) return 'undefined';
  if (value === null) return 'null';
  if (value instanceof Timestamp) return `Timestamp(${value.toDate().toISOString()})`;
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

main().catch((error) => {
  console.error('Failed to inspect offers collection:', error);
  process.exit(1);
});

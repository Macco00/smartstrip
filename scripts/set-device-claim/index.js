#!/usr/bin/env node

import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

if (process.argv.length !== 3) {
  console.error(`usage: ${process.argv[0]} ${process.argv[1]} <serial_number>`);
  process.exit(1);
}

const serialNumber = process.argv[2];
const email = `${serialNumber}@device.smartstrip.invalid`;

initializeApp();
const auth = getAuth();
const { uid } = await auth.getUserByEmail(email);
await auth.setCustomUserClaims(uid, { is_device: serialNumber });

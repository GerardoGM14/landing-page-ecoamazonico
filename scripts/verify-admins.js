import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const serviceAccount = JSON.parse(
  readFileSync(join(__dirname, 'service-account.json'), 'utf8')
);

initializeApp({ credential: cert(serviceAccount) });
const auth = getAuth();

const ADMIN_EMAILS = [
  'gerardogonzalezm1403@gmail.com',
  'admin@ecoamazonico.com',
];

for (const email of ADMIN_EMAILS) {
  try {
    const user = await auth.getUserByEmail(email);
    if (user.emailVerified) {
      console.log(`OK    ${email} — ya estaba verificado`);
      continue;
    }
    await auth.updateUser(user.uid, { emailVerified: true });
    console.log(`DONE  ${email} — marcado como verificado`);
  } catch (err) {
    console.error(`FAIL  ${email} —`, err.message);
  }
}

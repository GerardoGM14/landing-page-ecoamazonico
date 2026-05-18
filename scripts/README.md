# scripts/

Local one-shot scripts for Firebase admin tasks (seeding, image uploads).

## Setup

```bash
cd scripts
npm install
```

Then place your service account JSON at `scripts/service-account.json`.
Download it from Firebase Console:
**Project settings → Service accounts → Generate new private key**

`service-account.json` is gitignored — never commit it.

## Commands

```bash
npm run upload-images   # uploads landing/src/assets/* into Storage under /site/seed/
npm run seed            # populates Firestore with initial content
```

Run `upload-images` first so the seed script can reference the public URLs.

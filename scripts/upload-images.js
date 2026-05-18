import { initializeApp, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import { readFileSync, readdirSync } from 'node:fs';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import mime from 'mime-types';

const __dirname = dirname(fileURLToPath(import.meta.url));
const serviceAccount = JSON.parse(
  readFileSync(join(__dirname, 'service-account.json'), 'utf8')
);

initializeApp({
  credential: cert(serviceAccount),
  storageBucket: 'eco-as.firebasestorage.app',
});

const bucket = getStorage().bucket();

const assetsDir = join(__dirname, '..', 'landing', 'src', 'assets');
const files = readdirSync(assetsDir).filter((f) => {
  const ext = extname(f).toLowerCase();
  return ['.jpg', '.jpeg', '.png', '.webp', '.svg'].includes(ext);
});

console.log(`Found ${files.length} files to upload\n`);

const urls = {};

for (const file of files) {
  const localPath = join(assetsDir, file);
  const remotePath = `site/seed/${file}`;
  const contentType = mime.lookup(file) || 'application/octet-stream';

  await bucket.upload(localPath, {
    destination: remotePath,
    metadata: { contentType, cacheControl: 'public, max-age=31536000' },
  });

  await bucket.file(remotePath).makePublic();
  const publicUrl = `https://storage.googleapis.com/${bucket.name}/${remotePath}`;
  urls[file] = publicUrl;
  console.log(`OK  ${file}`);
}

console.log('\nAll uploads complete. URL map:\n');
console.log(JSON.stringify(urls, null, 2));

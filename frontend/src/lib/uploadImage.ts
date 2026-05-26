import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirebase } from './firebase';

export const MAX_IMAGE_SIZE_MB = 10;

export interface UploadResult {
  ok: true;
  url: string;
}

export interface UploadError {
  ok: false;
  error: string;
}

export async function uploadImage(file: File, path: string): Promise<UploadResult | UploadError> {
  if (!file.type.startsWith('image/')) {
    return { ok: false, error: 'Solo se permiten imágenes.' };
  }
  if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
    return { ok: false, error: `La imagen supera ${MAX_IMAGE_SIZE_MB}MB.` };
  }

  try {
    const { storage } = getFirebase();
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const objectRef = storageRef(storage, `${path}/${safeName}`);

    await uploadBytes(objectRef, file, {
      contentType: file.type,
      cacheControl: 'public, max-age=31536000',
    });

    const url = await getDownloadURL(objectRef);
    return { ok: true, url };
  } catch (err) {
    console.error(err);
    return { ok: false, error: 'No se pudo subir la imagen.' };
  }
}

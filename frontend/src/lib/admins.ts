export const ADMIN_EMAILS = [
  'gerardogonzalezm1403@gmail.com',
  'admin@ecoamazonico.com',
] as const;

export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  return (ADMIN_EMAILS as readonly string[]).includes(email.toLowerCase());
}

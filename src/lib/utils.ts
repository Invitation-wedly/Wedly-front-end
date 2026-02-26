import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const DEFAULT_PROD_URL = 'https://wedding-invitation-two-alpha.vercel.app/';

function normalizeSiteUrl(value: string | undefined): string | undefined {
  if (!value) return undefined;
  return value.endsWith('/') ? value : `${value}/`;
}

const envSiteUrl = normalizeSiteUrl(import.meta.env.VITE_PUBLIC_SITE_URL);
const devSiteUrl = normalizeSiteUrl(
  typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173',
);

export const URL = import.meta.env.PROD
  ? envSiteUrl ?? DEFAULT_PROD_URL
  : devSiteUrl ?? 'http://localhost:5173/';

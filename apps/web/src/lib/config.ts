const rawApiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const normalizedBase = rawApiBase.replace(/\/$/, '');
export const API_BASE_URL = normalizedBase.endsWith('/api')
  ? normalizedBase
  : `${normalizedBase}/api`;
export const APP_NAME = 'MathSolve AI';
export const APP_VERSION = '1.0.0';

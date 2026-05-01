const baseUrl = import.meta.env.BASE_URL || '/';

export function withBase(pathname: string): string {
  if (!pathname) return baseUrl;
  if (pathname.startsWith('#') || /^[a-z][a-z0-9+.-]*:/i.test(pathname)) return pathname;

  const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const cleanPath = pathname.replace(/^\/+/, '');
  return `${cleanBase}${cleanPath}`;
}

export function withoutBase(pathname: string): string {
  const cleanBase = baseUrl.replace(/\/$/, '');
  if (cleanBase && cleanBase !== '/' && pathname.startsWith(`${cleanBase}/`)) {
    return pathname.slice(cleanBase.length) || '/';
  }
  return pathname;
}

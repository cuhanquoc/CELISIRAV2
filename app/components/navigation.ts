interface ResolveMenuLinkInput {
  title: string;
  url?: string | null;
  primaryDomainUrl: string;
  publicStoreDomain: string;
}

export interface ResolvedMenuLink {
  id: string;
  title: string;
  to: string;
  isExternal: boolean;
}

const INTERNAL_ROUTES = new Set([
  '',
  'account',
  'blogs',
  'cart',
  'collections',
  'discount',
  'pages',
  'policies',
  'products',
  'search',
]);

const PATH_REMAP: Record<string, string> = {
  '/blog': '/blogs',
  '/journal': '/blogs',
  '/privacy': '/policies/privacy-policy',
  '/returns': '/policies/refund-policy',
  '/shipping': '/policies/shipping-policy',
  '/terms': '/policies/terms-of-service',
};

const TITLE_REMAP: Record<string, string> = {
  blog: '/blogs',
  blogs: '/blogs',
  privacy: '/policies/privacy-policy',
  'privacy policy': '/policies/privacy-policy',
  returns: '/policies/refund-policy',
  shipping: '/policies/shipping-policy',
  terms: '/policies/terms-of-service',
  'terms of service': '/policies/terms-of-service',
};

const LOCALE_SEGMENT = /^[a-z]{2}(?:-[a-z]{2})?$/i;

function isPlaceholder(url: string) {
  const lowered = url.trim().toLowerCase();
  return (
    !lowered ||
    lowered === '#' ||
    lowered === '/#' ||
    lowered.startsWith('javascript:')
  );
}

function normalizeInternalPath(path: string, title: string) {
  const [pathOnly, search = ''] = path.split('?');
  const normalizedPath =
    PATH_REMAP[pathOnly.toLowerCase()] ??
    TITLE_REMAP[title.trim().toLowerCase()] ??
    pathOnly;

  const withSearch = search ? `${normalizedPath}?${search}` : normalizedPath;
  return withSearch.replace(/\/{2,}/g, '/');
}

function hasSupportedRoute(path: string) {
  const pathOnly = path.split('?')[0].split('#')[0];
  const segments = pathOnly.split('/').filter(Boolean);
  const first = segments[0] ?? '';

  if (INTERNAL_ROUTES.has(first)) return true;
  if (LOCALE_SEGMENT.test(first)) {
    const second = segments[1] ?? '';
    return INTERNAL_ROUTES.has(second);
  }
  return false;
}

export function resolveMenuLink({
  title,
  url,
  primaryDomainUrl,
  publicStoreDomain,
}: ResolveMenuLinkInput): Omit<ResolvedMenuLink, 'id'> | null {
  if (!url || isPlaceholder(url)) return null;

  const trimmed = url.trim();
  const isAbsolute = /^https?:\/\//i.test(trimmed);
  const primaryHost = new URL(primaryDomainUrl).hostname.toLowerCase();
  const publicHost = publicStoreDomain
    .replace(/^https?:\/\//i, '')
    .split('/')[0]
    .toLowerCase();

  if (isAbsolute) {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.toLowerCase();
    const isInternal =
      host.includes('myshopify.com') ||
      host === primaryHost ||
      host.endsWith(`.${primaryHost}`) ||
      host === publicHost ||
      host.endsWith(`.${publicHost}`);

    if (!isInternal) {
      return {
        title,
        to: trimmed,
        isExternal: true,
      };
    }

    const normalizedPath = normalizeInternalPath(
      `${parsed.pathname}${parsed.search ?? ''}`,
      title,
    );
    if (!hasSupportedRoute(normalizedPath)) return null;
    return {
      title,
      to: normalizedPath,
      isExternal: false,
    };
  }

  if (trimmed.startsWith('mailto:') || trimmed.startsWith('tel:')) {
    return {
      title,
      to: trimmed,
      isExternal: true,
    };
  }

  if (!trimmed.startsWith('/')) return null;

  const normalizedPath = normalizeInternalPath(trimmed, title);
  if (!hasSupportedRoute(normalizedPath)) return null;

  return {
    title,
    to: normalizedPath,
    isExternal: false,
  };
}

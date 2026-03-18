export interface UiMoney {
  amount: string;
  currencyCode: string;
}

export interface UiImage {
  id?: string;
  url: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface UiPageInfo {
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  startCursor: string | null;
  endCursor: string | null;
}

export interface UiSeo {
  title: string;
  description: string;
}

export const EMPTY_PAGE_INFO: UiPageInfo = {
  hasPreviousPage: false,
  hasNextPage: false,
  startCursor: null,
  endCursor: null,
};

export function mapMoney(
  money?: {amount?: string | null; currencyCode?: string | null} | null,
): UiMoney | null {
  if (!money?.amount || !money.currencyCode) return null;

  return {
    amount: money.amount,
    currencyCode: money.currencyCode,
  };
}

export function mapImage(
  image?:
    | {
        id?: string | null;
        url?: string | null;
        altText?: string | null;
        width?: number | null;
        height?: number | null;
      }
    | null,
  altFallback = '',
): UiImage | null {
  if (!image?.url) return null;

  return {
    id: image.id ?? undefined,
    url: image.url,
    alt: image.altText || altFallback,
    width: image.width ?? undefined,
    height: image.height ?? undefined,
  };
}

export function mapPageInfo(
  pageInfo?:
    | {
        hasPreviousPage?: boolean | null;
        hasNextPage?: boolean | null;
        startCursor?: string | null;
        endCursor?: string | null;
      }
    | null,
): UiPageInfo {
  if (!pageInfo) return EMPTY_PAGE_INFO;

  return {
    hasPreviousPage: Boolean(pageInfo.hasPreviousPage),
    hasNextPage: Boolean(pageInfo.hasNextPage),
    startCursor: pageInfo.startCursor ?? null,
    endCursor: pageInfo.endCursor ?? null,
  };
}

export function mapSeo(
  seo?: {title?: string | null; description?: string | null} | null,
  fallbackTitle = '',
  fallbackDescription = '',
): UiSeo {
  return {
    title: seo?.title || fallbackTitle,
    description: seo?.description || fallbackDescription,
  };
}

export function sanitizeText(value?: string | null): string {
  return value?.trim() || '';
}

export function compactStrings(
  values: Array<string | null | undefined> | null | undefined,
): string[] {
  return (
    values
      ?.map((value) => value?.trim())
      .filter((value): value is string => Boolean(value)) ?? []
  );
}

export function asPath(path: string): string {
  return path.startsWith('/') ? path : `/${path}`;
}

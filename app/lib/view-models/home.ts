import type {
  HomeCollectionHighlightsQuery,
  HomeTrendingProductsQuery,
} from 'storefrontapi.generated';
import {asPath, mapImage, mapMoney, sanitizeText, type UiImage} from './shared';

export interface HomeCollectionViewModel {
  id: string;
  title: string;
  description: string;
  handle: string;
  href: string;
  image: UiImage | null;
}

export interface HomeProductViewModel {
  id: string;
  handle: string;
  title: string;
  vendor: string;
  href: string;
  image: UiImage | null;
  minPrice: ReturnType<typeof mapMoney>;
}

export interface HomeViewModel {
  isShopLinked: boolean;
  featuredCollection: HomeCollectionViewModel | null;
  recommendedProducts: HomeProductViewModel[];
  checklist: string[];
}

interface CelisiraHomeQueryLike {
  collections?: {
    nodes?: Array<{
      id: string;
      handle: string;
      title: string;
      description?: string | null;
      image?:
        | {
            id?: string | null;
            url?: string | null;
            altText?: string | null;
            width?: number | null;
            height?: number | null;
          }
        | null;
    }>;
  } | null;
  products?: {
    nodes?: Array<{
      id: string;
      handle: string;
      title: string;
      vendor?: string | null;
      featuredImage?:
        | {
            id?: string | null;
            url?: string | null;
            altText?: string | null;
            width?: number | null;
            height?: number | null;
          }
        | null;
      priceRange: {
        minVariantPrice: Parameters<typeof mapMoney>[0];
      };
    }>;
  } | null;
}

export function mapFeaturedCollectionForHome(
  query: HomeCollectionHighlightsQuery,
): HomeCollectionViewModel | null {
  const node = query.collections.nodes[0];
  if (!node) return null;

  return {
    id: node.id,
    title: sanitizeText(node.title),
    description: '',
    handle: node.handle,
    href: asPath(`collections/${node.handle}`),
    image: mapImage(node.image, node.title),
  };
}

export function mapRecommendedProductsForHome(
  query: HomeTrendingProductsQuery | null | undefined,
): HomeProductViewModel[] {
  if (!query) return [];

  return query.products.nodes.map((product) => ({
    id: product.id,
    handle: product.handle,
    title: sanitizeText(product.title),
    vendor: '',
    href: asPath(`products/${product.handle}`),
    image: mapImage(product.featuredImage, product.title),
    minPrice: mapMoney(product.priceRange.minVariantPrice),
  }));
}

export function createHomeViewModel(input: {
  isShopLinked: boolean;
  featuredCollectionQuery: HomeCollectionHighlightsQuery;
  recommendedProductsQuery?: HomeTrendingProductsQuery | null;
}): HomeViewModel {
  return {
    isShopLinked: input.isShopLinked,
    featuredCollection: mapFeaturedCollectionForHome(
      input.featuredCollectionQuery,
    ),
    recommendedProducts: mapRecommendedProductsForHome(
      input.recommendedProductsQuery,
    ),
    checklist: input.isShopLinked ? [] : getStoreConnectionChecklist(),
  };
}

export function mapCelisiraHomeQueryToViewModel(
  input: CelisiraHomeQueryLike,
  isShopLinked: boolean,
): HomeViewModel {
  const featuredCollection = input.collections?.nodes?.[0] ?? null;
  const recommendedProducts = input.products?.nodes ?? [];

  return {
    isShopLinked,
    featuredCollection: featuredCollection
      ? {
          id: featuredCollection.id,
          title: sanitizeText(featuredCollection.title),
          description: sanitizeText(featuredCollection.description),
          handle: featuredCollection.handle,
          href: asPath(`collections/${featuredCollection.handle}`),
          image: mapImage(featuredCollection.image, featuredCollection.title),
        }
      : null,
    recommendedProducts: recommendedProducts.map((product) => ({
      id: product.id,
      handle: product.handle,
      title: sanitizeText(product.title),
      vendor: sanitizeText(product.vendor),
      href: asPath(`products/${product.handle}`),
      image: mapImage(product.featuredImage, product.title),
      minPrice: mapMoney(product.priceRange.minVariantPrice),
    })),
    checklist: isShopLinked ? [] : getStoreConnectionChecklist(),
  };
}

export function getStoreConnectionChecklist(): string[] {
  return [
    'Run `shopify hydrogen link` and select the target store.',
    'Verify `PUBLIC_STORE_DOMAIN` and storefront tokens are present in Hydrogen env.',
    'Run a storefront query from server context and confirm non-null collections/products.',
    'Validate customer account domain setup before enabling account shell in production.',
  ];
}

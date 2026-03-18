import type {
  CollectionQuery,
  StoreCollectionsQuery,
} from 'storefrontapi.generated';
import {asPath, mapImage, mapMoney, mapPageInfo, sanitizeText} from './shared';

export interface CollectionCardViewModel {
  id: string;
  title: string;
  description: string;
  handle: string;
  href: string;
  image: ReturnType<typeof mapImage>;
}

export interface CollectionProductCardViewModel {
  id: string;
  title: string;
  handle: string;
  href: string;
  image: ReturnType<typeof mapImage>;
  minPrice: ReturnType<typeof mapMoney>;
  maxPrice: ReturnType<typeof mapMoney>;
}

export interface CollectionPageViewModel {
  id: string;
  title: string;
  description: string;
  handle: string;
  products: CollectionProductCardViewModel[];
  pageInfo: ReturnType<typeof mapPageInfo>;
}

interface CelisiraCollectionQueryLike {
  collection?: {
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
    products: {
      nodes: Array<
        NonNullable<CollectionQuery['collection']>['products']['nodes'][number]
      >;
      pageInfo: Parameters<typeof mapPageInfo>[0];
    };
  } | null;
}

type CollectionProductNode =
  NonNullable<CollectionQuery['collection']>['products']['nodes'][number];

function mapCollectionProduct(
  product: CollectionProductNode,
): CollectionProductCardViewModel {
  return {
    id: product.id,
    title: sanitizeText(product.title),
    handle: product.handle,
    href: asPath(`products/${product.handle}`),
    image: mapImage(product.featuredImage, product.title),
    minPrice: mapMoney(product.priceRange.minVariantPrice),
    maxPrice: mapMoney(product.priceRange.maxVariantPrice),
  };
}

export function mapCollectionQueryToViewModel(
  query: CollectionQuery,
): CollectionPageViewModel | null {
  if (!query.collection) return null;

  return {
    id: query.collection.id,
    title: sanitizeText(query.collection.title),
    description: sanitizeText(query.collection.description),
    handle: query.collection.handle,
    products: query.collection.products.nodes.map(mapCollectionProduct),
    pageInfo: mapPageInfo(query.collection.products.pageInfo),
  };
}

export function mapCelisiraCollectionQueryToViewModel(
  query: CelisiraCollectionQueryLike,
): CollectionPageViewModel | null {
  if (!query.collection) return null;

  return {
    id: query.collection.id,
    title: sanitizeText(query.collection.title),
    description: sanitizeText(query.collection.description),
    handle: query.collection.handle,
    products: query.collection.products.nodes.map(mapCollectionProduct),
    pageInfo: mapPageInfo(query.collection.products.pageInfo),
  };
}

export function mapCollectionsIndexToViewModel(
  query: StoreCollectionsQuery,
): {
  collections: CollectionCardViewModel[];
  pageInfo: ReturnType<typeof mapPageInfo>;
} {
  return {
    collections: query.collections.nodes.map((collection) => ({
      id: collection.id,
      title: sanitizeText(collection.title),
      description: '',
      handle: collection.handle,
      href: asPath(`collections/${collection.handle}`),
      image: mapImage(collection.image, collection.title),
    })),
    pageInfo: mapPageInfo(query.collections.pageInfo),
  };
}

export function mapCelisiraCollectionsIndexToViewModel(query: {
  collections?: {
    nodes?: Array<{
      id: string;
      handle: string;
      title: string;
      description?: string | null;
      image?: Parameters<typeof mapImage>[0];
    }>;
    pageInfo?: Parameters<typeof mapPageInfo>[0];
  } | null;
}): {
  collections: CollectionCardViewModel[];
  pageInfo: ReturnType<typeof mapPageInfo>;
} {
  return {
    collections: query.collections?.nodes?.map((collection) => ({
      id: collection.id,
      title: sanitizeText(collection.title),
      description: sanitizeText(collection.description),
      handle: collection.handle,
      href: asPath(`collections/${collection.handle}`),
      image: mapImage(collection.image, collection.title),
    })) ?? [],
    pageInfo: mapPageInfo(query.collections?.pageInfo),
  };
}

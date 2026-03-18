import {redirect, useLoaderData, Link, useLocation} from 'react-router';
import type {Route} from './+types/($locale).collections.$handle';
import {
  getPaginationVariables,
  Analytics,
  Image,
  Money,
  Pagination,
} from '@shopify/hydrogen';
import type * as StorefrontAPI from '@shopify/hydrogen/storefront-api-types';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';

const SORT_OPTIONS = [
  {value: 'featured', label: 'Featured', sortKey: 'MANUAL', reverse: false},
  {
    value: 'best-selling',
    label: 'Best selling',
    sortKey: 'BEST_SELLING',
    reverse: false,
  },
  {value: 'newest', label: 'Newest', sortKey: 'CREATED', reverse: true},
  {
    value: 'price-asc',
    label: 'Price low to high',
    sortKey: 'PRICE',
    reverse: false,
  },
  {
    value: 'price-desc',
    label: 'Price high to low',
    sortKey: 'PRICE',
    reverse: true,
  },
  {
    value: 'title-asc',
    label: 'Alphabetical A-Z',
    sortKey: 'TITLE',
    reverse: false,
  },
  {
    value: 'title-desc',
    label: 'Alphabetical Z-A',
    sortKey: 'TITLE',
    reverse: true,
  },
] as const;

const DEFAULT_SORT = SORT_OPTIONS[0];
type MoneyValue = Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;

type ProductConnection = {
  nodes: Array<{
    id: string;
    handle: string;
    title: string;
    featuredImage?: {
      id?: string | null;
      altText?: string | null;
      url: string;
      width?: number | null;
      height?: number | null;
    } | null;
    images: {
      nodes: Array<{
        id?: string | null;
        altText?: string | null;
        url: string;
        width?: number | null;
        height?: number | null;
      }>;
    };
    priceRange: {
      minVariantPrice: MoneyValue;
      maxVariantPrice: MoneyValue;
    };
    compareAtPriceRange: {
      minVariantPrice: MoneyValue;
      maxVariantPrice: MoneyValue;
    };
  }>;
  pageInfo: {
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    endCursor?: string | null;
    startCursor?: string | null;
  };
  filters: FilterGroup[];
};

type FilterGroup = {
  id: string;
  label: string;
  type: string;
  values: Array<{
    id: string;
    label: string;
    count: number;
    input?: unknown;
  }>;
};

type LoaderData = {
  collection: {
    id: string;
    handle: string;
    title: string;
    description?: string | null;
    image?: {
      id?: string | null;
      url: string;
      altText?: string | null;
      width?: number | null;
      height?: number | null;
    } | null;
    products: ProductConnection;
  };
  sort: (typeof SORT_OPTIONS)[number]['value'];
  selectedFilterIds: string[];
};

export const meta: Route.MetaFunction = ({data}) => {
  return [{title: `Celisira | ${data?.collection.title ?? 'Collection'}`}];
};

function getSortOption(url: URL) {
  const sortParam = url.searchParams.get('sort');
  return (
    SORT_OPTIONS.find((option) => option.value === sortParam) || DEFAULT_SORT
  );
}

function parseSelectedFilterIds(url: URL) {
  return [...new Set(url.searchParams.getAll('filter').filter(Boolean))];
}

function isProductFilter(value: unknown): value is StorefrontAPI.ProductFilter {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function resolveSelectedFilters(filters: FilterGroup[], selectedIds: string[]) {
  const valueMap = new Map<string, string>();

  for (const filter of filters) {
    for (const value of filter.values) {
      if (typeof value.input === 'string' && value.input) {
        valueMap.set(value.id, value.input);
      }
    }
  }

  const resolved: StorefrontAPI.ProductFilter[] = [];

  for (const id of selectedIds) {
    const input = valueMap.get(id);
    if (!input) continue;

    try {
      const parsed: unknown = JSON.parse(input);
      if (isProductFilter(parsed)) {
        resolved.push(parsed);
      }
    } catch {
      // Ignore malformed filter values.
    }
  }

  return resolved;
}

function stripPaginationParams(searchParams: URLSearchParams) {
  searchParams.delete('cursor');
  searchParams.delete('direction');
  searchParams.delete('startCursor');
  searchParams.delete('endCursor');
}

export async function loader({context, params, request}: Route.LoaderArgs) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw redirect('/collections');
  }

  const paginationVariables = getPaginationVariables(request, {
    pageBy: 12,
  });

  const url = new URL(request.url);
  const sortOption = getSortOption(url);
  const selectedFilterIds = parseSelectedFilterIds(url);

  const baseVariables = {
    handle,
    ...paginationVariables,
    sortKey: sortOption.sortKey,
    reverse: sortOption.reverse,
  };

  const initialResponse = await storefront.query(COLLECTION_QUERY, {
    variables: baseVariables,
  });

  const initialCollection = initialResponse.collection;

  if (!initialCollection) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    });
  }

  redirectIfHandleIsLocalized(request, {handle, data: initialCollection});

  const selectedFilters = resolveSelectedFilters(
    initialCollection.products.filters,
    selectedFilterIds,
  );

  if (!selectedFilters.length) {
    return {
      collection: initialCollection,
      sort: sortOption.value,
      selectedFilterIds: [],
    } satisfies LoaderData;
  }

  const filteredResponse = await storefront.query(COLLECTION_QUERY, {
    variables: {
      ...baseVariables,
      filters: selectedFilters,
    },
  });

  const filteredCollection = filteredResponse.collection || initialCollection;

  return {
    collection: filteredCollection,
    sort: sortOption.value,
    selectedFilterIds,
  } satisfies LoaderData;
}

export default function Collection() {
  const {collection, sort, selectedFilterIds} = useLoaderData() as LoaderData;
  const location = useLocation();
  const currentParams = new URLSearchParams(location.search);

  const hasFilters = selectedFilterIds.length > 0;
  const filterValues = collection.products.filters.flatMap((filter) =>
    filter.values.map((value) => ({
      ...value,
      filterLabel: filter.label,
    })),
  );

  const activeFilterSet = new Set(selectedFilterIds);

  function buildSortHref(nextSort: string) {
    const next = new URLSearchParams(currentParams);
    stripPaginationParams(next);

    if (nextSort === DEFAULT_SORT.value) {
      next.delete('sort');
    } else {
      next.set('sort', nextSort);
    }

    return next.toString() ? `?${next.toString()}` : '';
  }

  function buildFilterHref(filterId: string, selected: boolean) {
    const next = new URLSearchParams(currentParams);
    stripPaginationParams(next);

    const currentFilters = next.getAll('filter');
    next.delete('filter');

    const nextFilters = selected
      ? currentFilters.filter((id) => id !== filterId)
      : [...currentFilters, filterId];

    for (const id of new Set(nextFilters)) {
      next.append('filter', id);
    }

    return next.toString() ? `?${next.toString()}` : '';
  }

  function clearFiltersHref() {
    const next = new URLSearchParams(currentParams);
    stripPaginationParams(next);
    next.delete('filter');

    return next.toString() ? `?${next.toString()}` : '';
  }

  const heroImage =
    collection.image || collection.products.nodes[0]?.featuredImage;

  return (
    <div className="collection-page">
      <section className="collection-hero">
        {heroImage ? (
          <Image
            className="collection-hero-image"
            alt={heroImage.altText || collection.title}
            data={heroImage}
            loading="eager"
            sizes="100vw"
          />
        ) : null}
        <div className="collection-hero-overlay" />
        <div className="collection-hero-content">
          <p className="collection-eyebrow">
            <Link to="/collections">Collections</Link>
            <span>/</span>
            <span>{collection.title}</span>
          </p>
          <h1>{collection.title}</h1>
          {collection.description ? (
            <p className="collection-description">{collection.description}</p>
          ) : (
            <p className="collection-description">
              Curated Celisira selections, tailored for modern day and evening
              wardrobes.
            </p>
          )}
        </div>
      </section>

      <section className="collection-toolbar">
        <div className="collection-toolbar-top">
          <p>
            {collection.products.nodes.length}{' '}
            {collection.products.nodes.length === 1 ? 'product' : 'products'}
          </p>
          {hasFilters ? (
            <Link to={clearFiltersHref()} className="collection-clear-link">
              Clear filters
            </Link>
          ) : null}
        </div>

        <div className="collection-toolbar-controls">
          <details className="collection-controls-mobile">
            <summary>Filter & sort</summary>
            <div className="collection-controls-mobile-panel">
              <div className="collection-sort-row">
                {SORT_OPTIONS.map((option) => (
                  <Link
                    key={option.value}
                    className={option.value === sort ? 'is-active' : ''}
                    to={buildSortHref(option.value)}
                  >
                    {option.label}
                  </Link>
                ))}
              </div>

              {collection.products.filters.map((filter) => (
                <div key={filter.id} className="collection-filter-group">
                  <h3>{filter.label}</h3>
                  <div className="collection-filter-values">
                    {filter.values.map((value) => {
                      const isActive = activeFilterSet.has(value.id);
                      return (
                        <Link
                          key={value.id}
                          className={isActive ? 'is-active' : ''}
                          to={buildFilterHref(value.id, isActive)}
                        >
                          {value.label} ({value.count})
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </details>

          <div className="collection-sort-row collection-sort-row-desktop">
            {SORT_OPTIONS.map((option) => (
              <Link
                key={option.value}
                className={option.value === sort ? 'is-active' : ''}
                to={buildSortHref(option.value)}
              >
                {option.label}
              </Link>
            ))}
          </div>

          <div className="collection-filter-pills">
            {filterValues.slice(0, 20).map((value) => {
              const isActive = activeFilterSet.has(value.id);
              return (
                <Link
                  key={value.id}
                  className={isActive ? 'is-active' : ''}
                  to={buildFilterHref(value.id, isActive)}
                  title={value.filterLabel}
                >
                  {value.label}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <Pagination<ProductConnection['nodes'][number]>
        connection={collection.products}
      >
        {({nodes, isLoading, PreviousLink, NextLink}) => (
          <section className="collection-results">
            <div className="collection-pagination-row">
              <PreviousLink className="collection-page-link">
                {isLoading ? 'Loading...' : 'Load previous'}
              </PreviousLink>
              <NextLink className="collection-page-link">
                {isLoading ? 'Loading...' : 'Load more'}
              </NextLink>
            </div>

            {nodes.length ? (
              <div className="collection-products-grid">
                {nodes.map((product) => (
                  <Link
                    key={product.id}
                    className="collection-product-card"
                    to={`/products/${product.handle}`}
                    prefetch="intent"
                  >
                    <div className="collection-product-media">
                      {product.featuredImage || product.images.nodes[0] ? (
                        <Image
                          alt={product.featuredImage?.altText || product.title}
                          data={
                            product.featuredImage || product.images.nodes[0]
                          }
                          loading="lazy"
                          sizes="(min-width: 70em) 25vw, (min-width: 45em) 33vw, 50vw"
                        />
                      ) : (
                        <div className="collections-masonry-fallback" />
                      )}
                      {product.images.nodes[1] ? (
                        <Image
                          className="collection-product-media-hover"
                          alt={product.images.nodes[1].altText || product.title}
                          data={product.images.nodes[1]}
                          loading="lazy"
                          sizes="(min-width: 70em) 25vw, (min-width: 45em) 33vw, 50vw"
                        />
                      ) : null}
                    </div>
                    <div className="collection-product-content">
                      <h2>{product.title}</h2>
                      <div className="collection-product-price">
                        <Money data={product.priceRange.minVariantPrice} />
                        {Number(
                          product.compareAtPriceRange.minVariantPrice.amount,
                        ) >
                        Number(product.priceRange.minVariantPrice.amount) ? (
                          <span className="collection-product-compare-price">
                            <Money
                              data={product.compareAtPriceRange.minVariantPrice}
                            />
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="collection-empty-state">
                <h2>No products match these filters</h2>
                <p>Try clearing filters or choose another collection.</p>
                <Link to={clearFiltersHref()} className="collection-clear-link">
                  Clear filters
                </Link>
              </div>
            )}
          </section>
        )}
      </Pagination>

      <Analytics.CollectionView
        data={{
          collection: {
            id: collection.id,
            handle: collection.handle,
          },
        }}
      />
    </div>
  );
}

const PRODUCT_CARD_FRAGMENT = `#graphql
  fragment CollectionProductCard on Product {
    id
    handle
    title
    featuredImage {
      id
      altText
      url
      width
      height
    }
    images(first: 2) {
      nodes {
        id
        altText
        url
        width
        height
      }
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
  }
` as const;

const COLLECTION_QUERY = `#graphql
  ${PRODUCT_CARD_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
    $filters: [ProductFilter!]
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      image {
        id
        url
        altText
        width
        height
      }
      products(
        first: $first
        last: $last
        before: $startCursor
        after: $endCursor
        sortKey: $sortKey
        reverse: $reverse
        filters: $filters
      ) {
        filters {
          id
          label
          type
          values {
            id
            label
            count
            input
          }
        }
        nodes {
          ...CollectionProductCard
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
` as const;

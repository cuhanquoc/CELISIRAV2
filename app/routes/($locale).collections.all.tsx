import type {Route} from './+types/($locale).collections.all';
import {useLoaderData, Link, useLocation} from 'react-router';
import {
  getPaginationVariables,
  Image,
  Money,
  Pagination,
} from '@shopify/hydrogen';
import type * as StorefrontAPI from '@shopify/hydrogen/storefront-api-types';

type MoneyValue = Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;

type ProductCard = {
  id: string;
  handle: string;
  title: string;
  featuredImage?: {
    id: string;
    altText?: string | null;
    url: string;
    width?: number | null;
    height?: number | null;
  } | null;
  priceRange: {
    minVariantPrice: MoneyValue;
    maxVariantPrice: MoneyValue;
  };
  compareAtPriceRange: {
    minVariantPrice: MoneyValue;
    maxVariantPrice: MoneyValue;
  };
};

type LoaderData = {
  products: {
    nodes: ProductCard[];
    pageInfo: {
      hasPreviousPage: boolean;
      hasNextPage: boolean;
      startCursor?: string | null;
      endCursor?: string | null;
    };
  };
  sort: (typeof SORT_OPTIONS)[number]['value'];
};

const SORT_OPTIONS = [
  {value: 'featured', label: 'Featured', sortKey: 'UPDATED_AT', reverse: true},
  {
    value: 'best-selling',
    label: 'Best selling',
    sortKey: 'BEST_SELLING',
    reverse: false,
  },
  {value: 'newest', label: 'Newest', sortKey: 'CREATED_AT', reverse: true},
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

export const meta: Route.MetaFunction = () => {
  return [{title: `Celisira | All Products`}];
};

function getSortOption(url: URL) {
  const sortParam = url.searchParams.get('sort');
  return (
    SORT_OPTIONS.find((option) => option.value === sortParam) || DEFAULT_SORT
  );
}

function stripPaginationParams(searchParams: URLSearchParams) {
  searchParams.delete('cursor');
  searchParams.delete('direction');
  searchParams.delete('startCursor');
  searchParams.delete('endCursor');
}

export async function loader({context, request}: Route.LoaderArgs) {
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 12,
  });

  const url = new URL(request.url);
  const sortOption = getSortOption(url);

  const {products} = await storefront.query(CATALOG_QUERY, {
    variables: {
      ...paginationVariables,
      sortKey: sortOption.sortKey,
      reverse: sortOption.reverse,
    },
  });

  return {products, sort: sortOption.value};
}

export default function CollectionAllProducts() {
  const {products, sort} = useLoaderData() as LoaderData;
  const location = useLocation();

  function buildSortHref(nextSort: string) {
    const next = new URLSearchParams(location.search);
    stripPaginationParams(next);

    if (nextSort === DEFAULT_SORT.value) {
      next.delete('sort');
    } else {
      next.set('sort', nextSort);
    }

    return next.toString() ? `?${next.toString()}` : '';
  }

  return (
    <div className="collection-page">
      <section className="collection-hero collection-hero-all-products">
        <div className="collection-hero-overlay" />
        <div className="collection-hero-content">
          <p className="collection-eyebrow">
            <Link to="/collections">Collections</Link>
            <span>/</span>
            <span>All Products</span>
          </p>
          <h1>All Styles</h1>
          <p className="collection-description">
            The complete Celisira edit across all categories and seasonal drops.
          </p>
        </div>
      </section>

      <section className="collection-toolbar">
        <div className="collection-toolbar-top">
          <p>
            {products.nodes.length}{' '}
            {products.nodes.length === 1 ? 'product' : 'products'}
          </p>
        </div>

        <div className="collection-toolbar-controls">
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
        </div>
      </section>

      <Pagination<ProductCard> connection={products}>
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
                    prefetch="intent"
                    to={`/products/${product.handle}`}
                  >
                    <div className="collection-product-media">
                      {product.featuredImage ? (
                        <Image
                          alt={product.featuredImage.altText || product.title}
                          data={product.featuredImage}
                          loading="lazy"
                          sizes="(min-width: 70em) 25vw, (min-width: 45em) 33vw, 50vw"
                        />
                      ) : (
                        <div className="collections-masonry-fallback" />
                      )}
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
                <h2>No products are available right now</h2>
                <p>Try another sort or check back soon.</p>
                <Link to="/collections" className="collection-clear-link">
                  Browse collections
                </Link>
              </div>
            )}
          </section>
        )}
      </Pagination>
    </div>
  );
}

const CATALOG_QUERY = `#graphql
  query Catalog(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
    $sortKey: ProductSortKeys
    $reverse: Boolean
  ) @inContext(country: $country, language: $language) {
    products(
      first: $first
      last: $last
      before: $startCursor
      after: $endCursor
      sortKey: $sortKey
      reverse: $reverse
    ) {
      nodes {
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
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
` as const;

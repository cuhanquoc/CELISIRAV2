import {useLoaderData, Link} from 'react-router';
import type {Route} from './+types/($locale).collections._index';
import {getPaginationVariables, Image, Pagination} from '@shopify/hydrogen';

type CollectionCard = {
  id: string;
  title: string;
  handle: string;
  image?: {
    id: string;
    url: string;
    altText?: string | null;
    width?: number | null;
    height?: number | null;
  } | null;
};

type LoaderData = {
  collections: {
    nodes: CollectionCard[];
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor?: string | null;
      endCursor?: string | null;
    };
  };
};

export const meta: Route.MetaFunction = () => {
  return [{title: 'Celisira | Collections'}];
};

export async function loader({context, request}: Route.LoaderArgs) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 12,
  });

  const {collections} = await context.storefront.query(COLLECTIONS_QUERY, {
    variables: paginationVariables,
  });

  return {collections};
}

export default function CollectionsLanding() {
  const {collections} = useLoaderData() as LoaderData;

  return (
    <div className="collections-page">
      <section className="collections-landing-hero">
        <div className="collections-landing-hero-content">
          <p className="collection-eyebrow">Celisira World</p>
          <h1>Browse Every Collection</h1>
          <p>
            Discover the full edit from new arrivals to signature staples,
            crafted for elegant everyday dressing.
          </p>
        </div>
      </section>

      <Pagination<CollectionCard> connection={collections}>
        {({nodes, isLoading, PreviousLink, NextLink}) => (
          <section className="collections-landing-content">
            <div className="collection-pagination-row">
              <PreviousLink className="collection-page-link">
                {isLoading ? 'Loading...' : 'Load previous'}
              </PreviousLink>
              <NextLink className="collection-page-link">
                {isLoading ? 'Loading...' : 'Load more'}
              </NextLink>
            </div>

            <div className="collections-masonry-grid">
              {nodes.map((collection, index) => (
                <Link
                  key={collection.id}
                  className={`collections-masonry-card ${
                    index % 5 === 0 ? 'collections-masonry-card-large' : ''
                  }`}
                  prefetch="intent"
                  to={`/collections/${collection.handle}`}
                >
                  {collection.image ? (
                    <Image
                      alt={collection.image.altText || collection.title}
                      data={collection.image}
                      loading={index < 3 ? 'eager' : 'lazy'}
                      sizes="(min-width: 60em) 35vw, (min-width: 45em) 50vw, 100vw"
                    />
                  ) : (
                    <div className="collections-masonry-fallback" />
                  )}

                  <div className="collections-masonry-overlay" />
                  <div className="collections-masonry-copy">
                    <p>Curated edit</p>
                    <h2>{collection.title}</h2>
                    <span>Shop now</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </Pagination>
    </div>
  );
}

const COLLECTIONS_QUERY = `#graphql
  query StoreCollections(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    collections(
      first: $first
      last: $last
      before: $startCursor
      after: $endCursor
      sortKey: UPDATED_AT
    ) {
      nodes {
        id
        title
        handle
        image {
          id
          url
          altText
          width
          height
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
` as const;

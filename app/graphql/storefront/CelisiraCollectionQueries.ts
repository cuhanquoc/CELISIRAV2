import {
  CELISIRA_IMAGE_FRAGMENT,
  CELISIRA_MONEY_FRAGMENT,
  CELISIRA_PRODUCT_CARD_FRAGMENT,
} from './CelisiraHomeQueries';

export const CELISIRA_COLLECTION_PRODUCT_FRAGMENT = `#graphql
  ${CELISIRA_PRODUCT_CARD_FRAGMENT}
  fragment CelisiraCollectionProduct on Product {
    ...CelisiraProductCard
    availableForSale
    tags
  }
` as const;

export const CELISIRA_COLLECTION_DETAIL_QUERY = `#graphql
  ${CELISIRA_COLLECTION_PRODUCT_FRAGMENT}
  query CelisiraCollectionDetail(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      image {
        ...CelisiraImage
      }
      products(
        first: $first
        last: $last
        before: $startCursor
        after: $endCursor
      ) {
        nodes {
          ...CelisiraCollectionProduct
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
  ${CELISIRA_IMAGE_FRAGMENT}
` as const;

export const CELISIRA_COLLECTIONS_INDEX_QUERY = `#graphql
  ${CELISIRA_IMAGE_FRAGMENT}
  query CelisiraCollectionsIndex(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collections(
      first: $first
      last: $last
      before: $startCursor
      after: $endCursor
      sortKey: UPDATED_AT
      reverse: true
    ) {
      nodes {
        id
        handle
        title
        description
        image {
          ...CelisiraImage
        }
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        endCursor
        startCursor
      }
    }
  }
` as const;

export const CELISIRA_COLLECTION_FILTERS_QUERY = `#graphql
  ${CELISIRA_MONEY_FRAGMENT}
  query CelisiraCollectionFilters(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      products(first: 1) {
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
          id
          priceRange {
            minVariantPrice {
              ...CelisiraMoney
            }
            maxVariantPrice {
              ...CelisiraMoney
            }
          }
        }
      }
    }
  }
` as const;

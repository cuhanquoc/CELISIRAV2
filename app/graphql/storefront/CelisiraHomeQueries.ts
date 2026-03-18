export const CELISIRA_IMAGE_FRAGMENT = `#graphql
  fragment CelisiraImage on Image {
    id
    url
    altText
    width
    height
  }
` as const;

export const CELISIRA_MONEY_FRAGMENT = `#graphql
  fragment CelisiraMoney on MoneyV2 {
    amount
    currencyCode
  }
` as const;

export const CELISIRA_PRODUCT_CARD_FRAGMENT = `#graphql
  ${CELISIRA_IMAGE_FRAGMENT}
  ${CELISIRA_MONEY_FRAGMENT}
  fragment CelisiraProductCard on Product {
    id
    handle
    title
    vendor
    featuredImage {
      ...CelisiraImage
    }
    priceRange {
      minVariantPrice {
        ...CelisiraMoney
      }
      maxVariantPrice {
        ...CelisiraMoney
      }
    }
  }
` as const;

export const CELISIRA_COLLECTION_CARD_FRAGMENT = `#graphql
  ${CELISIRA_IMAGE_FRAGMENT}
  fragment CelisiraCollectionCard on Collection {
    id
    handle
    title
    description
    image {
      ...CelisiraImage
    }
  }
` as const;

export const CELISIRA_HOME_QUERY = `#graphql
  ${CELISIRA_COLLECTION_CARD_FRAGMENT}
  ${CELISIRA_PRODUCT_CARD_FRAGMENT}
  query CelisiraHome(
    $country: CountryCode
    $language: LanguageCode
    $featuredCollectionsFirst: Int = 4
    $recommendedProductsFirst: Int = 8
  ) @inContext(country: $country, language: $language) {
    collections(
      first: $featuredCollectionsFirst
      sortKey: UPDATED_AT
      reverse: true
    ) {
      nodes {
        ...CelisiraCollectionCard
      }
    }
    products(first: $recommendedProductsFirst, sortKey: CREATED_AT, reverse: true) {
      nodes {
        ...CelisiraProductCard
      }
    }
  }
` as const;

import {
  CELISIRA_IMAGE_FRAGMENT,
  CELISIRA_MONEY_FRAGMENT,
} from './CelisiraHomeQueries';

export const CELISIRA_PRODUCT_VARIANT_FRAGMENT = `#graphql
  ${CELISIRA_IMAGE_FRAGMENT}
  ${CELISIRA_MONEY_FRAGMENT}
  fragment CelisiraProductVariant on ProductVariant {
    id
    title
    sku
    availableForSale
    image {
      ...CelisiraImage
    }
    price {
      ...CelisiraMoney
    }
    compareAtPrice {
      ...CelisiraMoney
    }
    selectedOptions {
      name
      value
    }
    product {
      id
      handle
      title
    }
  }
` as const;

export const CELISIRA_PRODUCT_DETAIL_QUERY = `#graphql
  ${CELISIRA_PRODUCT_VARIANT_FRAGMENT}
  query CelisiraProductDetail(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      id
      handle
      title
      vendor
      description
      descriptionHtml
      tags
      seo {
        title
        description
      }
      selectedOrFirstAvailableVariant(
        selectedOptions: $selectedOptions
        ignoreUnknownOptions: true
        caseInsensitiveMatch: true
      ) {
        ...CelisiraProductVariant
      }
      adjacentVariants(selectedOptions: $selectedOptions) {
        ...CelisiraProductVariant
      }
      options {
        name
        optionValues {
          name
          firstSelectableVariant {
            ...CelisiraProductVariant
          }
          swatch {
            color
            image {
              previewImage {
                url
              }
            }
          }
        }
      }
    }
  }
` as const;

export const CELISIRA_PRODUCT_RECOMMENDATIONS_QUERY = `#graphql
  ${CELISIRA_IMAGE_FRAGMENT}
  ${CELISIRA_MONEY_FRAGMENT}
  query CelisiraProductRecommendations(
    $country: CountryCode
    $language: LanguageCode
    $productId: ID!
  ) @inContext(country: $country, language: $language) {
    productRecommendations(productId: $productId) {
      id
      handle
      title
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
  }
` as const;

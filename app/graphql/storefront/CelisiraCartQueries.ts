import {CART_QUERY_FRAGMENT} from '~/lib/fragments';

export const CELISIRA_CART_QUERY = `#graphql
  ${CART_QUERY_FRAGMENT}
  query CelisiraCart(
    $cartId: ID!
    $country: CountryCode
    $language: LanguageCode
    $numCartLines: Int = 100
  ) @inContext(country: $country, language: $language) {
    cart(id: $cartId) {
      ...CartApiQuery
    }
  }
` as const;

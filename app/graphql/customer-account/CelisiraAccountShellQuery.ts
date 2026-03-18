export const CELISIRA_ACCOUNT_SHELL_FRAGMENT = `#graphql
  fragment CelisiraAccountShellCustomer on Customer {
    id
    firstName
    lastName
    displayName
    emailAddress {
      emailAddress
    }
    phoneNumber {
      phoneNumber
    }
    defaultAddress {
      id
      formatted
      city
      territoryCode
      zip
    }
  }
` as const;

export const CELISIRA_ACCOUNT_SHELL_QUERY = `#graphql
  ${CELISIRA_ACCOUNT_SHELL_FRAGMENT}
  query CelisiraAccountShell($language: LanguageCode)
    @inContext(language: $language) {
    customer {
      ...CelisiraAccountShellCustomer
      orders(first: 1, sortKey: PROCESSED_AT, reverse: true) {
        nodes {
          id
        }
        pageInfo {
          hasNextPage
        }
      }
    }
  }
` as const;

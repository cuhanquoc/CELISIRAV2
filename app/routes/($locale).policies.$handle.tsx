import {
  isRouteErrorResponse,
  Link,
  useLoaderData,
  useRouteError,
} from 'react-router';
import type {Route} from './+types/($locale).policies.$handle';
import {type Shop} from '@shopify/hydrogen/storefront-api-types';

type SelectedPolicies = keyof Pick<
  Shop,
  | 'privacyPolicy'
  | 'shippingPolicy'
  | 'termsOfService'
  | 'refundPolicy'
  | 'subscriptionPolicy'
>;

const POLICY_HANDLE_MAP: Record<string, SelectedPolicies> = {
  'privacy-policy': 'privacyPolicy',
  'shipping-policy': 'shippingPolicy',
  'terms-of-service': 'termsOfService',
  'refund-policy': 'refundPolicy',
  'subscription-policy': 'subscriptionPolicy',
};

export const meta: Route.MetaFunction = ({data}) => {
  return [{title: `Celisira | ${data?.policy.title ?? 'Policy'}`}];
};

export async function loader({params, context}: Route.LoaderArgs) {
  if (!params.handle) {
    throw new Response('No handle was passed in', {status: 404});
  }

  const policyName = POLICY_HANDLE_MAP[params.handle];
  if (!policyName) {
    throw new Response('Unknown policy handle', {status: 404});
  }

  const data = await context.storefront.query(POLICY_CONTENT_QUERY, {
    variables: {
      privacyPolicy: false,
      shippingPolicy: false,
      termsOfService: false,
      refundPolicy: false,
      subscriptionPolicy: false,
      [policyName]: true,
      language: context.storefront.i18n?.language,
    },
  });

  const policy = data.shop?.[policyName];

  if (!policy) {
    throw new Response('Could not find the policy', {status: 404});
  }

  return {policy};
}

export default function Policy() {
  const {policy} = useLoaderData<typeof loader>();
  const policyBody = policy.body || '';
  const hasBodyContent = policyBody.replace(/<[^>]+>/g, '').trim().length > 0;

  return (
    <div className="policy">
      <div>
        <Link to="/policies">← Back to Policies</Link>
      </div>
      <h1>{policy.title}</h1>
      {hasBodyContent ? (
        <div dangerouslySetInnerHTML={{__html: policyBody}} />
      ) : (
        <section aria-live="polite">
          <p>
            This policy exists, but full legal copy has not been published yet.
          </p>
          <p>
            <Link to="/policies">All policies</Link> ·{' '}
            <Link to="/pages/about">About Celisira</Link> ·{' '}
            <Link to="/search">Search storefront</Link>
          </p>
        </section>
      )}
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const message = isRouteErrorResponse(error)
    ? `Policy destination unavailable (${error.status}).`
    : 'Policy destination unavailable.';

  return (
    <section className="policy" aria-live="polite">
      <h1>Policy Destination</h1>
      <p>{message}</p>
      <p>
        <Link to="/policies">Back to policies</Link> ·{' '}
        <Link to="/pages/about">About Celisira</Link>
      </p>
    </section>
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/Shop
const POLICY_CONTENT_QUERY = `#graphql
  query Policy(
    $country: CountryCode
    $language: LanguageCode
    $privacyPolicy: Boolean!
    $refundPolicy: Boolean!
    $shippingPolicy: Boolean!
    $subscriptionPolicy: Boolean!
    $termsOfService: Boolean!
  ) @inContext(language: $language, country: $country) {
    shop {
      privacyPolicy @include(if: $privacyPolicy) {
        body
        handle
        id
        title
        url
      }
      shippingPolicy @include(if: $shippingPolicy) {
        body
        handle
        id
        title
        url
      }
      termsOfService @include(if: $termsOfService) {
        body
        handle
        id
        title
        url
      }
      refundPolicy @include(if: $refundPolicy) {
        body
        handle
        id
        title
        url
      }
      subscriptionPolicy @include(if: $subscriptionPolicy) {
        body
        handle
        id
        title
        url
      }
    }
  }
` as const;

import {
  isRouteErrorResponse,
  Link,
  useLoaderData,
  useRouteError,
} from 'react-router';
import type {Route} from './+types/($locale).pages.$handle';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';

export const meta: Route.MetaFunction = ({data}) => {
  return [{title: `Celisira | ${data?.page.title ?? 'Page'}`}];
};

export async function loader(args: Route.LoaderArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context, request, params}: Route.LoaderArgs) {
  if (!params.handle) {
    throw new Error('Missing page handle');
  }

  const [{page}] = await Promise.all([
    context.storefront.query(PAGE_QUERY, {
      variables: {
        handle: params.handle,
      },
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!page) {
    throw new Response('Not Found', {status: 404});
  }

  redirectIfHandleIsLocalized(request, {handle: params.handle, data: page});

  return {
    page,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: Route.LoaderArgs) {
  return {};
}

export default function Page() {
  const {page} = useLoaderData<typeof loader>();
  const pageBody = page.body || '';
  const hasBodyContent = pageBody.replace(/<[^>]+>/g, '').trim().length > 0;

  return (
    <article className="page">
      <header>
        <p>CELISIRA</p>
        <h1>{page.title}</h1>
      </header>
      {hasBodyContent ? (
        <main dangerouslySetInnerHTML={{__html: pageBody}} />
      ) : (
        <main>
          <p>
            This page is being refined. Explore core destinations while we
            publish the complete editorial content.
          </p>
          <p>
            <Link to="/collections">Collections</Link> ·{' '}
            <Link to="/blogs">Journal</Link> · <Link to="/policies">Policies</Link>
          </p>
        </main>
      )}
    </article>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const title = isRouteErrorResponse(error) && error.status === 404
    ? 'Page Not Available'
    : 'Unable to Load This Page';
  const description = isRouteErrorResponse(error) && error.status === 404
    ? 'The destination exists in navigation, but the page content is not published yet.'
    : 'There was an issue loading this destination. Please try another route.';

  return (
    <section className="page" aria-live="polite">
      <h1>{title}</h1>
      <p>{description}</p>
      <p>
        <Link to="/collections">Shop collections</Link> ·{' '}
        <Link to="/blogs">Read the journal</Link> ·{' '}
        <Link to="/policies">View policies</Link>
      </p>
    </section>
  );
}

const PAGE_QUERY = `#graphql
  query Page(
    $language: LanguageCode,
    $country: CountryCode,
    $handle: String!
  )
  @inContext(language: $language, country: $country) {
    page(handle: $handle) {
      handle
      id
      title
      body
      seo {
        description
        title
      }
    }
  }
` as const;

import {
  isRouteErrorResponse,
  Link,
  useLoaderData,
  useRouteError,
} from 'react-router';
import type {Route} from './+types/($locale).blogs.$blogHandle.$articleHandle';
import {Image} from '@shopify/hydrogen';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';

export const meta: Route.MetaFunction = ({data}) => {
  return [{title: `Celisira | ${data?.article.title ?? 'Journal Article'}`}];
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
  const {blogHandle, articleHandle} = params;

  if (!articleHandle || !blogHandle) {
    throw new Response('Not found', {status: 404});
  }

  const [{blog}] = await Promise.all([
    context.storefront.query(ARTICLE_QUERY, {
      variables: {blogHandle, articleHandle},
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!blog?.articleByHandle) {
    throw new Response(null, {status: 404});
  }

  redirectIfHandleIsLocalized(
    request,
    {
      handle: articleHandle,
      data: blog.articleByHandle,
    },
    {
      handle: blogHandle,
      data: blog,
    },
  );

  const article = blog.articleByHandle;

  return {article};
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: Route.LoaderArgs) {
  return {};
}

export default function Article() {
  const {article} = useLoaderData<typeof loader>();
  const {title, image, contentHtml, author} = article;
  const articleBody = contentHtml || '';
  const hasBodyContent = articleBody.replace(/<[^>]+>/g, '').trim().length > 0;

  const publishedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(article.publishedAt));

  return (
    <div className="article">
      <p>
        <Link to={`/blogs/${article.blog.handle}`}>← Back to channel</Link> ·{' '}
        <Link to="/blogs">All journal channels</Link>
      </p>
      <h1>
        {title}
        <div>
          <time dateTime={article.publishedAt}>{publishedDate}</time> &middot;{' '}
          <address>{author?.name}</address>
        </div>
      </h1>

      {image && <Image data={image} sizes="90vw" loading="eager" />}
      {hasBodyContent ? (
        <div
          dangerouslySetInnerHTML={{__html: articleBody}}
          className="article"
        />
      ) : (
        <section aria-live="polite">
          <p>
            This article header is published, but full editorial copy is still
            being prepared.
          </p>
          <p>
            <Link to={`/blogs/${article.blog.handle}`}>Return to channel</Link>{' '}
            · <Link to="/search">Search storefront</Link>
          </p>
        </section>
      )}
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const statusText = isRouteErrorResponse(error)
    ? `This article could not be loaded (${error.status}).`
    : 'This article could not be loaded.';

  return (
    <section className="article" aria-live="polite">
      <h1>Article Unavailable</h1>
      <p>{statusText}</p>
      <p>
        <Link to="/blogs">Browse journal</Link> ·{' '}
        <Link to="/collections">Shop collections</Link>
      </p>
    </section>
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/blog#field-blog-articlebyhandle
const ARTICLE_QUERY = `#graphql
  query Article(
    $articleHandle: String!
    $blogHandle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(language: $language, country: $country) {
    blog(handle: $blogHandle) {
      handle
      articleByHandle(handle: $articleHandle) {
        handle
        title
        contentHtml
        publishedAt
        blog {
          handle
        }
        author: authorV2 {
          name
        }
        image {
          id
          altText
          url
          width
          height
        }
        seo {
          description
          title
        }
      }
    }
  }
` as const;

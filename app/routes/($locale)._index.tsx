import {Await, Link, useLoaderData} from 'react-router';
import type {Route} from './+types/($locale)._index';
import {Suspense} from 'react';
import {Image} from '@shopify/hydrogen';
import {MockShopNotice} from '~/components/MockShopNotice';

function formatMoney(amount: string, currencyCode: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    maximumFractionDigits: 2,
  }).format(Number(amount));
}

const HOME_PAGE_STYLES = `
  .home-v2{background:#f8f6f1;color:#0c0c0b}
  .home-v2-section{margin:0 auto;max-width:1280px;padding:5rem 1.5rem}
  .home-v2-section-head{margin-bottom:2rem}
  .home-v2-section-head h2{font-family:'Times New Roman',serif;font-size:clamp(2rem,6vw,4rem);font-weight:600;letter-spacing:-.02em;line-height:.95;margin:0}
  .home-v2-section-head-row{align-items:end;display:flex;justify-content:space-between}
  .home-v2-eyebrow{color:#8c8880;font-size:.65rem;font-weight:600;letter-spacing:.25em;margin:0 0 .6rem;text-transform:uppercase}
  .home-v2-link{border-bottom:1px solid currentColor;color:inherit;display:inline-flex;font-size:.72rem;font-weight:600;letter-spacing:.14em;text-decoration:none;text-transform:uppercase}
  .home-v2-link:hover{color:#bf9b5e}
  .home-v2-loading{color:#8c8880;font-size:.95rem}
  .home-v2-hero{min-height:86vh;position:relative}
  .home-v2-hero-overlay{background:linear-gradient(to top,rgba(0,0,0,.7),transparent 60%);inset:0;pointer-events:none;position:absolute;z-index:1}
  .home-v2-hero-slides{display:grid;grid-template-columns:repeat(3,1fr);min-height:86vh}
  .home-v2-hero-slide{color:#fff;overflow:hidden;position:relative;text-decoration:none}
  .home-v2-hero-slide img,.home-v2-hero-fallback{height:100%;object-fit:cover;width:100%;border-radius:0}
  .home-v2-hero-fallback{background:linear-gradient(150deg,#d9d1c6,#a89b8b)}
  .home-v2-hero-content{bottom:2rem;left:1.4rem;position:absolute;right:1.4rem;z-index:2}
  .home-v2-hero-content h1{font-family:'Times New Roman',serif;font-size:clamp(2rem,5vw,5rem);font-weight:600;line-height:.95;margin:0 0 .75rem}
  .home-v2-hero-content .home-v2-eyebrow{color:rgba(255,255,255,.74)}
  .home-v2-collections{background:#f8f6f1}
  .home-v2-collection-grid{display:grid;gap:1rem;grid-template-columns:repeat(12,1fr)}
  .home-v2-collection-card{border-radius:10px;color:#fff;grid-column:span 6;min-height:260px;overflow:hidden;position:relative;text-decoration:none}
  .home-v2-collection-card-featured{grid-column:span 12;min-height:380px}
  .home-v2-collection-card img,.home-v2-collection-fallback{height:100%;object-fit:cover;width:100%;border-radius:0}
  .home-v2-collection-fallback{background:linear-gradient(145deg,#cabda8,#8e7e6a)}
  .home-v2-collection-card::after{background:linear-gradient(to top,rgba(0,0,0,.66),transparent 50%);content:'';inset:0;position:absolute}
  .home-v2-collection-meta{bottom:1rem;left:1rem;position:absolute;right:1rem;z-index:1}
  .home-v2-collection-meta span{display:block;font-size:.7rem;letter-spacing:.2em;margin-bottom:.3rem;text-transform:uppercase}
  .home-v2-collection-meta h3{font-family:'Times New Roman',serif;font-size:clamp(1.5rem,4vw,2.6rem);line-height:1;margin:0}
  .home-v2-collection-meta p{color:rgba(255,255,255,.8);font-size:.82rem;margin:.55rem 0 0;max-width:34ch}
  .home-v2-trending{background:#fff;border-radius:14px}
  .home-v2-product-strip{display:grid;gap:1rem;grid-template-columns:repeat(4,minmax(0,1fr))}
  .home-v2-product-card{color:inherit;text-decoration:none}
  .home-v2-product-image-wrap{border-radius:12px;overflow:hidden}
  .home-v2-product-image-wrap img,.home-v2-product-fallback{aspect-ratio:3/4;display:block;object-fit:cover;width:100%}
  .home-v2-product-fallback{background:linear-gradient(150deg,#efebe5,#cbc1b5)}
  .home-v2-product-meta{padding:.8rem .2rem 0}
  .home-v2-product-meta h3{font-size:.9rem;margin:0 0 .35rem}
  .home-v2-product-meta p{color:#5c5850;margin:0}
  .home-v2-story{background:#0c0c0b;color:#fff;display:grid;grid-template-columns:1fr 1fr;margin-top:4rem}
  .home-v2-story-media img{border-radius:0;display:block;height:100%;object-fit:cover;width:100%}
  .home-v2-story-content{padding:4rem 2rem}
  .home-v2-story-content .home-v2-eyebrow{color:#bf9b5e}
  .home-v2-story-content h2{font-family:'Times New Roman',serif;font-size:clamp(2rem,6vw,4.2rem);line-height:.95;margin:0 0 1rem}
  .home-v2-story-content h2 em{color:#bf9b5e;font-style:italic}
  .home-v2-story-content p{color:rgba(255,255,255,.78);line-height:1.65;margin:0 0 2rem;max-width:46ch}
  .home-v2-story-stats{border-top:1px solid rgba(255,255,255,.15);display:grid;gap:1rem;grid-template-columns:repeat(2,minmax(0,1fr));padding-top:1.4rem}
  .home-v2-story-stats strong{color:#bf9b5e;display:block;font-family:'Times New Roman',serif;font-size:2rem;line-height:1}
  .home-v2-story-stats span{color:rgba(255,255,255,.65);font-size:.78rem;text-transform:uppercase}
  .home-v2-drop{background:#f8f6f1}
  .home-v2-drop-grid{align-items:center;display:grid;gap:1.5rem;grid-template-columns:1fr 1fr}
  .home-v2-drop-media{border-radius:16px;display:block;overflow:hidden}
  .home-v2-drop-media img{aspect-ratio:3/4;display:block;object-fit:cover;width:100%}
  .home-v2-drop-content h3{font-family:'Times New Roman',serif;font-size:clamp(2rem,5vw,3.2rem);line-height:1;margin:0 0 .8rem}
  .home-v2-drop-content p{color:#5c5850;line-height:1.65;margin:0 0 1.2rem;max-width:44ch}
  .home-v2-drop-price{align-items:baseline;display:flex;gap:.7rem;margin-bottom:1.25rem}
  .home-v2-drop-price span{font-family:'Times New Roman',serif;font-size:2rem}
  .home-v2-drop-price small{color:#8c8880}
  .home-v2-drop-actions{display:flex;flex-wrap:wrap;gap:.7rem}
  .home-v2-button{border:1px solid #0c0c0b;border-radius:999px;color:#0c0c0b;display:inline-flex;font-size:.72rem;font-weight:700;letter-spacing:.13em;padding:.85rem 1.3rem;text-decoration:none;text-transform:uppercase}
  .home-v2-button-dark{background:#0c0c0b;color:#fff}
  .home-v2-testimonials{background:#fff;border-radius:14px}
  .home-v2-testimonial-grid{display:grid;gap:1rem;grid-template-columns:repeat(3,minmax(0,1fr))}
  .home-v2-testimonial-card{background:#f8f6f1;border-radius:12px;padding:1.2rem}
  .home-v2-testimonial-card p{color:#3c3830;line-height:1.65;margin:0 0 1rem}
  .home-v2-testimonial-card h3{color:#8c8880;font-size:.85rem;margin:0}
  .home-v2-newsletter{background:#0c0c0b;color:#fff;padding:5rem 1.5rem;text-align:center}
  .home-v2-newsletter .home-v2-eyebrow{color:#bf9b5e}
  .home-v2-newsletter h2{font-family:'Times New Roman',serif;font-size:clamp(2rem,7vw,4rem);line-height:.95;margin:0 auto 1.5rem}
  .home-v2-newsletter-form{display:flex;gap:.6rem;justify-content:center;margin:0 auto;max-width:560px}
  .home-v2-newsletter-form input{background:transparent;border:1px solid rgba(255,255,255,.3);border-radius:999px;color:#fff;flex:1;font-size:.95rem;padding:.85rem 1rem}
  .home-v2-newsletter-form button{background:#bf9b5e;border:1px solid #bf9b5e;border-radius:999px;color:#0c0c0b;font-size:.72rem;font-weight:700;letter-spacing:.12em;padding:.85rem 1.3rem;text-transform:uppercase}
  .home-v2-newsletter-footnote{color:rgba(255,255,255,.52);font-size:.75rem;margin-top:.8rem}
  .home-v2-marketing{background:#f8f6f1;border-top:1px solid #e5e2d9;display:grid;gap:.6rem;grid-template-columns:repeat(4,minmax(0,1fr));margin:0;padding:1.4rem 1rem 2rem;text-align:center}
  .home-v2-marketing div{color:#5c5850;font-size:.7rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase}
  @media (max-width:64em){
    .home-v2-hero-slides{grid-template-columns:1fr}
    .home-v2-hero-slide-2,.home-v2-hero-slide-3{display:none}
    .home-v2-product-strip{grid-template-columns:repeat(2,minmax(0,1fr))}
    .home-v2-story{grid-template-columns:1fr}
    .home-v2-drop-grid,.home-v2-testimonial-grid{grid-template-columns:1fr}
    .home-v2-section-head-row{align-items:start;flex-direction:column;gap:.9rem}
    .home-v2-marketing{grid-template-columns:repeat(2,minmax(0,1fr))}
  }
  @media (max-width:40em){
    .home-v2-section{padding:3.5rem 1rem}
    .home-v2-collection-card,.home-v2-collection-card-featured{grid-column:span 12}
    .home-v2-newsletter-form{flex-direction:column}
    .home-v2-marketing{grid-template-columns:1fr}
  }
`;

export const meta: Route.MetaFunction = () => {
  return [{title: 'Celisira | Home'}];
};

export async function loader(args: Route.LoaderArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

type HomeCriticalData = Awaited<ReturnType<typeof loadCriticalData>>;
type HomeDeferredData = ReturnType<typeof loadDeferredData>;
type HeroProduct = HomeCriticalData['heroProducts'][number];
type HighlightCollection = HomeCriticalData['collectionHighlights'][number];
type FeaturedDropProduct = HomeCriticalData['featuredDrop'];
type TrendingProductsPromise = HomeDeferredData['trendingProducts'];

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context}: Route.LoaderArgs) {
  const [
    {collections: highlightCollections},
    {products: heroProducts},
    featured,
  ] = await Promise.all([
    context.storefront.query(HOME_COLLECTION_HIGHLIGHTS_QUERY),
    context.storefront.query(HOME_HERO_PRODUCTS_QUERY),
    context.storefront.query(HOME_FEATURED_DROP_QUERY),
    // Add other queries here, so that they are loaded in parallel
  ]);

  const featuredCollection = featured.collections.nodes[0];
  const featuredDrop = featuredCollection?.products.nodes[0] ?? null;

  return {
    isShopLinked: Boolean(context.env.PUBLIC_STORE_DOMAIN),
    heroProducts: heroProducts.nodes,
    collectionHighlights: highlightCollections.nodes,
    featuredCollection,
    featuredDrop,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: Route.LoaderArgs) {
  const trendingProducts = context.storefront
    .query(HOME_TRENDING_PRODUCTS_QUERY)
    .catch((error: Error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });

  return {
    trendingProducts,
  };
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  return (
    <main className="home-v2">
      <style>{HOME_PAGE_STYLES}</style>
      {data.isShopLinked ? null : <MockShopNotice />}
      <HeroSection products={data.heroProducts} />
      <CollectionHighlights collections={data.collectionHighlights} />
      <TrendingProducts products={data.trendingProducts} />
      <BrandStory />
      <FeaturedDrop
        product={data.featuredDrop}
        collectionHandle={data.featuredCollection?.handle}
      />
      <Testimonials />
      <Newsletter />
      <MarketingBlocks />
    </main>
  );
}

function HeroSection({
  products,
}: {
  products: HeroProduct[];
}) {
  if (!products.length) return null;

  return (
    <section className="home-v2-hero" aria-label="Hero">
      <div className="home-v2-hero-overlay" />
      <div className="home-v2-hero-slides">
        {products.slice(0, 3).map((product, index) => (
          <Link
            key={product.id}
            className={`home-v2-hero-slide home-v2-hero-slide-${index + 1}`}
            to={`/products/${product.handle}`}
          >
            {product.featuredImage ? (
              <Image
                data={product.featuredImage}
                sizes="100vw"
                alt={product.featuredImage.altText ?? product.title}
                loading={index === 0 ? 'eager' : 'lazy'}
              />
            ) : (
              <div className="home-v2-hero-fallback" />
            )}
            <div className="home-v2-hero-content">
              <p className="home-v2-eyebrow">
                {index === 0 ? 'Spring 2026' : 'Celisira Edit'}
              </p>
              <h1>{index === 0 ? 'Wear Your Story.' : product.title}</h1>
              <span className="home-v2-link">Shop this look</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function CollectionHighlights({
  collections,
}: {
  collections: HighlightCollection[];
}) {
  if (!collections.length) return null;

  return (
    <section className="home-v2-section home-v2-collections">
      <div className="home-v2-section-head">
        <p className="home-v2-eyebrow">Browse By</p>
        <h2>Collection Highlights</h2>
      </div>
      <div className="home-v2-collection-grid">
        {collections.map((collection, index) => (
          <Link
            key={collection.id}
            className={`home-v2-collection-card ${
              index === 0 ? 'home-v2-collection-card-featured' : ''
            }`}
            to={`/collections/${collection.handle}`}
          >
            {collection.image ? (
              <Image
                data={collection.image}
                sizes="(min-width: 768px) 33vw, 100vw"
                alt={collection.image.altText ?? collection.title}
                loading={index < 2 ? 'eager' : 'lazy'}
              />
            ) : (
              <div className="home-v2-collection-fallback" />
            )}
            <div className="home-v2-collection-meta">
              <span>Collection edit</span>
              <h3>{collection.title}</h3>
              <p>{collection.description || 'Discover curated essentials.'}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function TrendingProducts({
  products,
}: {
  products: TrendingProductsPromise;
}) {
  return (
    <section className="home-v2-section home-v2-trending">
      <div className="home-v2-section-head home-v2-section-head-row">
        <div>
          <p className="home-v2-eyebrow">Trending Now</p>
          <h2>Curated For You</h2>
        </div>
        <Link className="home-v2-link" to="/collections">
          View all styles
        </Link>
      </div>
      <Suspense
        fallback={<div className="home-v2-loading">Loading products…</div>}
      >
        <Await resolve={products}>
          {(response) =>
            response ? (
              <div className="home-v2-product-strip">
                {response.products.nodes.map((product, index) => (
                  <Link
                    key={product.id}
                    className="home-v2-product-card"
                    to={`/products/${product.handle}`}
                  >
                    <div className="home-v2-product-image-wrap">
                      {product.featuredImage ? (
                        <Image
                          data={product.featuredImage}
                          sizes="(min-width: 768px) 25vw, 50vw"
                          alt={product.featuredImage.altText ?? product.title}
                          loading={index < 2 ? 'eager' : 'lazy'}
                        />
                      ) : (
                        <div className="home-v2-product-fallback" />
                      )}
                    </div>
                    <div className="home-v2-product-meta">
                      <h3>{product.title}</h3>
                      <p>
                        {formatMoney(
                          product.priceRange.minVariantPrice.amount,
                          product.priceRange.minVariantPrice.currencyCode,
                        )}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="home-v2-loading">
                Trending products unavailable.
              </div>
            )
          }
        </Await>
      </Suspense>
    </section>
  );
}

function BrandStory() {
  return (
    <section className="home-v2-story">
      <div className="home-v2-story-media">
        <img
          src="https://images.unsplash.com/photo-1708515902649-1f5b92fe5098?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1400"
          alt="Celisira brand story"
          loading="lazy"
        />
      </div>
      <div className="home-v2-story-content">
        <p className="home-v2-eyebrow">Our Story</p>
        <h2>
          Crafted With <em>Intention.</em>
        </h2>
        <p>
          Celisira was born from a simple belief: every woman deserves to wear
          pieces that move with her life, from quiet mornings to golden
          evenings.
        </p>
        <div className="home-v2-story-stats">
          <div>
            <strong>200+</strong>
            <span>Unique designs</span>
          </div>
          <div>
            <strong>50+</strong>
            <span>Countries shipped</span>
          </div>
          <div>
            <strong>2019</strong>
            <span>Established</span>
          </div>
          <div>
            <strong>100%</strong>
            <span>Free returns</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturedDrop({
  product,
  collectionHandle,
}: {
  product: FeaturedDropProduct;
  collectionHandle?: string;
}) {
  if (!product) return null;

  return (
    <section className="home-v2-section home-v2-drop">
      <div className="home-v2-section-head">
        <p className="home-v2-eyebrow">Drop Of The Season</p>
        <h2>The One Everyone&apos;s Wearing</h2>
      </div>
      <div className="home-v2-drop-grid">
        <Link className="home-v2-drop-media" to={`/products/${product.handle}`}>
          {product.featuredImage ? (
            <Image
              data={product.featuredImage}
              sizes="(min-width: 768px) 50vw, 100vw"
              alt={product.featuredImage.altText ?? product.title}
              loading="lazy"
            />
          ) : (
            <div className="home-v2-product-fallback" />
          )}
        </Link>
        <div className="home-v2-drop-content">
          <h3>{product.title}</h3>
          <p>
            {product.description ||
              'A signature piece designed for effortless elegance.'}
          </p>
          <div className="home-v2-drop-price">
            <span>
              {formatMoney(
                product.priceRange.minVariantPrice.amount,
                product.priceRange.minVariantPrice.currencyCode,
              )}
            </span>
            <small>
              {formatMoney(
                product.priceRange.maxVariantPrice.amount,
                product.priceRange.maxVariantPrice.currencyCode,
              )}
            </small>
          </div>
          <div className="home-v2-drop-actions">
            <Link
              className="home-v2-button home-v2-button-dark"
              to={`/products/${product.handle}`}
            >
              Shop Featured Drop
            </Link>
            <Link
              className="home-v2-button"
              to={
                collectionHandle
                  ? `/collections/${collectionHandle}`
                  : '/collections'
              }
            >
              Explore Collection
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const quotes = [
    {
      name: 'Sophie Laurent',
      copy: 'The fit is exceptional and the fabric feels far more premium than expected.',
    },
    {
      name: 'Mia Chen',
      copy: 'Every order arrives beautifully packed and ready to wear for any event.',
    },
    {
      name: 'Amara Osei',
      copy: 'Celisira has become my go-to for polished, comfortable pieces.',
    },
  ];

  return (
    <section className="home-v2-section home-v2-testimonials">
      <div className="home-v2-section-head">
        <p className="home-v2-eyebrow">Real Women, Real Stories</p>
        <h2>What She Said</h2>
      </div>
      <div className="home-v2-testimonial-grid">
        {quotes.map((quote) => (
          <article key={quote.name} className="home-v2-testimonial-card">
            <p>&ldquo;{quote.copy}&rdquo;</p>
            <h3>{quote.name}</h3>
          </article>
        ))}
      </div>
    </section>
  );
}

function Newsletter() {
  return (
    <section className="home-v2-newsletter">
      <p className="home-v2-eyebrow">Join The Inner Circle</p>
      <h2>
        Early access, private drops,
        <br />
        and styling edits.
      </h2>
      <div
        className="home-v2-newsletter-form"
        role="group"
        aria-label="Newsletter signup coming soon"
      >
        <input
          name="email"
          type="email"
          placeholder="you@example.com"
          required
        />
        <button type="button">Join</button>
      </div>
      <p className="home-v2-newsletter-footnote">
        No spam. Unsubscribe anytime.
      </p>
    </section>
  );
}

function MarketingBlocks() {
  return (
    <section className="home-v2-marketing">
      <div>Free shipping over $50</div>
      <div>30-day returns</div>
      <div>Secure checkout</div>
      <div>Sustainably made</div>
    </section>
  );
}

const HOME_COLLECTION_HIGHLIGHTS_QUERY = `#graphql
  query HomeCollectionHighlights($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 6, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        id
        title
        handle
        description
        image {
          id
          url
          altText
          width
          height
        }
      }
    }
  }
` as const;

const HOME_HERO_PRODUCTS_QUERY = `#graphql
  query HomeHeroProducts($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 3, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        id
        title
        handle
        featuredImage {
          id
          url
          altText
          width
          height
        }
      }
    }
  }
` as const;

const HOME_TRENDING_PRODUCTS_QUERY = `#graphql
  query HomeTrendingProducts($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 8, sortKey: BEST_SELLING) {
      nodes {
        id
        title
        handle
        featuredImage {
          id
          url
          altText
          width
          height
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
      }
    }
  }
` as const;

const HOME_FEATURED_DROP_QUERY = `#graphql
  query HomeFeaturedDrop($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        id
        handle
        products(first: 1, sortKey: BEST_SELLING) {
          nodes {
            id
            title
            handle
            description
            featuredImage {
              id
              url
              altText
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
          }
        }
      }
    }
  }
` as const;

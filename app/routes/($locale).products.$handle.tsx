import {Suspense, useEffect, useMemo, useState} from 'react';
import {Await, Link, useLoaderData} from 'react-router';
import type {Route} from './+types/($locale).products.$handle';
import {
  Analytics,
  getAdjacentAndFirstAvailableVariants,
  getProductOptions,
  getSelectedProductOptions,
  Image,
  useOptimisticVariant,
  useSelectedOptionInUrlParam,
} from '@shopify/hydrogen';
import {ProductPrice} from '~/components/ProductPrice';
import {ProductForm} from '~/components/ProductForm';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {useVariantUrl} from '~/lib/variants';

export const meta: Route.MetaFunction = ({data}) => {
  const product = data?.product;

  return [
    {title: product?.seo?.title || product?.title || 'Product'},
    {
      name: 'description',
      content: product?.seo?.description || product?.description || '',
    },
    {
      rel: 'canonical',
      href: data?.canonicalPath || `/products/${product?.handle}`,
    },
  ];
};

export async function loader(args: Route.LoaderArgs) {
  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args, criticalData.product.id);

  return {...criticalData, ...deferredData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context, params, request}: Route.LoaderArgs) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const [{product}] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: {handle, selectedOptions: getSelectedProductOptions(request)},
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  // The API handle might be localized, so redirect to the localized handle
  redirectIfHandleIsLocalized(request, {handle, data: product});

  const canonicalUrl = new URL(request.url);

  return {
    product,
    canonicalPath: canonicalUrl.pathname,
    shareUrl: canonicalUrl.toString(),
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: Route.LoaderArgs, productId: string) {
  const relatedProducts = context.storefront
    .query(PRODUCT_RECOMMENDATIONS_QUERY, {
      variables: {productId},
    })
    .catch((error: Error) => {
      console.error(error);
      return null;
    });

  return {
    relatedProducts,
  };
}

export default function Product() {
  const {product, relatedProducts, shareUrl} = useLoaderData<typeof loader>();

  // Optimistically selects a variant with given available variant information
  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  // Sets the search param to the selected variant without navigation
  // only when no search params are set in the url
  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  // Get the product options array
  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  const {title, descriptionHtml} = product;
  type GalleryImage =
    | NonNullable<typeof selectedVariant.image>
    | (typeof product.images.nodes)[number];

  const galleryImages = useMemo(() => {
    const deduped = new Map<string, GalleryImage>();
    const variantImage = selectedVariant.image;

    if (variantImage?.url) {
      deduped.set(variantImage.id || variantImage.url, variantImage);
    }

    product.images.nodes.forEach((image) => {
      if (image?.url) {
        deduped.set(image.id || image.url, image);
      }
    });

    return [...deduped.values()];
  }, [product, selectedVariant]);

  const [activeImageKey, setActiveImageKey] = useState<string | null>(
    galleryImages[0]?.id || galleryImages[0]?.url || null,
  );

  useEffect(() => {
    setActiveImageKey(galleryImages[0]?.id || galleryImages[0]?.url || null);
  }, [galleryImages]);

  const activeImage =
    galleryImages.find((image) => (image.id || image.url) === activeImageKey) ||
    galleryImages[0] ||
    null;

  const encodedShareUrl = encodeURIComponent(shareUrl);
  const encodedShareTitle = encodeURIComponent(title);

  return (
    <div className="pdp">
      <section className="pdp-overview">
        <div className="pdp-gallery">
          <div className="pdp-gallery-main">
            {activeImage ? (
              <Image
                alt={activeImage.altText || title}
                data={activeImage}
                key={activeImage.id || activeImage.url}
                sizes="(min-width: 64em) 56vw, 100vw"
              />
            ) : (
              <div className="pdp-gallery-placeholder" />
            )}
          </div>

          {galleryImages.length > 1 ? (
            <div className="pdp-gallery-thumbs" aria-label="Product gallery">
              {galleryImages.map((image) => {
                const key = image.id || image.url;
                const isActive = key === activeImageKey;

                return (
                  <button
                    key={key}
                    type="button"
                    className={`pdp-gallery-thumb${isActive ? ' is-active' : ''}`}
                    onClick={() => setActiveImageKey(key)}
                    aria-label={`View image ${title}`}
                    aria-pressed={isActive}
                  >
                    <Image
                      alt={image.altText || title}
                      data={image}
                      sizes="120px"
                      loading="lazy"
                    />
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>

        <aside className="pdp-info" aria-label="Product details">
          <p className="pdp-review-teaser" aria-label="Review summary">
            <span aria-hidden="true">★★★★★</span> 4.8/5 from verified buyers
          </p>
          <h1>{title}</h1>
          <p className="pdp-vendor">{product.vendor}</p>
          <ProductPrice
            price={selectedVariant?.price}
            compareAtPrice={selectedVariant?.compareAtPrice}
          />
          <p className="pdp-tax-note">
            Taxes included. Shipping calculated at checkout.
          </p>

          <ProductForm
            productOptions={productOptions}
            selectedVariant={selectedVariant}
          />

          <div className="pdp-share" aria-label="Share product">
            <p>Share</p>
            <div className="pdp-share-links">
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodedShareUrl}`}
                target="_blank"
                rel="noreferrer"
              >
                Facebook
              </a>
              <a
                href={`https://x.com/intent/tweet?url=${encodedShareUrl}&text=${encodedShareTitle}`}
                target="_blank"
                rel="noreferrer"
              >
                X
              </a>
              <a href={`mailto:?subject=${encodedShareTitle}&body=${encodedShareUrl}`}>
                Email
              </a>
            </div>
          </div>
        </aside>
      </section>

      <section className="pdp-editorial" aria-labelledby="pdp-editorial-heading">
        <div className="pdp-editorial-copy">
          <h2 id="pdp-editorial-heading">The Aesthetic Narrative</h2>
          <p>
            Designed for elevated everyday wear, this piece balances structure
            and softness for a silhouette that moves with confidence.
          </p>
          <p>
            Crafted in small batches and finished with premium detail work,
            Celisira focuses on timeless wardrobe language over trend cycles.
          </p>
          <p className="pdp-editorial-link">International shipping available.</p>
        </div>
        {galleryImages[1] ? (
          <div className="pdp-editorial-image">
            <Image
              alt={galleryImages[1].altText || title}
              data={galleryImages[1]}
              loading="lazy"
              sizes="(min-width: 64em) 44vw, 100vw"
            />
          </div>
        ) : null}
      </section>

      <section className="pdp-description" aria-labelledby="pdp-description-heading">
        <h2 id="pdp-description-heading">Description</h2>
        <div dangerouslySetInnerHTML={{__html: descriptionHtml}} />
      </section>

      <section
        className="pdp-specifications"
        aria-labelledby="pdp-specifications-heading"
      >
        <h2 id="pdp-specifications-heading">Luxe Specifications</h2>
        <div className="pdp-spec-grid">
          <article>
            <h3>Material Story</h3>
            <p>
              Premium fabric selection with breathable comfort and subtle
              structure for seasonless layering.
            </p>
          </article>
          <article>
            <h3>Tailored Finish</h3>
            <p>
              Clean seam construction and refined patterning to keep shape and
              drape through repeated wear.
            </p>
          </article>
          <article>
            <h3>Care Guide</h3>
            <p>
              Gentle wash or professional cleaning recommended to preserve hand
              feel, tone, and long-term fit.
            </p>
          </article>
        </div>
      </section>

      <Suspense fallback={<section className="pdp-related">Loading...</section>}>
        <Await resolve={relatedProducts}>
          {(response) => {
            const products =
              response?.productRecommendations?.filter(
                (item: {id: string}) => item.id !== product.id,
              ) ?? [];

            if (products.length === 0) return null;

            return (
              <section className="pdp-related" aria-labelledby="pdp-related-heading">
                <div className="pdp-related-head">
                  <h2 id="pdp-related-heading">Pairs Well With</h2>
                  <p>Complete the look with complementary pieces.</p>
                </div>
                <div className="pdp-related-grid">
                  {products
                    .slice(0, 4)
                    .map((relatedProduct: (typeof products)[number]) => (
                    <RelatedProductCard
                      key={relatedProduct.id}
                      product={relatedProduct}
                    />
                  ))}
                </div>
              </section>
            );
          }}
        </Await>
      </Suspense>

      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: selectedVariant?.price.amount || '0',
              vendor: product.vendor,
              variantId: selectedVariant?.id || '',
              variantTitle: selectedVariant?.title || '',
              quantity: 1,
            },
          ],
        }}
      />
    </div>
  );
}

function RelatedProductCard({
  product,
}: {
  product: {
    id: string;
    handle: string;
    title: string;
    featuredImage?: {
      id?: string | null;
      url: string;
      altText?: string | null;
      width?: number | null;
      height?: number | null;
    } | null;
    priceRange: {
      minVariantPrice: {
        amount: string;
        currencyCode: string;
      };
    };
  };
}) {
  const variantUrl = useVariantUrl(product.handle);

  return (
    <Link className="pdp-related-card" prefetch="intent" to={variantUrl}>
      {product.featuredImage ? (
        <Image
          alt={product.featuredImage.altText || product.title}
          data={product.featuredImage}
          sizes="(min-width: 64em) 22vw, 46vw"
          loading="lazy"
        />
      ) : (
        <div className="pdp-related-placeholder" />
      )}
      <h3>{product.title}</h3>
      <p>{`${product.priceRange.minVariantPrice.amount} ${product.priceRange.minVariantPrice.currencyCode}`}</p>
    </Link>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
` as const;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    encodedVariantExistence
    encodedVariantAvailability
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
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
    images(first: 10) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    adjacentVariants (selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;

const PRODUCT_RECOMMENDATIONS_QUERY = `#graphql
  query ProductRecommendations(
    $country: CountryCode
    $language: LanguageCode
    $productId: ID!
  ) @inContext(country: $country, language: $language) {
    productRecommendations(productId: $productId) {
      id
      handle
      title
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      featuredImage {
        id
        url
        altText
        width
        height
      }
    }
  }
` as const;

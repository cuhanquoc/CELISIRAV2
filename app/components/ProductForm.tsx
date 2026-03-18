import {Link, useNavigate} from 'react-router';
import {type MappedProductOptions} from '@shopify/hydrogen';
import type {
  Maybe,
  ProductOptionValueSwatch,
} from '@shopify/hydrogen/storefront-api-types';
import {AddToCartButton} from './AddToCartButton';
import {useAside} from './Aside';
import type {ProductFragment} from 'storefrontapi.generated';

export function ProductForm({
  productOptions,
  selectedVariant,
}: {
  productOptions: MappedProductOptions[];
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
}) {
  const navigate = useNavigate();
  const {open} = useAside();
  return (
    <div className="product-form">
      {productOptions.map((option) => {
        // If there is only a single value in the option values, don't display the option
        if (option.optionValues.length === 1) return null;
        const isSizeOption = /size/i.test(option.name);
        const selectedValue = option.optionValues.find((value) => value.selected);

        return (
          <div className="product-options" key={option.name}>
            <p className="pdp-option-label">
              {option.name} :{' '}
              <span>{selectedValue?.name ?? selectedVariant?.title ?? '—'}</span>
            </p>
            <div
              className={`product-options-grid${
                isSizeOption ? ' product-options-grid-size' : ''
              }`}
            >
              {option.optionValues.map((value) => {
                const {
                  name,
                  handle,
                  variantUriQuery,
                  selected,
                  available,
                  exists,
                  isDifferentProduct,
                  swatch,
                } = value;

                if (isDifferentProduct) {
                  // SEO
                  // When the variant is a combined listing child product
                  // that leads to a different url, we need to render it
                  // as an anchor tag
                  return (
                    <Link
                      className={`product-options-item${
                        selected ? ' is-selected' : ''
                      }${!available ? ' is-unavailable' : ''}`}
                      key={option.name + name}
                      prefetch="intent"
                      preventScrollReset
                      replace
                      to={`/products/${handle}?${variantUriQuery}`}
                    >
                      <ProductOptionSwatch
                        swatch={swatch}
                        name={name}
                        useChip={isSizeOption}
                      />
                    </Link>
                  );
                } else {
                  // SEO
                  // When the variant is an update to the search param,
                  // render it as a button with javascript navigating to
                  // the variant so that SEO bots do not index these as
                  // duplicated links
                  return (
                    <button
                      type="button"
                      className={`product-options-item${
                        exists && !selected ? ' link' : ''
                      }${selected ? ' is-selected' : ''}${
                        !available ? ' is-unavailable' : ''
                      }`}
                      key={option.name + name}
                      disabled={!exists}
                      onClick={() => {
                        if (!selected) {
                          void navigate(`?${variantUriQuery}`, {
                            replace: true,
                            preventScrollReset: true,
                          });
                        }
                      }}
                    >
                      <ProductOptionSwatch
                        swatch={swatch}
                        name={name}
                        useChip={isSizeOption}
                      />
                    </button>
                  );
                }
              })}
            </div>
          </div>
        );
      })}
      <AddToCartButton
        className="pdp-add-to-cart"
        disabled={!selectedVariant || !selectedVariant.availableForSale}
        onClick={() => {
          open('cart');
        }}
        lines={
          selectedVariant
            ? [
                {
                  merchandiseId: selectedVariant.id,
                  quantity: 1,
                  selectedVariant,
                },
              ]
            : []
        }
      >
        {selectedVariant?.availableForSale
          ? 'Add to shopping bag'
          : 'Sold out'}
      </AddToCartButton>
    </div>
  );
}

function ProductOptionSwatch({
  swatch,
  name,
  useChip,
}: {
  swatch?: Maybe<ProductOptionValueSwatch> | undefined;
  name: string;
  useChip?: boolean;
}) {
  const image = swatch?.image?.previewImage?.url;
  const color = swatch?.color;

  if (useChip || (!image && !color)) {
    return <span className="pdp-option-chip">{name}</span>;
  }

  return (
    <span
      aria-label={name}
      className="product-option-label-swatch"
      style={{
        backgroundColor: color || 'transparent',
      }}
    >
      {!!image && (
        <img
          src={image}
          alt={name}
          loading="lazy"
          decoding="async"
          width={20}
          height={20}
        />
      )}
      <span className="sr-only">{name}</span>
    </span>
  );
}

import type {ProductQuery} from 'storefrontapi.generated';
import {asPath, mapImage, mapMoney, mapSeo, sanitizeText} from './shared';

export interface ProductOptionValueViewModel {
  name: string;
  isSelected: boolean;
  isAvailable: boolean;
  swatchColor: string | null;
  swatchImageUrl: string | null;
}

export interface ProductOptionViewModel {
  name: string;
  values: ProductOptionValueViewModel[];
}

export interface ProductVariantViewModel {
  id: string;
  title: string;
  sku: string;
  availableForSale: boolean;
  image: ReturnType<typeof mapImage>;
  price: ReturnType<typeof mapMoney>;
  compareAtPrice: ReturnType<typeof mapMoney>;
}

export interface ProductPageViewModel {
  id: string;
  handle: string;
  title: string;
  vendor: string;
  description: string;
  descriptionHtml: string;
  seo: ReturnType<typeof mapSeo>;
  href: string;
  selectedVariant: ProductVariantViewModel | null;
  options: ProductOptionViewModel[];
}

interface CelisiraProductQueryLike {
  product?: {
    id: string;
    handle: string;
    title: string;
    vendor?: string | null;
    description?: string | null;
    descriptionHtml?: string | null;
    seo?: Parameters<typeof mapSeo>[0];
    selectedOrFirstAvailableVariant?: ProductVariantNode | null;
    options: ProductQuery['product'] extends null
      ? never
      : NonNullable<ProductQuery['product']>['options'];
  } | null;
}

type ProductVariantNode = NonNullable<
  NonNullable<ProductQuery['product']>['selectedOrFirstAvailableVariant']
>;

function mapVariant(
  variant: ProductVariantNode | null | undefined,
): ProductVariantViewModel | null {
  if (!variant) return null;

  return {
    id: variant.id,
    title: sanitizeText(variant.title),
    sku: variant.sku || '',
    availableForSale: variant.availableForSale,
    image: mapImage(variant.image, variant.product.title),
    price: mapMoney(variant.price),
    compareAtPrice: mapMoney(variant.compareAtPrice),
  };
}

export function mapProductQueryToViewModel(
  query: ProductQuery,
): ProductPageViewModel | null {
  if (!query.product) return null;

  const selectedVariant = query.product.selectedOrFirstAvailableVariant;

  return {
    id: query.product.id,
    handle: query.product.handle,
    title: sanitizeText(query.product.title),
    vendor: sanitizeText(query.product.vendor),
    description: sanitizeText(query.product.description),
    descriptionHtml: query.product.descriptionHtml || '',
    seo: mapSeo(
      query.product.seo,
      query.product.title,
      query.product.description || '',
    ),
    href: asPath(`products/${query.product.handle}`),
    selectedVariant: mapVariant(selectedVariant),
    options: query.product.options.map((option) => ({
      name: sanitizeText(option.name),
      values: option.optionValues.map((value) => ({
        name: sanitizeText(value.name),
        isSelected: selectedVariant?.selectedOptions.some(
          (selectedOption) =>
            selectedOption.name === option.name &&
            selectedOption.value === value.name,
        ) || false,
        isAvailable: Boolean(value.firstSelectableVariant),
        swatchColor: value.swatch?.color ?? null,
        swatchImageUrl: value.swatch?.image?.previewImage?.url ?? null,
      })),
    })),
  };
}

export function mapCelisiraProductQueryToViewModel(
  query: CelisiraProductQueryLike,
): ProductPageViewModel | null {
  if (!query.product) return null;

  const selectedVariant = query.product.selectedOrFirstAvailableVariant;

  return {
    id: query.product.id,
    handle: query.product.handle,
    title: sanitizeText(query.product.title),
    vendor: sanitizeText(query.product.vendor),
    description: sanitizeText(query.product.description),
    descriptionHtml: query.product.descriptionHtml || '',
    seo: mapSeo(
      query.product.seo,
      query.product.title,
      query.product.description || '',
    ),
    href: asPath(`products/${query.product.handle}`),
    selectedVariant: mapVariant(selectedVariant),
    options: query.product.options.map((option) => ({
      name: sanitizeText(option.name),
      values: option.optionValues.map((value) => ({
        name: sanitizeText(value.name),
        isSelected: selectedVariant?.selectedOptions.some(
          (selectedOption) =>
            selectedOption.name === option.name &&
            selectedOption.value === value.name,
        ) || false,
        isAvailable: Boolean(value.firstSelectableVariant),
        swatchColor: value.swatch?.color ?? null,
        swatchImageUrl: value.swatch?.image?.previewImage?.url ?? null,
      })),
    })),
  };
}
